import debug from "debug";
import { omit } from "lodash";
import { HFile, QueueName } from "@howdypix/shared-types";
import { Channel } from "amqplib";
import {
  appDebug,
  appError,
  appInfo,
  appWarning,
  assertQueue,
  consume,
  generateFileUrl,
  generateThumbnailPaths,
  generateThumbnailUrls,
  isHowdypixPath,
  libDebug,
  removeEmptyValues,
  sendToQueue,
  sortJsonStringify,
  wait,
  sortJson,
  parentDir,
  isSupportedMime,
} from "../utils";

jest.mock("debug", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const baseHFile: HFile = {
  name: "name",
  source: "source",
  file: "file",
  dir: "dir",
};

describe("utils::", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    ((debug as unknown) as jest.Mock).mockImplementation(() => (): void => {});
  });

  describe("wait", () => {
    // eslint-disable-next-line jest/no-test-callback
    it("should call setTimeout", async (done) => {
      // Initialize
      jest.useFakeTimers();
      wait(1).then(() => {
        // test
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
        done();
      });

      // Run
      jest.runAllTimers();
    });
  });

  describe("generateThumbnailPaths", () => {
    it("should generate the right paths", () => {
      expect(
        generateThumbnailPaths("/thumbnails", baseHFile)
      ).toMatchSnapshot();
    });

    it("should generate the right paths with missing dir", () => {
      expect(
        generateThumbnailPaths("/thumbnails", omit(baseHFile, ["dir"]))
      ).toMatchSnapshot();
    });

    it("should generate the right paths with missing file", () => {
      expect(() =>
        generateThumbnailPaths("/thumbnails", omit(baseHFile, ["file"]))
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe("generateThumbnailUrls", () => {
    it("should generate the right URLs", () => {
      expect(
        generateThumbnailUrls("http://toto.com", baseHFile)
      ).toMatchSnapshot();

      expect(
        generateThumbnailUrls("http://toto.com/", baseHFile)
      ).toMatchSnapshot();
    });

    it("should generate the right paths with missing dir", () => {
      expect(
        generateThumbnailUrls("http://toto.com", omit(baseHFile, ["dir"]))
      ).toMatchSnapshot();
    });

    it("should generate the right paths with missing file", () => {
      expect(() =>
        generateThumbnailUrls("http://toto.com", omit(baseHFile, ["file"]))
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe("generateFileUrl", () => {
    it("should generate the right URLs", () => {
      expect(generateFileUrl("http://toto.com", baseHFile)).toMatchSnapshot();

      expect(generateFileUrl("http://toto.com/", baseHFile)).toMatchSnapshot();
    });

    it("should generate the right paths with missing dir", () => {
      expect(
        generateFileUrl("http://toto.com", omit(baseHFile, ["dir"]))
      ).toMatchSnapshot();
    });

    it("should generate the right paths with missing file", () => {
      expect(() =>
        generateFileUrl("http://toto.com", omit(baseHFile, ["file"]))
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe("isHowdypixPath", () => {
    it("should return true if it's an howdypath", () => {
      expect(isHowdypixPath("/asdasd/.howdypix/asdasd")).toEqual(true);
      expect(isHowdypixPath("/asdasd/.wrong/asdasd")).toEqual(false);
      expect(isHowdypixPath()).toEqual(false);
    });
  });

  describe("debugging functions", () => {
    [appInfo, appWarning, appError, appDebug, libDebug].forEach((fct) => {
      it(`${fct.name} should call debug() with the right parameters`, () => {
        fct("test");
        expect(debug).toHaveBeenCalled();
        expect(
          ((debug as unknown) as jest.Mock).mock.calls[0]
        ).toMatchSnapshot();
      });
    });
  });

  describe("assertQueue", () => {
    it("should call assertQueue from the channel", () => {
      const channel = { assertQueue: jest.fn() };
      assertQueue((channel as unknown) as Channel, QueueName.PROCESSED);
      expect(channel.assertQueue).toHaveBeenCalledWith(QueueName.PROCESSED);
    });
  });

  describe("consume", () => {
    const content = { data: 1 };
    const channel = {
      consume: jest.fn(),
    };

    beforeEach(() => {
      channel.consume.mockImplementation((name, onMessage) => {
        onMessage({ content: JSON.stringify({ content }) });
      });
    });

    it("should consume a message with the options", () => {
      consume(
        (channel as unknown) as Channel,
        QueueName.TO_PROCESS,
        undefined,
        { noAck: true }
      );

      expect(channel.consume).toHaveBeenCalledWith(
        QueueName.TO_PROCESS,
        expect.any(Function),
        { noAck: true }
      );
    });

    it("should call the callback with the result of the consume", () => {
      const callback = jest.fn();
      consume((channel as unknown) as Channel, QueueName.TO_PROCESS, callback);
      expect(callback).toHaveBeenCalled();
      expect(callback.mock.calls[0]).toMatchSnapshot();
    });

    it("should call the callback with null if the message is not correct", () => {
      channel.consume.mockImplementation((name, onMessage) => {
        onMessage();
      });

      const callback = jest.fn();
      consume((channel as unknown) as Channel, QueueName.TO_PROCESS, callback);
      expect(callback).toHaveBeenCalledWith(null);
    });
  });

  describe("sendToQueue", () => {
    it("should call sendToQueue with the right options", () => {
      const channel = { sendToQueue: jest.fn() };
      sendToQueue(
        (channel as unknown) as Channel,
        QueueName.TO_PROCESS,
        {
          hfile: {
            file: "file",
            source: "source",
            name: "name",
            dir: "dir",
          },
          root: "root",
          thumbnailsDir: "thumbdir",
        },
        { mandatory: true }
      );

      expect(channel.sendToQueue).toHaveBeenCalled();
      expect(channel.sendToQueue.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe("removeEmptyValues", () => {
    it("should remove empty values", () => {
      expect(
        removeEmptyValues({
          IAmNull: null,
          IAmUndefined: undefined,
          IAmZero: 0,
          IAmEmptyString: "",
        })
      ).toEqual({
        IAmZero: 0,
        IAmEmptyString: "",
      });
    });
  });

  [sortJson, sortJsonStringify].forEach((fct) => {
    describe(fct.name, () => {
      it("should sort the object", () => {
        expect(fct({ zz: 1, aa: 1, bb: 2 })).toMatchSnapshot();
        expect(fct({ zz: { zz: 1, aa: 2 }, aa: 1, bb: 2 })).toMatchSnapshot();
      });

      it("should sort the array", () => {
        expect(fct(["zz", "cc", "bb", "aa"])).toMatchSnapshot();
        expect(fct(["zz", "bb", ["zz", "aa"], "aa"])).toMatchSnapshot();
      });

      it("should sort the mix", () => {
        expect(fct(["zz", { zz: 1, aa: 2 }, "aa"])).toMatchSnapshot();
        expect(
          fct({ zz: 1, aa: ["zz", ["zz", "aa"], "bb", "aa"], bb: 2 })
        ).toMatchSnapshot();
      });
    });
  });

  describe("parentDir", () => {
    it("should return the parent directory", () => {
      expect(parentDir("/root/parent/dir")).toEqual("/root/parent");
      expect(parentDir("/root/parent")).toEqual("/root");
      expect(parentDir("/root")).toEqual("/");
      expect(parentDir()).toEqual("");
    });
  });

  describe("isSupportedMime", () => {
    it("should return a boolean if supported", () => {
      expect(isSupportedMime("image/jpeg")).toEqual(true);
      expect(isSupportedMime("image/png")).toEqual(true);
      // @ts-ignore
      expect(isSupportedMime("doesntexist")).toEqual(false);
    });
  });
});
