import full from "./full";
import empty from "./empty";
import filters from "./filters";
import photoStream from "./photoPreview";
import { FixtureSet } from "../types.d";

type FixtureSets = { [key: string]: FixtureSet };

export default { full, empty, filters, photoStream } as FixtureSets;
