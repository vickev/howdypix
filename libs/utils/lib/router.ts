interface Route {
  route: string;
  value: (...params: string[]) => string;
}

interface RouteWithCheck<T> extends Route {
  checkParams(req: object): T;
}

type CodeValidation = {
  code: string;
};

export const routes = {
  magickLinkValidation: {
    route: "/auth/validate-code/:code",
    value: (code: string) => `/auth/validate-code/${code}`
  } as Route,
  codeValidation: {
    route: "/auth/validate-code",
    value: () => `/auth/validate-code`,
    // Should be an Assert from TS 3.7, but not yet
    // supported by the editors.
    checkParams: req => req
  } as RouteWithCheck<{ code: string }>,
  authenticatedUser: {
    route: "/auth/user",
    value: () => `/auth/user`,
    // Should be an Assert from TS 3.7, but not yet
    // supported by the editors.
    checkParams: req => req
  } as RouteWithCheck<{ token: string }>,
  refreshToken: {
    route: "/auth/refresk-token",
    value: () => `/auth/refresk-token`,
    // Should be an Assert from TS 3.7, but not yet
    // supported by the editors.
    checkParams: req => req
  } as RouteWithCheck<{ token: string }>
};
