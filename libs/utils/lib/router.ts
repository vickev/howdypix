import { TokenInfo, UserInfo } from "@howdypix/shared-types";
import { Express, RequestHandler } from "express-serve-static-core";
import { compile } from "path-to-regexp";

class RouteWithValidation<
  Params extends Record<string, string>,
  ReqBody extends Record<string, string | undefined> = {},
  ResBody extends Record<string, any> = {}
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
    handler: RequestHandler<Params, ResBody, ReqBody>
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
  >("/auth/refresk-token")
};
