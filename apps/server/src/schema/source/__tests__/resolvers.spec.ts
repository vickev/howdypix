import { getSourcesResolver } from "../sourceResolvers";
import { UserConfigState } from "../../../state";

describe("currentUserResolver", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const photoDirs: UserConfigState["photoDirs"] = {
    source1: "source1",
    source2: "source2",
    source3: "source3"
  };

  const resolver = getSourcesResolver(photoDirs);

  test("should return the current list of sources", async () => {
    expect(resolver()).toMatchSnapshot();
  });
});
