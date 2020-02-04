import { Connection } from "typeorm";
import { NexusGenFieldTypes } from "@howdypix/graphql-schema/schema.d";
import * as searchResolversModule from "../searchResolvers";
import {
  doSearch,
  fetchSearchResult,
  findSavedSearch,
  saveNewSearch,
  saveSearchResult
} from "../searchHelpers";
import { SearchResult as EntitySearchResult } from "../../../entity/SearchResult";
import { Search as EntitySearch } from "../../../entity/Search";

jest.mock("../searchHelpers", () => ({
  findSavedSearch: jest.fn(),
  saveNewSearch: jest.fn(),
  saveSearchResult: jest.fn(),
  doSearch: jest.fn(),
  fetchSearchResult: jest.fn()
}));

describe("getSearchResolver", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const callResolver = async (): Promise<NexusGenFieldTypes["Query"]["getSearch"]> => {
    const connection = ({
      getRepository: jest.fn(() => ({}))
    } as unknown) as Connection;
    const resolver = searchResolversModule.getSearchResolver();
    return resolver({}, {}, { user: null, connection });
  };

  describe("with not-saved results", () => {
    beforeEach(async () => {
      (findSavedSearch as jest.Mock).mockReturnValue(null);
      (saveSearchResult as jest.Mock).mockReturnValue([
        {
          order: 0,
          id: 123,
          search: {
            id: 123
          },
          photo: {
            id: 123,
            file: "file",
            source: "source",
            dir: "dir"
          }
        }
      ] as EntitySearchResult[]);
    });

    test("should save the new search", async () => {
      await callResolver();
      expect(saveNewSearch).toHaveBeenCalled();
    });

    test("should make the search in the library", async () => {
      await callResolver();
      expect(doSearch).toHaveBeenCalled();
    });

    test("should save the search results", async () => {
      await callResolver();
      expect(saveSearchResult).toHaveBeenCalled();
    });

    test("should return the results", async () => {
      expect(await callResolver()).toMatchSnapshot();
    });
  });

  describe("with saved results", () => {
    beforeEach(() => {
      (findSavedSearch as jest.Mock).mockReturnValue({
        searchResults: [],
        filterBy: "",
        orderBy: "orderBy",
        source: "source",
        album: "album",
        id: 123
      } as EntitySearch);

      (fetchSearchResult as jest.Mock).mockReturnValue([
        {
          order: 0,
          id: 123,
          search: {
            id: 123
          },
          photo: {
            id: 123,
            file: "file",
            source: "source",
            dir: "dir"
          }
        }
      ] as EntitySearchResult[]);
    });

    test("should NOT save a new search or do a new search", async () => {
      await callResolver();
      expect(saveNewSearch).not.toHaveBeenCalled();
      expect(doSearch).not.toHaveBeenCalled();
      expect(saveSearchResult).not.toHaveBeenCalled();
    });

    test("should fetch the results from the saved search", async () => {
      await callResolver();
      expect(fetchSearchResult).toHaveBeenCalled();
    });

    test("should return the saved photos", async () => {
      expect(await callResolver()).toMatchSnapshot();
    });
  });

  /*
  test("should make a new search if not in the search table", async () => {
    const saveSearch = jest.fn();
    const saveSearchResult = jest.fn();

    const connection = ({
      getRepository: (
        entity: Function
      ):
        | Partial<Repository<EntitySearch | EntitySearchResult | EntityPhoto>>
        | undefined => {
        if (entity.name === "Search") {
          return {
            findOne: jest.fn(),
            save: saveSearch
          };
        }

        if (entity.name === "SearchResult") {
          return {
            find: jest.fn(),
            save: saveSearchResult
          };
        }

        if (entity.name === "Photo") {
          return {
            find: jest.fn().mockReturnValue([
              {
                id: 1234
              },
              {
                id: 567
              },
              {
                id: 890
              }
            ] as EntityPhoto[])
          };
        }

        return undefined;
      }
    } as unknown) as Connection;

    await resolver({}, {}, { user: null, connection });
    expect(saveSearch).toHaveBeenCalled();
    expect(saveSearchResult).toHaveBeenCalledTimes(3);
  });
  */
});
