import express from "express";
import { routes } from "@howdypix/utils";

const app = express();
app.use(express.json());

routes.codeValidation.applyMiddleware(app, (req, res) => {
  if (req.body.code === "goodCode") {
    res.json({
      refreshToken: "validToken",
      token: "validToken",
      user: { email: "dev@vickev.com" }
    });
  } else {
    res.json({ error: "Token expired" });
  }
});

routes.authenticatedUser.applyMiddleware(app, (req, res) => {
  if (req.body.token === "validToken") {
    res.json({ email: "dev@vickev.com" });
  } else {
    res.sendStatus(401);
  }
});

routes.refreshToken.applyMiddleware(app, (req, res) => {
  if (req.body.token === "validToken") {
    res.send({
      token: "newToken"
    });
  } else {
    res.sendStatus(401);
  }
});

export default app;
