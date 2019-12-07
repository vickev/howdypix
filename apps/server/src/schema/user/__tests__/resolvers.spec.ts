import { Connection } from "typeorm";
import { getCurrentUserResolver } from "../userResolvers";

describe("currentUserResolver", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const resolver = getCurrentUserResolver();

  test("should return the current user in the context", async () => {
    expect(
      resolver(
        {},
        {},
        { user: { name: "name", email: "email" }, connection: {} as Connection }
      )
    ).toMatchSnapshot();
  });

  test("should return null if no user in the context", async () => {
    expect(
      resolver({}, {}, { user: null, connection: {} as Connection })
    ).toMatchSnapshot();
  });
});
