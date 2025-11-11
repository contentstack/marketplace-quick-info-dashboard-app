import { useState, useEffect } from "react";
import { client } from "@contentstack/management";
import { useAppSdk } from "./useAppSdk";

export const useManagementClient = () => {
  const appSdk = useAppSdk();
  const [managementClient, setManagementClient] = useState<ReturnType<typeof client> | null>(null);

  useEffect(() => {
    if (!appSdk) {
      setManagementClient(null);
      return;
    }

    try {
      const contentstackAdapter = appSdk.createAdapter();
      const managementClient = client({
        adapter: contentstackAdapter,
        baseURL: `${appSdk.endpoints.CMA}/v3`,
      });

      setManagementClient(managementClient);
    } catch (error) {
      console.error("Failed to initialize Management Client:", error);
      setManagementClient(null);
    }
  }, [appSdk]);

  return managementClient;
};
