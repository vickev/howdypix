import { codeValidationHandler } from "../auth";
import { Request, Response } from "express";
import {
  generateTokens,
  isCodeValid,
  storeRefreshToken,
  removeCode
} from "../../lib/auth";
import { TokenInfo, UserInfo } from "@howdypix/shared-types";

jest.mock("../../lib/auth", () => ({
  generateTokens: jest.fn(),
  storeRefreshToken: jest.fn(),
  isCodeValid: jest.fn(),
  removeCode: jest.fn()
}));

const fakeRequest = (code: string | null): Partial<Request> => ({
  body: {
    code
  }
});

const fakeResponse: Partial<Response> = {
  json: jest.fn()
};

describe("auth middleware", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("codeValidationHandler should return an expiry error if the token is not valid", async () => {
    (isCodeValid as jest.Mock).mockImplementation(() => null);

    await codeValidationHandler(
      fakeRequest(null) as Request,
      fakeResponse as Response,
      () => {}
    );

    expect(storeRefreshToken).not.toHaveBeenCalled();
    expect(fakeResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining("expired")
      })
    );
  });

  test("codeValidationHandler should return the tokens if the code is valid", async () => {
    const tokens: TokenInfo = {
      token: "token",
      refreshToken: "refresh",
      user: { email: "email" }
    };

    (isCodeValid as jest.Mock).mockImplementation(
      (): UserInfo => ({ email: "email" })
    );
    (generateTokens as jest.Mock).mockImplementation((): TokenInfo => tokens);

    await codeValidationHandler(
      fakeRequest("ABC") as Request,
      fakeResponse as Response,
      () => {}
    );

    expect(generateTokens).toHaveBeenCalled();
    expect(storeRefreshToken).toHaveBeenCalled();
    expect(removeCode).toHaveBeenCalled();

    expect(fakeResponse.json).toHaveBeenCalledWith(tokens);
  });
});
