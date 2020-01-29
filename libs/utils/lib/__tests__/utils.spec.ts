import { sortJsonStringify } from "../utils";

describe("sortJsonStringify", () => {
  test("should sort an object", async () => {
    expect(sortJsonStringify({ b: 1, a: 2 })).toMatchSnapshot();
    expect(sortJsonStringify({ b: 1, a: { w: 3, a: 2 } })).toMatchSnapshot();
  });

  test("should sort an object with an array", async () => {
    expect(sortJsonStringify({ b: 1, a: ["zzz", "aaa"] })).toMatchSnapshot();
  });

  test("should sort an object with a deep array", async () => {
    expect(
      sortJsonStringify({ b: 1, a: { y: ["zzz", "aaa"] } })
    ).toMatchSnapshot();
  });
});
