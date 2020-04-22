import { compile } from "path-to-regexp";
// eslint-disable-next-line import/no-unresolved
import { Express } from "express";
import { RouteWithValidation } from "..";

jest.mock("path-to-regexp", () => ({
  compile: jest.fn(),
}));

describe("RouteWithValidation", () => {
  beforeEach(async () => {
    jest.resetAllMocks();

    (compile as jest.Mock).mockImplementation((route) =>
      jest.requireActual("path-to-regexp").compile(route)
    );
  });

  describe("value()", () => {
    it("should return the right values with a parametered route", () => {
      const route = new RouteWithValidation<{ param1: string; param2: string }>(
        "/:param1/:param2",
        "post"
      );

      expect(route.value({ param1: "1", param2: "2" })).toEqual("/1/2");
      expect(route.value()).toEqual("/:param1/:param2");
      expect(compile).toHaveBeenCalledTimes(1);
    });
  });

  describe("applyMiddleware()", () => {
    ["post", "get"].forEach((method) => {
      it(`${method} should add the right handler`, () => {
        const routeString = "/:param1/:param2";
        const handler = (): void => {};
        const route = new RouteWithValidation<{
          param1: string;
          param2: string;
        }>(routeString, method as "post" | "get");

        const express = ({
          [method]: jest.fn(),
        } as unknown) as Express;

        route.applyMiddleware(express, handler);

        // @ts-ignore
        expect(express[method]).toHaveBeenCalledWith(routeString, handler);
      });
    });
  });
});
