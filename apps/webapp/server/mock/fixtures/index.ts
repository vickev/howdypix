import full from "./full";
import empty from "./empty";
import filters from "./filters";
import { FixtureSet } from "../types.d";

type FixtureSets = { [key: string]: FixtureSet };

export default { full, empty, filters } as FixtureSets;
