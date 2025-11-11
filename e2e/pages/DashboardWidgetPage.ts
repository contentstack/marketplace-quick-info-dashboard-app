import { Page, expect, FrameLocator } from "@playwright/test";
import { elements } from "./dashboard/dashboard-page.elements";

export class DashboardWidgetPage {
  readonly page: Page;
  frame: FrameLocator | null = null;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/#!/stacks");
  }

  // Frame Management Methods
  async accessFrame(): Promise<FrameLocator> {
    const elementHandle = await this.page.waitForSelector(elements.appExtensionComponent);
    const frameHandle = await elementHandle.contentFrame();
    if (!frameHandle) {
      throw new Error("Could not access content frame");
    }
    this.frame = this.page.locator(elements.appExtensionFrame).contentFrame();
    return this.frame;
  }

  async ensureFrame(): Promise<FrameLocator> {
    if (!this.frame) {
      return await this.accessFrame();
    }
    return this.frame;
  }

  async navigateToDashboard(apiKey: string) {
    await this.page.goto(`/#!/stack/${apiKey}/dashboard/`);
    await this.page.waitForLoadState();
    await this.accessFrame();
    await this.page.waitForTimeout(5000);
    await this.waitForDataLoad();
  }

  // Data Loading Methods
  async waitForDataLoad() {
    const frame = await this.ensureFrame();
    await expect(frame.getByText(elements.text.dataRefreshed)).toHaveText(elements.text.dataRefreshed, {
      timeout: 15000,
    });
  }

  async waitForSkeletonToAppear() {
    const frame = await this.ensureFrame();
    await expect(frame.locator(elements.skeleton.statCard).first()).toBeVisible({ timeout: 2000 });
  }

  async waitForSkeletonToDisappear() {
    const frame = await this.ensureFrame();
    await expect(frame.locator(elements.skeleton.statCard).first()).not.toBeVisible();
  }

  // Stat Card Methods
  async clickStatCard(type: "content-types" | "entries" | "assets") {
    const frame = await this.ensureFrame();
    await frame.locator(elements.getStatCard(type)).click();
  }

  async getStatCount(type: "content-types" | "entries" | "assets"): Promise<string | null> {
    const frame = await this.ensureFrame();
    return await frame.locator(elements.getStatCount(type)).textContent();
  }

  async getStatLabel(type: "content-types" | "entries" | "assets"): Promise<string | null> {
    const frame = await this.ensureFrame();
    return await frame.locator(elements.getStatLabel(type)).textContent();
  }

  async verifyStatCardsVisible() {
    const frame = await this.ensureFrame();
    await expect(frame.locator(elements.statCards.contentTypes)).toBeVisible();
    await expect(frame.locator(elements.statCards.entries)).toBeVisible();
    await expect(frame.locator(elements.statCards.assets)).toBeVisible();
  }

  async verifyStatCardClickable(type: "content-types" | "entries" | "assets") {
    const frame = await this.ensureFrame();
    await expect(frame.locator(elements.getStatCard(type))).toHaveCSS("cursor", "pointer");
  }

  async hoverStatCard(type: "content-types" | "entries" | "assets") {
    const frame = await this.ensureFrame();
    await frame.locator(elements.getStatCard(type)).hover();
  }

  async clickStatLabelAndVerifyPopup(type: "content-types" | "entries" | "assets", expectedUrlFragment: string) {
    const frame = await this.ensureFrame();
    const pagePromise = this.page.waitForEvent("popup");
    await frame.locator(elements.getStatLabel(type)).click();
    const newPage = await pagePromise;
    expect(newPage.url()).toContain(expectedUrlFragment);
    await newPage.close();
  }

  // Footer Methods
  async clickRefreshButton() {
    const frame = await this.ensureFrame();
    await frame.locator(elements.footer.refreshButton).click();
  }

  async getLastRefreshedTimestamp(): Promise<string | null> {
    const frame = await this.ensureFrame();
    return await frame.locator(elements.footer.lastRefreshed).textContent();
  }

  async waitForFooterSuccess() {
    const frame = await this.ensureFrame();
    await expect(frame.locator(elements.footer.success)).toBeVisible({ timeout: 15000 });
  }

  async waitForFooterSkeleton() {
    const frame = await this.ensureFrame();
    await expect(frame.locator(elements.footer.skeletonContainer)).toBeVisible({ timeout: 1000 });
  }

  async verifyRefreshButtonEnabled() {
    const frame = await this.ensureFrame();
    await expect(frame.locator(elements.footer.refreshButton)).toBeEnabled();
  }

  async verifyRefreshButtonTitle() {
    const frame = await this.ensureFrame();
    await expect(frame.locator(elements.footer.refreshButton)).toHaveAttribute("title", "Refresh data");
  }

  // Validation Methods
  async verifyFooterContainer() {
    const frame = await this.ensureFrame();
    await expect(frame.locator(elements.footer.container)).toBeVisible();
  }

  async verifyFooterSuccessText() {
    const frame = await this.ensureFrame();
    await expect(frame.locator(elements.footer.success)).toHaveText(elements.text.dataRefreshed);
  }

  async verifyTimestampFormat(): Promise<boolean> {
    const timestamp = await this.getLastRefreshedTimestamp();
    return timestamp ? /Last refreshed: \d{2}:\d{2}:\d{2}/.test(timestamp) : false;
  }

  async verifyStatCountIsNumber(type: "content-types" | "entries" | "assets"): Promise<boolean> {
    const count = await this.getStatCount(type);
    return count ? /^\d+$/.test(count) : false;
  }

  async verifyStatCountNotEmpty(type: "content-types" | "entries" | "assets") {
    const count = await this.getStatCount(type);
    expect(count).not.toBeNull();
    expect(count).not.toBe("");
    expect(count).not.toBe("undefined");
    expect(count).not.toBe("null");
  }

  async verifyStatLabels() {
    expect(await this.getStatLabel("content-types")).toBe("Content Types");
    expect(await this.getStatLabel("entries")).toBe("Entries");
    expect(await this.getStatLabel("assets")).toBe("Assets");
  }

  async verifyAllStatCardsClickable() {
    await this.verifyStatCardClickable("content-types");
    await this.verifyStatCardClickable("entries");
    await this.verifyStatCardClickable("assets");
  }

  async hoverAllStatCards() {
    await this.hoverStatCard("content-types");
    await this.hoverStatCard("entries");
    await this.hoverStatCard("assets");
  }

  async verifyStatCardData(type: "content-types" | "entries" | "assets", expectedLabel: string) {
    const count = await this.getStatCount(type);
    const label = await this.getStatLabel(type);

    expect(count).toMatch(/^\d+$/); // Should be a number
    expect(parseInt(count || "0")).toBeGreaterThanOrEqual(0);
    expect(label).toBe(expectedLabel);
  }

  async verifyAllStatCountsNotEmpty() {
    await this.verifyStatCountNotEmpty("content-types");
    await this.verifyStatCountNotEmpty("entries");
    await this.verifyStatCountNotEmpty("assets");
  }

  async verifyAllStatCountsAreNumbers() {
    expect(await this.verifyStatCountIsNumber("content-types")).toBe(true);
    expect(await this.verifyStatCountIsNumber("entries")).toBe(true);
    expect(await this.verifyStatCountIsNumber("assets")).toBe(true);
  }

  async verifyWidgetStructure() {
    const frame = await this.ensureFrame();
    await expect(frame.locator(elements.stackDetailsWidget)).toBeVisible();
    await expect(frame.locator(elements.footer.container)).toBeVisible();
  }

  // Skeleton Methods
  async verifySkeletonCount(expectedCount: number) {
    const frame = await this.ensureFrame();
    await expect(frame.locator(elements.skeleton.statCard)).toHaveCount(expectedCount);
  }

  async clickSkeletonElements() {
    const frame = await this.ensureFrame();
    await frame.locator(elements.skeleton.statCard).first().click();
    await frame.locator(elements.skeleton.footerContainer).click();
  }

  // Utility Methods
  async performRapidRefresh(count: number = 3) {
    for (let i = 0; i < count; i++) {
      await this.clickRefreshButton();
      await this.page.waitForTimeout(100);
    }
  }

  async waitForRefreshComplete() {
    await this.waitForFooterSuccess();
    await this.verifyRefreshButtonEnabled();
  }
}
