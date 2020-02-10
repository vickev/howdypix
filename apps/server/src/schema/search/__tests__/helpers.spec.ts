import { Repository } from "typeorm";
import {
  doSearch,
  fetchSearchResult,
  findSavedSearch,
  saveNewSearch,
  saveSearchResult
} from "../searchHelpers";
import { Photo as EntityPhoto } from "../../../entity/Photo";
import { SearchResult as EntitySearchResult } from "../../../entity/SearchResult";
import { Search as EntitySearch } from "../../../entity/Search";

describe("searchHelpers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("findSavedSearch should make the right query", async () => {
    const findOne = jest.fn(() => ({ data: "yay" }));
    const repository = {
      findOne
    };

    expect(
      await findSavedSearch(
        (repository as unknown) as Repository<EntitySearch>,
        {
          orderBy: "DATE_ASC",
          source: "source",
          album: "album"
        }
      )
    ).toMatchSnapshot();

    expect(findOne.mock.calls).toMatchSnapshot();
  });

  test("saveNewSearch should make the right query", async () => {
    const save = jest.fn(() => ({ data: "yay" }));
    const repository = {
      save
    };

    expect(
      await saveNewSearch((repository as unknown) as Repository<EntitySearch>, {
        orderBy: "DATE_ASC",
        source: "source",
        album: "album"
      })
    ).toMatchSnapshot();

    expect(save.mock.calls).toMatchSnapshot();
  });

  test("doSearch should make the right query", async () => {
    const find = jest.fn(() => [{ data: "yay" }]);
    const repository = {
      find
    };

    expect(
      await doSearch((repository as unknown) as Repository<EntityPhoto>, {
        orderBy: "DATE_ASC",
        source: "source",
        album: "album"
      })
    ).toMatchSnapshot();

    expect(find.mock.calls).toMatchSnapshot();
  });

  test("saveSearchResult should make the right query", async () => {
    const save = jest.fn(() => [{ data: "yay" }]);
    const repository = {
      save
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
      find
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
          filterBy: ""
        },
        0,
        null
      )
    ).toMatchSnapshot();

    expect(find.mock.calls).toMatchSnapshot();
  });
});
