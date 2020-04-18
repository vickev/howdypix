import _getConfig from "next/config";

export type NextConfig = {
  serverRuntimeConfig: {
    port: number;
    baseUrl: string;
    serverApi: {
      url: string;
    };
    mock: {
      serverApi: {
        port: number;
        url: string;
      };
    };
  };
  publicRuntimeConfig: {
    baseUrl: string;
  };
};

export const getConfig = (): NextConfig => _getConfig() as NextConfig;
