import gql from "graphql-tag";
import axios from "axios";
import { FetchResult } from "apollo-link";
import { ApolloError } from "apollo-client";

import { routes } from "@howdypix/utils";
import { UserInfo } from "@howdypix/shared-types";
import { client, fetchTokens } from "./utils";

require("dotenv").config();

describe("The authentication routes", (): void => {
  test("should reject if the code is not valid", async () => {
    const response = await axios.post(routes.codeValidation.value());
    expect(response.data).toMatchSnapshot();
  });

  describe("validating the email", (): void => {
    const sendMutation = async (email: string): Promise<FetchResult> =>
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
        // eslint-disable-next-line no-console
        console.log((e as ApolloError).networkError);
      }
    });

    test("should return a success message if the email is allowed", async () => {
      expect(await sendMutation("dev@vickev.com")).toMatchSnapshot();
    });
  });

  describe("validating the magic link", (): void => {
    test("should return tokens if the magic link is correct", async (): Promise<
      void
    > => {
      const data = await fetchTokens();

      expect(data).toHaveProperty("token");
      expect(data).toHaveProperty("refreshToken");
      expect(data.user).toMatchSnapshot();
    });

    test("should have an error if the link is not correct", async (): Promise<
      void
    > => {
      const data = await fetchTokens("wrong-code");
      expect(data).toMatchSnapshot();
    });
  });

  describe("fetching the user info", (): void => {
    test("should return the user info if the token is correct", async (): Promise<
      void
    > => {
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
      await expect(
        axios.post<UserInfo>(routes.authenticatedUser.value(), {
          token: "wrong",
        })
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe("refreshing the token", (): void => {
    test("should return a new token", async (): Promise<void> => {
      const { refreshToken, token } = await fetchTokens();

      await new Promise((resolve) =>
        setTimeout(async (): Promise<void> => {
          const response = await axios.post<{ token: string }>(
            routes.refreshToken.value(),
            {
              token: refreshToken,
            }
          );

          expect(response.data.token).toBeDefined();
          expect(response.data.token).not.toEqual(token);

          resolve();
        }, 1000)
      );
    });

    test("should return an error if the token is wrong", async () => {
      await expect(
        axios.post<{ token: string }>(routes.refreshToken.value(), {
          token: "wrong",
        })
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
