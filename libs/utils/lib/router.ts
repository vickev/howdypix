export const routes = {
  magickLinkValidation: {
    route: "/auth/code/*",
    value: (code: string) => `/auth/code/${code}`
  }
};
