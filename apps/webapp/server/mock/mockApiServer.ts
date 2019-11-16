import express from "express";
import { routes } from "@howdypix/utils";
import { TokenInfo, UserInfo } from "@howdypix/shared-types";

const app = express();
app.use(express.json());

app.post(routes.codeValidation.route, (req, res) => {
  const params = routes.codeValidation.checkParams(req.body);

  if (params.code === "goodCode") {
    const tokens: TokenInfo = {
      refreshToken: "validToken",
      token: "validToken",
      user: { email: "dev@vickev.com" }
    };
    res.json(tokens);
  } else {
    res.json({ error: "Token expired" });
  }
});

app.post(routes.authenticatedUser.route, (req, res) => {
  const params = routes.authenticatedUser.checkParams(req.body);

  if (params.token === "validToken") {
    const user: UserInfo = { email: "dev@vickev.com" };
    res.json(user);
  } else {
    res.sendStatus(401);
  }
});

app.post(routes.refreshToken.route, (req, res) => {
  const params = routes.refreshToken.checkParams(req.body);

  if (params.token === "validToken") {
    res.json({
      token: "newToken"
    });
  } else {
    res.sendStatus(401);
  }
});

export default app;
