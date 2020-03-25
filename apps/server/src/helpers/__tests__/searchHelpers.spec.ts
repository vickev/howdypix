import { Connection, Repository } from "typeorm";
import { searchHelpers } from "../searchHelpers";
import { Photo as EntityPhoto } from "../../entity/Photo";
import { SearchResult as EntitySearchResult } from "../../entity/SearchResult";
import { Search as EntitySearch } from "../../entity/Search";

const {
  doSearch,
  fetchSearchResult,
  findSavedSearch,
  saveNewSearch,
  saveSearchResult,
} = searchHelpers;

describe("searchHelpers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("findSavedSearch should make the right query", async () => {
    const findOne = jest.fn(() => ({ data: "yay" }));
    const repository = {
      findOne,
    };

    expect(
      await findSavedSearch(
        (repository as unknown) as Repository<EntitySearch>,
        {
          orderBy: "DATE_ASC",
          source: "source",
          album: "album",
        }
      )
    ).toMatchSnapshot();

    expect(findOne.mock.calls).toMatchSnapshot();
  });

  test("saveNewSearch should make the right query", async () => {
    const save = jest.fn(() => ({ data: "yay" }));
    const repository = {
      save,
    };

    expect(
      await saveNewSearch((repository as unknown) as Repository<EntitySearch>, {
        orderBy: "DATE_ASC",
        source: "source",
        album: "album",
      })
    ).toMatchSnapshot();

    expect(save.mock.calls).toMatchSnapshot();
  });

  test("doSearch should make the right query", async () => {
    const find = jest.fn(() => [{ data: "yay" }]);
    const repository = {
      find,
    };

    expect(
      await doSearch((repository as unknown) as Repository<EntityPhoto>, {
        orderBy: "DATE_ASC",
        source: "source",
        album: "album",
      })
    ).toMatchSnapshot();

    expect(find.mock.calls).toMatchSnapshot();
  });

  test("saveSearchResult should make the right query", async () => {
    const save = jest.fn(() => [{ data: "yay" }]);
    const repository = {
      save,
    };

    expect(
      await saveSearchResult(
        (repository as unknown) as Repository<EntitySearchResult>,
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        [{ id: 123 }, { id: 456 }],
        { id: 890 }
      )
    ).toMatchSnapshot();

    expect(save.mock.calls).toMatchSnapshot();
  });

  test("fetchSearchResult should make the right query", async () => {
    const find = jest.fn(() => [{ data: "yay" }]);
    const repository = {
      find,
    };

    expect(
      await fetchSearchResult(
        (repository as unknown) as Repository<EntitySearchResult>,
        {
          id: 890,
          album: "album",
          source: "source",
          orderBy: "orderBy",
          searchResults: [],
          filterBy: "",
        },
        1,
        5
      )
    ).toMatchSnapshot();

    expect(find.mock.calls).toMatchSnapshot();
  });

  describe("doSearchWithCache", () => {
    beforeEach(() => {
      jest.resetAllMocks();

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      searchHelpers.findSavedSearch = jest.fn();
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      searchHelpers.saveSearchResult = jest.fn();
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      searchHelpers.saveNewSearch = jest.fn();
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      searchHelpers.doSearch = jest.fn();
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      searchHelpers.fetchSearchResult = jest.fn();
    });

    const connection = ({
      getRepository: jest.fn(() => ({})),
    } as unknown) as Connection;

    describe("with not-saved results", () => {
      beforeEach(async () => {
        (searchHelpers.findSavedSearch as jest.Mock).mockReturnValue(null);
        (searchHelpers.saveSearchResult as jest.Mock).mockReturnValue([
          {
            order: 0,
            id: 123,
            search: {
              id: 123,
            },
            photo: {
              id: 123,
              file: "file",
              source: "source",
              dir: "dir",
            },
          },
          {
            order: 1,
            id: 456,
            search: {
              id: 123,
            },
            photo: {
              id: 456,
              file: "file",
              source: "source",
              dir: "dir",
            },
          },
        ] as EntitySearchResult[]);
      });

      test("should save the new search", async () => {
        await searchHelpers.doSearchWithCache(connection, {});
        expect(searchHelpers.saveNewSearch).toHaveBeenCalled();
      });

      test("should make the search in the library", async () => {
        await searchHelpers.doSearchWithCache(connection, {});
        expect(searchHelpers.doSearch).toHaveBeenCalled();
      });

      test("should save the search results", async () => {
        await searchHelpers.doSearchWithCache(connection, {});
        expect(searchHelpers.saveSearchResult).toHaveBeenCalled();
      });

      test("should return the results", async () => {
        expect(
          await searchHelpers.doSearchWithCache(connection, {})
        ).toMatchSnapshot();
      });

      test("should return the results with the pagination", async () => {
        expect(
          await searchHelpers.doSearchWithCache(connection, {}, 0, 1)
        ).toMatchSnapshot();
        expect(
          await searchHelpers.doSearchWithCache(connection, {}, 1, 1)
        ).toMatchSnapshot();
      });
    });

    describe("with saved results", () => {
      beforeEach(() => {
        (searchHelpers.findSavedSearch as jest.Mock).mockReturnValue({
          searchResults: [],
          filterBy: "",
          orderBy: "orderBy",
          source: "source",
          album: "album",
          id: 123,
        } as EntitySearch);

        (searchHelpers.fetchSearchResult as jest.Mock).mockReturnValue([
          {
            order: 0,
            id: 123,
            search: {
              id: 123,
            },
            photo: {
              id: 123,
              file: "file",
              source: "source",
              dir: "dir",
            },
          },
        ] as EntitySearchResult[]);
      });

      test("should NOT save a new search or do a new search", async () => {
        await searchHelpers.doSearchWithCache(connection, {});
        expect(searchHelpers.saveNewSearch).not.toHaveBeenCalled();
        expect(searchHelpers.doSearch).not.toHaveBeenCalled();
        expect(searchHelpers.saveSearchResult).not.toHaveBeenCalled();
      });

      test("should fetch the results from the saved search", async () => {
        await searchHelpers.doSearchWithCache(connection, {});
        expect(searchHelpers.fetchSearchResult).toHaveBeenCalled();
      });

      test("should return the saved photos", async () => {
        expect(
          await searchHelpers.doSearchWithCache(connection, {})
        ).toMatchSnapshot();
      });

      test("should return photo according to the pagination", async () => {
        await searchHelpers.doSearchWithCache(connection, {}, 5, 10);
        expect(
          (searchHelpers.fetchSearchResult as jest.Mock).mock.calls[0]
        ).toMatchSnapshot();
      });
    });
  });
});
