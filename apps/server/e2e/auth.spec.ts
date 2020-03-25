// Load env variables
import { NexusGenFieldTypes } from "@howdypix/graphql-schema/schema";

require("dotenv").config();

import { client, fetchTokens } from "./utils";
import gql from "graphql-tag";
import axios, { AxiosError } from "axios";

import { routes } from "@howdypix/utils";
import { UserInfo } from "@howdypix/shared-types";

describe("The authentication routes", () => {
  test("should reject if the code is not valid", async () => {
    const response = await axios.post(routes.codeValidation.value());
    expect(response.data).toMatchSnapshot();
  });

  describe("validating the email", function () {
    const sendMutation = async (email: string) =>
      client.mutate({
        mutation: gql`
          mutation AuthEmail($email: String!) {
            authEmail(email: $email) {
              messageId
              messageData
            }
          }
        `,
        variables: {
          email,
        },
      });

    test("should return an error if the email is not allowed", async () => {
      try {
        expect(await sendMutation("NONE")).toMatchSnapshot();
      } catch (e) {
        console.log(e.networkError.result);
      }
    });

    test("should return a success message if the email is allowed", async () => {
      expect(await sendMutation("dev@vickev.com")).toMatchSnapshot();
    });
  });

  describe("validating the magic link", function () {
    test("should return tokens if the magic link is correct", async () => {
      const data = await fetchTokens();

      expect(data).toHaveProperty("token");
      expect(data).toHaveProperty("refreshToken");
      expect(data.user).toMatchSnapshot();
    });

    test("should have an error if the link is not correct", async () => {
      const data = await fetchTokens("wrong-code");
      expect(data).toMatchSnapshot();
    });
  });

  describe("fetching the user info", function () {
    test("should return the user info if the token is correct", async () => {
      const { token, user } = await fetchTokens();

      const response = await axios.post<UserInfo>(
        routes.authenticatedUser.value(),
        {
          token,
        }
      );

      expect(response.data).toEqual(user);
    });

    test("should return an error if the token is wrong", async () => {
      try {
        const response = await axios.post<UserInfo>(
          routes.authenticatedUser.value(),
          {
            token: "wrong",
          }
        );
      } catch (e) {
        expect((e as AxiosError).response.status).toEqual(401);
      }
    });
  });

  describe("refreshing the token", function () {
    test("should return a new token", async (done) => {
      const { refreshToken, token } = await fetchTokens();

      setTimeout(async () => {
        const response = await axios.post<{ token: string }>(
          routes.refreshToken.value(),
          {
            token: refreshToken,
          }
        );

        expect(response.data.token).toBeDefined();
        expect(response.data.token).not.toEqual(token);

        done();
      }, 1000);
    });

    test("should return an error if the token is wrong", async () => {
      try {
        const response = await axios.post<{ token: string }>(
          routes.refreshToken.value(),
          {
            token: "wrong",
          }
        );
      } catch (e) {
        expect((e as AxiosError).response.status).toEqual(401);
      }
    });
  });
});
