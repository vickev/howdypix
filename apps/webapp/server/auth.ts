import { Handler } from "express";
import axios from "axios";
// @ts-ignore
import nextConfig from "../next.config";
import { routes } from "@howdypix/utils";
import { TokenInfo } from "@howdypix/shared-types";

const { serverRuntimeConfig } = nextConfig;

export const validateCode: Handler = async (req, res, next) => {
  console.log(req.params.code);
  // Request for the validation
  const response = await axios.post(
    `${serverRuntimeConfig.serverApi.url}${routes.codeValidation.value()}`,
    {
      code: req.params.code
    }
  );

  const tokens: TokenInfo | { error: string } = response.data;

  const querystring =
    "?" +
    [req.query["fixture-set"] && "fixture-set=" + req.query["fixture-set"]]
      .filter(p => p)
      .join("&");

  console.log(tokens);

  if (!tokens.hasOwnProperty("error")) {
    res.cookie("token", (tokens as TokenInfo).token);
    res.cookie("refreshToken", (tokens as TokenInfo).refreshToken);
    res.redirect("/" + (querystring === "?" ? "" : querystring));
  } else {
    next();
  }
};
