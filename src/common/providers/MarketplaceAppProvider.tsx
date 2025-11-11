import React, { useEffect, useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";

import { KeyValueObj } from "../types/types";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import { AppFailed } from "../../components/AppFailed";

type ProviderProps = {
  children?: React.ReactNode;
};

/**
 * Marketplace App Provider
 * @param children: React.ReactNode
 */
export const MarketplaceAppProvider: React.FC<ProviderProps> = ({ children }) => {
  const [failed, setFailed] = useState<boolean>(false);
  const [appSdk, setAppSdk] = useState<UiLocation | null>(null);
  const [appConfig, setConfig] = useState<KeyValueObj | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeSDK = async () => {
      try {
        const appSdk = await ContentstackAppSDK.init();

        if (!mounted) return;

        setAppSdk(appSdk);
        appSdk.location.DashboardWidget?.frame?.disableAutoResizing();
        await appSdk.location.CustomField?.frame?.updateHeight?.(450);
        appSdk.location.FieldModifierLocation?.frame?.disableAutoResizing();
        await appSdk.location.FieldModifierLocation?.frame?.updateDimension({
          height: 380,
          width: 520,
        });
        appSdk.location.DashboardWidget?.frame?.disableAutoResizing();
        await appSdk.location.DashboardWidget?.frame?.updateHeight?.(722);
        const appConfig = await appSdk.getConfig();

        if (mounted) {
          setConfig(appConfig);
        }
      } catch (error) {
        if (mounted) {
          setFailed(true);
        }
      }
    };

    initializeSDK();

    return () => {
      mounted = false;
    };
  }, []);

  if (!failed && !appSdk) {
    return <div>Loading...</div>;
  }
  if (failed) {
    return <AppFailed />;
  }

  return <MarketplaceAppContext.Provider value={{ appSdk, appConfig }}>{children}</MarketplaceAppContext.Provider>;
};
