import { TokenInfo, UserInfo } from "@howdypix/shared-types";
// We only want the @types/express-serve-static-core, so it's normal not to have express-serve-static-core installed.
// Therefore we disable the rule:
// eslint-disable-next-line import/no-unresolved
import { Express, NextFunction, Response } from "express";
// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import { Query, Request } from "express-serve-static-core";
import { compile } from "path-to-regexp";

class RouteWithValidation<
  Params extends Record<string, string>,
  ReqBody extends Record<string, string | undefined> = {},
  ResBody extends Record<string, string | UserInfo> = {}
> {
  public route: string;

  private method: "post" | "get";

  constructor(route: string, method: "post" | "get" = "post") {
    this.route = route;
    this.method = method;
  }

  value(params?: Params): string {
    if (params) {
      return compile<Params>(this.route)(params);
    }

    return this.route;
  }

  applyMiddleware(
    app: Express,
    handler: (
      req: Request<Params, ResBody, ReqBody, Query>,
      res: Response<ResBody>,
      next: NextFunction
    ) => void | Promise<void>
  ): void {
    app[this.method](this.route, handler);
  }
}

export const routes = {
  magickLinkValidation: new RouteWithValidation<{ code: string }>(
    "/auth/validate-code/:code",
    "get"
  ),
  codeValidation: new RouteWithValidation<
    {},
    { code: string | undefined },
    TokenInfo | { error: string }
  >("/auth/validate-code"),
  authenticatedUser: new RouteWithValidation<
    {},
    { token: string | undefined },
    UserInfo
  >("/auth/user"),
  refreshToken: new RouteWithValidation<
    {},
    { token: string | undefined },
    { token: string }
  >("/auth/refresk-token"),
};
