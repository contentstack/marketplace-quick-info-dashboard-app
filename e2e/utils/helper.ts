// module dependencies
import { Page } from "@playwright/test";
import axios from "axios";
import jsonfile from "jsonfile";
import FormData from "form-data";
import path from "path";
import fs from "fs";

interface ExtensionUid {
  uid: string;
}

const { STACK_API_KEY, ORG_ID, APP_BASE_URL, EMAIL, PASSWORD, DEVELOPER_HUB_API, BASE_API_URL }: any = process.env;

const file = "data.json";

const savedObj: any = {};

const writeFile = async (obj: any) => {
  jsonfile
    .writeFile(file, obj)
    .then((res: any) => {
      return res;
    })
    .catch(console.error);
};

// get authtoken
export const getAuthToken = async () => {
  let options = {
    url: `https://${BASE_API_URL}/v3/user-session`,
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    data: {
      user: {
        email: EMAIL,
        password: PASSWORD,
      },
    },
  };
  try {
    let result = await axios(options);
    savedObj["authToken"] = result.data.user.authtoken;
    await writeFile(savedObj);
    return result.data.user.authtoken;
  } catch (error) {
    console.error(error);
  }
};

interface AppData {
  appId: string;
  appName: string;
}

// create app in developer hub
export const createApp = async (authToken: string, randomTestNumber: number): Promise<AppData | any> => {
  let options = {
    url: `https://${DEVELOPER_HUB_API}/apps`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      organization_uid: ORG_ID,
      authtoken: authToken,
    },
    data: {
      name: `Color Picker E2E ${randomTestNumber}`,
      target_type: "stack",
    },
  };
  try {
    let result = await axios(options);
    return { appId: result.data.data.uid, appName: options.data.name };
  } catch (error) {
    return error;
  }
};

// updating app in developer hub & set baseUrl
export const updateApp = async (authToken: string, appId: string, appName: string): Promise<any> => {
  const name = appName;
  let options = {
    url: `https://${DEVELOPER_HUB_API}/apps/${appId}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      organization_uid: ORG_ID,
      authtoken: authToken,
    },
    data: {
      ui_location: {
        locations: [
          {
            type: "cs.cm.stack.sidebar",
            meta: [
              {
                name: `Entry sidebar _${Math.floor(Math.random() * 1000)}`,
                enabled: true,
                path: "/entry-sidebar",
                signed: false,
              },
            ],
          },
          {
            type: "cs.cm.stack.dashboard",
            meta: [
              {
                name: `Stack Dashboard Boilerplate _${Math.floor(Math.random() * 1000)}`,
                path: "/stack-dashboard",
                signed: false,
                enabled: true,
                default_width: "full",
              },
            ],
          },
          {
            type: "cs.cm.stack.asset_sidebar",
            meta: [
              {
                name: `Asset Sidebar Boilerplate _${Math.floor(Math.random() * 1000)}`,
                path: "/asset-sidebar",
                signed: false,
                enabled: true,
                width: 500,
              },
            ],
          },
          {
            type: "cs.cm.stack.rte",
            meta: [
              {
                name: `JsonRte Boilerplate _${Math.floor(Math.random() * 1000)}`,
                enabled: true,
                path: "/json-rte.js",
              },
            ],
          },
          {
            type: "cs.cm.stack.config",
            meta: [
              {
                name: `App Boilerplate _${Math.floor(Math.random() * 1000)}`,
                path: "/app-configuration",
                signed: false,
                enabled: true,
              },
            ],
          },
          {
            type: "cs.cm.stack.custom_field",
            meta: [
              {
                name: name,
                path: "/custom-field",
                signed: false,
                enabled: true,
                data_type: "json",
              },
            ],
          },
        ],
        signed: true,
        base_url: APP_BASE_URL,
      },
    },
  };
  try {
    let result = await axios(options);
    if (result) {
      return true;
    }
  } catch (error) {
    return error;
  }
};

// get installed app
export const getInstalledApp = async (authToken: string, appId: string) => {
  let options = {
    url: `https://${DEVELOPER_HUB_API}/apps/${appId}/installations`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      organization_uid: ORG_ID,
      authtoken: authToken,
    },
  };
  try {
    const result = await axios(options);
    return result.data;
  } catch (error) {
    return error;
  }
};

// install app in stack & return installation id
export const installApp = async (authToken: string, appId: string, stackApiKey: string | undefined) => {
  let options = {
    url: `https://${DEVELOPER_HUB_API}/apps/${appId}/install`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      organization_uid: ORG_ID,
      authtoken: authToken,
    },
    data: {
      target_type: "stack",
      target_uid: stackApiKey,
    },
  };
  try {
    let result = await axios(options);
    return result.data.data.installation_uid;
  } catch (error) {
    return error;
  }
};

// uninstall app from the stack
export const uninstallApp = async (authToken: string, installId: string) => {
  let options = {
    url: `https://${DEVELOPER_HUB_API}/installations/${installId}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      organization_uid: ORG_ID,
      authtoken: authToken,
    },
  };
  try {
    let result = await axios(options);
    return result.data;
  } catch (error) {
    return error;
  }
};

// deletes the created test app during tear down
export const deleteApp = async (token: string, appId: string) => {
  let options = {
    url: `https://${DEVELOPER_HUB_API}/apps/${appId}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      organization_uid: ORG_ID,
      authtoken: token,
    },
  };
  try {
    await axios(options);
  } catch (error) {
    return error;
  }
};
