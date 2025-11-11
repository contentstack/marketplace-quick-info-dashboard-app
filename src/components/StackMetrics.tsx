import { useState, useEffect, useCallback } from "react";
import { useAppSdk } from "../common/hooks/useAppSdk";
import { useManagementClient } from "../common/hooks/useManagementClient";
import { StatCard } from "./stat-card";
import { StatCardSkeleton, FooterSkeleton } from "./loading-skeleton";
import { StatCardData } from "./types/stat-interface";

import { ContentModelIcon, EntriesIcon, AssetsIcon } from "./ui/StackIcons";
import { Icon } from "@contentstack/venus-components";

export interface StackStats {
  contentTypes: number;
  entries: number;
  assets: number;
}

export interface StackStatsState {
  stats: StackStats | null;
  loading: boolean;
  error: string | null;
  lastRefreshed: Date | null;
}

const getStatCardsData = (
  stats: { contentTypes: number; entries: number; assets: number } | null,
  stackApiKey: string | null,
): StatCardData[] => {
  const createNavigationHandler = (stackApiKey: string | null, path: string) => () => {
    if (stackApiKey) {
      const url = `${import.meta.env.VITE_APP_BASE_URL}/#!/stack/${stackApiKey}/${path}`;
      window.open(url, "_blank");
    }
  };

  return [
    {
      type: "content-types",
      count: stats?.contentTypes || 0,
      label: "Content Types",
      icon: ContentModelIcon,
      onClick: createNavigationHandler(stackApiKey, "content-types?branch=main"),
    },
    {
      type: "entries",
      count: stats?.entries || 0,
      label: "Entries",
      icon: EntriesIcon,
      onClick: createNavigationHandler(stackApiKey, "entries?branch=main"),
    },
    {
      type: "assets",
      count: stats?.assets || 0,
      label: "Assets",
      icon: AssetsIcon,
      onClick: createNavigationHandler(stackApiKey, "assets?branch=main"),
    },
  ];
};

