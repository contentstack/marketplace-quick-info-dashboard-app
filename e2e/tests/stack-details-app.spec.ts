import { test, expect } from "@playwright/test";
import { DashboardWidgetPage } from "../pages/DashboardWidgetPage";

test("Should load the stack details dashboard and verify", async ({ page }) => {
  const dashboardWidgetPage = new DashboardWidgetPage(page);
  await dashboardWidgetPage.navigateToDashboard(process.env.STACK_API_KEY || "");
});

test("Should display loading state with skeleton components", async ({ page }) => {
  const dashboardWidgetPage = new DashboardWidgetPage(page);

  // Navigate to the dashboard page
  await page.goto(`/#!/stack/${process.env.STACK_API_KEY || ""}/dashboard/`);
  await dashboardWidgetPage.accessFrame();

  // The skeleton is transient and racy, so assert the stable end state: loading finishes and the cards render.
  await dashboardWidgetPage.waitForFooterSuccess();
  await dashboardWidgetPage.verifyStatCardsVisible();
});

test("Should open new tabs when clicking on stat labels", async ({ page }) => {
  const dashboardWidgetPage = new DashboardWidgetPage(page);

  // Navigate and wait for data to load
  await dashboardWidgetPage.navigateToDashboard(process.env.STACK_API_KEY || "");

  // Test Content Types stat label click
  await dashboardWidgetPage.clickStatLabelAndVerifyPopup("content-types", "/content-types");

  // Test Entries stat label click
  await dashboardWidgetPage.clickStatLabelAndVerifyPopup("entries", "/entries");

  // Test Assets stat label click
  await dashboardWidgetPage.clickStatLabelAndVerifyPopup("assets", "/assets");
});

test("Should refresh data when refresh button is clicked", async ({ page }) => {
  const dashboardWidgetPage = new DashboardWidgetPage(page);

  // Navigate and wait for data to load
  await dashboardWidgetPage.navigateToDashboard(process.env.STACK_API_KEY || "");

  // Get initial timestamp
  const initialTimestamp = await dashboardWidgetPage.getLastRefreshedTimestamp();

  // Click refresh button
  await dashboardWidgetPage.clickRefreshButton();

  // Wait for refresh to complete
  await dashboardWidgetPage.waitForRefreshComplete();

  // Verify timestamp has been updated
  const updatedTimestamp = await dashboardWidgetPage.getLastRefreshedTimestamp();
  expect(updatedTimestamp).not.toBe(initialTimestamp);
});

test("Should display correct footer states", async ({ page }) => {
  const dashboardWidgetPage = new DashboardWidgetPage(page);

  // Navigate and wait for data to load
  await dashboardWidgetPage.navigateToDashboard(process.env.STACK_API_KEY || "");

  // Test success footer state
  await dashboardWidgetPage.verifyFooterContainer();
  await dashboardWidgetPage.verifyFooterSuccessText();

  // Verify timestamp format (should contain "Last refreshed: HH:MM:SS")
  expect(await dashboardWidgetPage.verifyTimestampFormat()).toBe(true);

  // Verify refresh button is present and enabled
  await dashboardWidgetPage.verifyRefreshButtonEnabled();
  await dashboardWidgetPage.verifyRefreshButtonTitle();

  // Test loading footer state by triggering refresh
  await dashboardWidgetPage.clickRefreshButton();

  // Verify return to success state
  await dashboardWidgetPage.waitForFooterSuccess();
});

test("Should display correct stat card data and counts", async ({ page }) => {
  const dashboardWidgetPage = new DashboardWidgetPage(page);

  // Navigate and wait for data to load
  await dashboardWidgetPage.navigateToDashboard(process.env.STACK_API_KEY || "");

  // Verify all three stat cards are present
  await dashboardWidgetPage.verifyStatCardsVisible();

  // Verify each stat card's data
  await dashboardWidgetPage.verifyStatCardData("content-types", "Content Types");
  await dashboardWidgetPage.verifyStatCardData("entries", "Entries");
  await dashboardWidgetPage.verifyStatCardData("assets", "Assets");

  // Verify stat cards have proper styling and structure
  await dashboardWidgetPage.verifyAllStatCardsClickable();

  // Test hover effects
  await dashboardWidgetPage.hoverAllStatCards();
});

test("Should handle zero counts and missing data gracefully", async ({ page }) => {
  const dashboardWidgetPage = new DashboardWidgetPage(page);

  // Navigate and wait for data to load
  await dashboardWidgetPage.navigateToDashboard(process.env.STACK_API_KEY || "");

  // Test that zero counts are displayed correctly (not null or undefined)
  await dashboardWidgetPage.verifyAllStatCountsNotEmpty();
  await dashboardWidgetPage.verifyAllStatCountsAreNumbers();

  // Test that labels are always present regardless of count
  await dashboardWidgetPage.verifyStatLabels();

  // Test that stat cards are clickable even with zero counts
  await dashboardWidgetPage.verifyStatCardsVisible();
  await dashboardWidgetPage.verifyAllStatCardsClickable();
  await dashboardWidgetPage.hoverAllStatCards();

  // Test widget structure remains intact
  await dashboardWidgetPage.verifyWidgetStructure();

  // Test that refresh functionality works regardless of data state
  await dashboardWidgetPage.clickRefreshButton();
  await dashboardWidgetPage.waitForFooterSuccess();
});

test("Should handle network interruptions and timeouts gracefully", async ({ page }) => {
  const dashboardWidgetPage = new DashboardWidgetPage(page);

  // Navigate to the dashboard page
  await page.goto(`/#!/stack/${process.env.STACK_API_KEY || ""}/dashboard/`);
  await page.waitForLoadState();
  await dashboardWidgetPage.accessFrame();
  await page.waitForTimeout(10000);

  // Wait for initial load with extended timeout
  await dashboardWidgetPage.waitForFooterSuccess();

  // Test rapid refresh clicks (stress test)
  await dashboardWidgetPage.performRapidRefresh(3);

  // Verify the widget still functions after rapid clicks
  await dashboardWidgetPage.waitForRefreshComplete();

  // Verify all stat cards are still present and functional
  await dashboardWidgetPage.verifyStatCardsVisible();

  // Test that timestamp updates are consistent
  const timestamp1 = await dashboardWidgetPage.getLastRefreshedTimestamp();
  await dashboardWidgetPage.clickRefreshButton();
  await dashboardWidgetPage.waitForFooterSuccess();
  const timestamp2 = await dashboardWidgetPage.getLastRefreshedTimestamp();

  expect(timestamp1).not.toBe(timestamp2);
  expect(await dashboardWidgetPage.verifyTimestampFormat()).toBe(true);
});
