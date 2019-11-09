// POST /auth/send-email    ===> Send an email with a auth code
// GET  /auth/validate-code ====> Validate the code and generate a token
// POST /auth/refresh-token ===> Refresh the token
import jwt from "jsonwebtoken";
import { User, UserConfigState } from "../state";
import config from "../config";

type Stores = {
  codes: {
    [email: string]: string;
  };
};

const stores: Stores = {
  codes: {}
};

type TokenInfo = {
  token: string;
  refreshToken: string;
  userEmail: string;
};

type CodeInfo = {
  email: string;
};

//====================================================
// Utils
//====================================================
export const isEmailValid = (
  authorizedUsers: UserConfigState["users"],
  emailToCheck: string
): User | null => authorizedUsers.find(u => u.email === emailToCheck) ?? null;

export const isCodeValid = async (code: string): Promise<boolean> =>
  new Promise<boolean>(resolve => {
    // Decode the code
    jwt.verify(code, config.auth.secret, (error, decoded) => {
      const { email } = decoded as CodeInfo;
      if (stores.codes[email]) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });

export const generateCode = async (email: string): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    jwt.sign(
      { email } as CodeInfo,
      config.auth.secret,
      { expiresIn: config.auth.expiry },
      (err, code) => {
        if (err) {
          reject(err);
        } else {
          resolve(code);
        }
      }
    );
  });

export const storeCode = (email: string, code: string): void => {
  stores.codes[email] = code;
};

/*
//====================================================
// Middlewares
//====================================================
const sendEmail = (userEmail: string): void => {};

const validateCode = (code: CodeInfo): TokenInfo => {};

const refreshToken = (refreshTokenValue: string): TokenInfo => {};

export { sendEmail, validateCode, refreshToken };
*/
