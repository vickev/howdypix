import jwt from "jsonwebtoken";
import { appDebug } from "@howdypix/utils";
import { TokenInfo, UserInfo } from "@howdypix/shared-types";
import { User, UserConfigState } from "../state";
import config from "../config";

const debug = appDebug("lib:auth");

/**
 * The Stores is an object in the memory to store the current valid codes that
 * have been sent by email, and validate the refreshTokens to make sure they are valid.
 */
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

const trunkToken = (token: string): string => {
  if (token.length > 5) {
    return `${token.substr(0, 5)}...${token.substr(-5)}`;
  }

  return token;
};

// The whole point of predicate functions are to define the type, so we disable the eslint rule.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isUserInfo = (data: any): data is UserInfo => {
  return data && !!data.email && !!data.name;
};

//= ===================================================
// Validation functions
//= ===================================================
export const isEmailValid = (
  authorizedUsers: UserConfigState["users"],
  emailToCheck: string
): User | null => authorizedUsers.find(u => u.email === emailToCheck) || null;

export const isJwtTokenValid = async (
  token: string,
  secret: string
): Promise<UserInfo | null> =>
  new Promise<UserInfo | null>(resolve => {
    debug(`Token: ${trunkToken(token)}`);

    jwt.verify(token, secret, (error, decoded) => {
      if (!error && isUserInfo(decoded)) {
        debug(`Token valid!`, decoded);
        resolve({ email: decoded.email, name: decoded.name });
      } else {
        debug(`Token not valid!`);
        resolve(null);
      }
    });
  });

export const isTokenValid = (token: string): Promise<UserInfo | null> => {
  debug(`Check if the token is valid...`);
  return isJwtTokenValid(token, config.auth.token.secret);
};

export const isRefreshTokenValid = (
  token: string
): Promise<UserInfo | null> => {
  debug(`Check if the refresh token is valid...`);
  return isJwtTokenValid(token, config.auth.refreshToken.secret);
};

export const isCodeValid = async (code: string): Promise<UserInfo | null> => {
  debug(`Check if the user code is valid...`);
  const user = await isJwtTokenValid(code, config.auth.code.secret);
  if (user && stores.codes[user.email]) {
    return user;
  }
  return null;
};

//= ===================================================
// Generate functions
//= ===================================================
export const generateJwtToken = async (
  user: UserInfo,
  options: { secret: string; expiry: string }
): Promise<string> =>
  new Promise((resolve, reject) => {
    jwt.sign(
      { ...user },
      options.secret,
      { expiresIn: options.expiry },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          debug(`Token: ${trunkToken(token)}`);
          resolve(token);
        }
      }
    );
  });

export const generateCode = (user: UserInfo): Promise<string> => {
  debug("Generate the code for the magic link.", user);
  return generateJwtToken(user, config.auth.code);
};

export const generateToken = (user: UserInfo): Promise<string> => {
  debug("Generate the API token.", user);
  return generateJwtToken(user, config.auth.token);
};

export const generateRefreshToken = (user: UserInfo): Promise<string> => {
  debug("Generate the Refresh token.", user);
  return generateJwtToken(user, config.auth.refreshToken);
};

export const generateTokens = async (user: UserInfo): Promise<TokenInfo> =>
  new Promise(resolve => {
    debug("Generate the API tokens for auth.", user);

    generateToken(user).then(token => {
      generateRefreshToken(user).then(refreshToken => {
        resolve({ token, refreshToken, user });
      });
    });
  });

//= ===================================================
// Storage functions
//= ===================================================
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
