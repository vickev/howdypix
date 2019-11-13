// POST /auth/send-email    ===> Send an email with a auth code
// GET  /auth/validate-code ====> Validate the code and generate a token
// POST /auth/refresh-token ===> Refresh the token
import jwt from "jsonwebtoken";
import { User, UserConfigState } from "../state";
import config from "../config";
import { appDebug } from "@howdypix/utils";
import { TokenInfo, UserInfo } from "@howdypix/shared-types";

const debug = appDebug("lib:auth");

type Stores = {
  codes: {
    [email: string]: string;
  };
  tokenList: {
    [refreshToken: string]: TokenInfo;
  };
};

const stores: Stores = {
  codes: {},
  tokenList: {}
};

//====================================================
// Utils
//====================================================
export const isEmailValid = (
  authorizedUsers: UserConfigState["users"],
  emailToCheck: string
): User | null => authorizedUsers.find(u => u.email === emailToCheck) ?? null;

export const isJwtTokenValid = async (
  token: string,
  secret: string
): Promise<UserInfo | null> =>
  new Promise<UserInfo | null>(resolve => {
    jwt.verify(token, secret, (error, decoded) => {
      if (!error) {
        const user = decoded as UserInfo;
        resolve({ email: (decoded as UserInfo).email });
      } else {
        resolve(null);
      }
    });
  });

export const isTokenValid = (token: string): Promise<UserInfo | null> =>
  isJwtTokenValid(token, config.auth.token.secret);

export const isRefreshTokenValid = (token: string): Promise<UserInfo | null> =>
  isJwtTokenValid(token, config.auth.refreshToken.secret);

export const isCodeValid = async (code: string): Promise<UserInfo | null> => {
  const user = await isJwtTokenValid(code, config.auth.code.secret);
  if (user && stores.codes[user.email]) {
    return user;
  } else {
    return null;
  }
};

export const generateJwtToken = async (
  user: UserInfo,
  options: { secret: string; expiry: string }
): Promise<string> =>
  new Promise((resolve, reject) => {
    debug("Generate the API token for auth.", user);

    jwt.sign(
      { ...user },
      options.secret,
      { expiresIn: options.expiry },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          debug("Token: " + token);
          resolve(token);
        }
      }
    );
  });

export const generateCode = (user: UserInfo): Promise<string> =>
  generateJwtToken(user, config.auth.code);

export const generateToken = (user: UserInfo): Promise<string> =>
  generateJwtToken(user, config.auth.token);

export const generateRefreshToken = (user: UserInfo): Promise<string> =>
  generateJwtToken(user, config.auth.refreshToken);

export const generateTokens = async (user: UserInfo): Promise<TokenInfo> =>
  new Promise(async (resolve, reject) => {
    debug("Generate the API tokens for auth.", user);
    resolve({
      token: await generateToken(user),
      refreshToken: await generateRefreshToken(user),
      user
    });
  });

export const storeCode = (email: string, code: string): void => {
  stores.codes[email] = code;
  debug("Saved code in memory:", stores.codes);
};

export const removeCode = (email: string): void => {
  delete stores.codes[email];
  debug("Removed code from memory:", email);
};

export const storeRefreshToken = (tokens: TokenInfo): void => {
  stores.tokenList[tokens.refreshToken] = tokens;
  debug("Saved refreshToken in memory:", tokens.refreshToken);
};

export const removeRefreshToken = (refreshToken: string): void => {
  delete stores.tokenList[refreshToken];
  debug("Removed refreshToken from memory:", refreshToken);
};
