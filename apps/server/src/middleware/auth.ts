// POST /auth/send-email    ===> Send an email with a auth code
// GET  /auth/validate-code ====> Validate the code and generate a token
// POST /auth/refresh-token ===> Refresh the token
import jwt from "jsonwebtoken";
import { User, UserConfigState } from "../state";
import config from "../config";
import { appDebug } from "@howdypix/utils";
import { TokenInfo, UserInfo } from "@howdypix/shared-types";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import passport from "passport";
import { Express } from "express";

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

export const isCodeValid = async (code: string): Promise<UserInfo | null> =>
  new Promise<UserInfo | null>(resolve => {
    jwt.verify(code, config.auth.code.secret, (error, decoded) => {
      if (!error) {
        const user = decoded as UserInfo;
        if (stores.codes[user.email]) {
          resolve({ email: (decoded as UserInfo).email });
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });

export const generateCode = async (user: UserInfo): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    debug("Generate token for a unique code to send by email.", user);

    jwt.sign(
      { ...user },
      config.auth.code.secret,
      { expiresIn: config.auth.code.expiry },
      (err, code) => {
        if (err) {
          reject(err);
        } else {
          debug("Code: " + code);
          resolve(code);
        }
      }
    );
  });

export const generateTokens = async (user: UserInfo): Promise<TokenInfo> =>
  new Promise<TokenInfo>((resolve, reject) => {
    debug("Generate the API token for auth.", user);

    jwt.sign(
      { ...user },
      config.auth.token.secret,
      { expiresIn: config.auth.token.expiry },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          debug("Token: " + token);
          debug("Generate the RefreshToken for auth.", user);

          jwt.sign(
            { ...user },
            config.auth.refreshToken.secret,
            { expiresIn: config.auth.refreshToken.expiry },
            (err, refreshToken) => {
              if (err) {
                reject(err);
              } else {
                debug("Refresh Token: " + refreshToken);
                resolve({ token, refreshToken, user });
              }
            }
          );
        }
      }
    );
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

//====================================================
// Middlewares
//====================================================
export const initializePassport = (app: Express) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.auth.token.secret
  };

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(
    new JwtStrategy(opts, function(jwt_payload, done) {
      done(null, jwt_payload);
    })
  );
};

export const authenticate = () => passport.authenticate("jwt");