export function StackMetrics() {
  const appSdk = useAppSdk();
  const managementClient = useManagementClient();
  const stackApiKey = appSdk?.ids?.apiKey || null;

  const [state, setState] = useState<StackStatsState>({
    stats: null,
    loading: true,
    error: null,
    lastRefreshed: null,
  });

  const fetchStackStats = useCallback(async (): Promise<StackStats> => {
    if (!appSdk || !managementClient) {
      throw new Error("App SDK or Management Client not available - check initialization");
    }

    try {
      // Initialize Contentstack stack instance
      const stack = await managementClient.stack({
        api_key: appSdk.ids.apiKey,
      });

      // Fetch Content Types with count from Contentstack Management API
      const { count: contentTypeCount } = await stack.contentType().query({ include_count: true }).find();

      // Fetch Assets with count from Contentstack Management API
      const { count: assetCount } = await stack.asset().query({ include_count: true }).find();

      // Fetch ALL content types using pagination to handle stacks with >100 content types
      const fetchAllContentTypes = async () => {
        let allContentTypes = [];
        let skip = 0;
        const limit = 100; // Default limit for pagination
        let hasMore = true;

        while (hasMore) {
          const response = await stack
            .contentType()
            .query({ skip, include_count: true })
            .find();
          
          allContentTypes.push(...(response.items || []));
          
          // Check if we need to fetch more pages
          const totalCount = response.count || 0;
          skip += limit;
          hasMore = skip < totalCount;
        }

        return allContentTypes;
      };

      const contentTypesCollection = await fetchAllContentTypes();

      // Count total entries across all content types using parallel processing
      const entryCountingPromises = contentTypesCollection.map(async (contentTypeItem) => {
        try {
          const entriesApiResponse = await stack
            .contentType(contentTypeItem.uid)
            .entry()
            .query({ include_count: true })
            .find();
          return entriesApiResponse?.count ?? 0;
        } catch (permissionError) {
          // Skip content types that can't be accessed due to insufficient permissions
          console.warn(`Skipping content type "${contentTypeItem.uid}" due to access restrictions:`, permissionError);
          return 0;
        }
      });

      const individualEntryCounts = await Promise.all(entryCountingPromises);
      const entryCount = individualEntryCounts.reduce((accumulator, currentCount) => accumulator + currentCount, 0);

      return {
        contentTypes: contentTypeCount,
        entries: entryCount,
        assets: assetCount,
      };
    } catch (apiError) {
      console.error("Failed to fetch stack statistics from Contentstack Management API:", apiError);
      throw apiError;
    }
  }, [appSdk, managementClient]);

  const refreshStats = useCallback(async () => {
    if (!appSdk || !managementClient) {
      setState({
        stats: null,
        loading: false,
        error: "App SDK or Management Client not available",
        lastRefreshed: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const stats = await fetchStackStats();
      setState({
        stats,
        loading: false,
        error: null,
        lastRefreshed: new Date(),
      });
    } catch (error) {
      setState({
        stats: null,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch stack statistics",
        lastRefreshed: null,
      });
    }
  }, [fetchStackStats, appSdk, managementClient]);

  // Auto-fetch when dependencies become available
  useEffect(() => {
    if (appSdk && managementClient) {
      refreshStats();
    }
  }, [refreshStats, appSdk, managementClient]);

  const handleRefresh = () => {
    refreshStats();
  };

  // Helper function to format the timestamp
  const formatLastRefreshed = (date: Date | null): string => {
    if (!date) return "";

    return date.toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const renderErrorState = () => (
    <div className="flex items-center justify-center">
      <div className="flex flex-col gap-4 text-center max-w-sm">
        <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <Icon version="v2" icon="WarningBoldNew" height="40px" width="40px" />
        </div>

        <div className="flex flex-col gap-2">
          <h3
            className="text-body-p1 font-semibold text-center self-stretch font-inter text-brand-purple-gray capitalize"
            data-testid="error-title">
            Unable To Load Stack Data
          </h3>
          <p
            className="text-body-p2 font-normal text-center self-stretch font-inter text-brand-purple-gray"
            data-testid="error-message">
            Could not fetch statistics using Management SDK.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="cursor-pointer bg-transparent border-none px-4 py-2 text-body-p2 font-semibold font-inter text-brand-orchid-purple"
          data-testid="link-retry">
          Retry
        </button>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex items-center justify-center">
      <div className="flex gap-4 w-full">
        {Array.from({ length: 3 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );

  const renderStatsGrid = () => {
    const statsData = getStatCardsData(state.stats, stackApiKey);

    return (
      <div className="flex items-center justify-center">
        <div className="flex gap-4 w-full">
          {statsData.map((statData) => (
            <div key={statData.type} className="flex-1">
              <StatCard data={statData} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFooter = () => {
    if (state.loading) {
      return <FooterSkeleton />;
    }

    return (
      <div
        className="flex justify-between items-center self-stretch p-4 bg-ui-light-bg border-t border-ui-border-gray"
        data-testid="footer-container">
        <span className="text-body-p3 font-normal font-inter text-brand-dark-text" data-testid="footer-success">
          Data refreshed from Contentstack Management API
        </span>
        <div className="flex items-center gap-2">
          <span className="text-body-p3 font-normal font-inter text-brand-dark-text" data-testid="last-refreshed">
            Last refreshed: {formatLastRefreshed(state.lastRefreshed)}
          </span>
          <button
            onClick={handleRefresh}
            className="p-1 hover:bg-muted rounded transition-colors duration-200"
            disabled={state.loading}
            title="Refresh data"
            data-testid="refresh-button">
            <Icon version="v2" icon="Refresh" height="20px" width="20px" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white w-full h-full flex flex-col justify-between" data-testid="stack-details-widget">
      <div className="flex-1 w-full p-4 py-6">
        {state.error ? renderErrorState() : state.loading ? renderLoadingState() : renderStatsGrid()}
      </div>
      <div>{renderFooter()}</div>
    </div>
  );
}
