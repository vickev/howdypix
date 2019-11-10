import { Handler } from "express";
import axios from "axios";
// @ts-ignore
import nextConfig from "../next.config";
import { routes } from "@howdypix/utils";
import { TokenInfo } from "@howdypix/shared-types";
import { Middleware } from "express-graphql";

const { serverRuntimeConfig } = nextConfig;

export const validateCode: Handler = async (req, res) => {
  // Request for the validation
  const response = await axios.post(
    `${serverRuntimeConfig.serverHttp.url}${routes.codeValidation.value()}`,
    {
      code: req.params.code
    }
  );

  const tokens: TokenInfo = response.data;

  if (tokens) {
    res.cookie("token", tokens.token);
    res.cookie("refreshToken", tokens.refreshToken);
    res.redirect("/");
  }
};
