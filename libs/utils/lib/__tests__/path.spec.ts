import { omit } from "lodash";
import { HFile } from "@howdypix/shared-types";
import {
  hjoin,
  hparse,
  path2hfile,
  hfile2path,
  thumbnailPath,
  splitHowdyfiles,
} from "..";

describe("path", () => {
  const baseHfile: HFile = {
    dir: "dir",
    file: "file.jpg",
    source: "source",
    name: "name",
  };

  describe("hjoin", () => {
    it("should return the right value", () => {
      expect(hjoin(baseHfile)).toEqual("@source:dir/file.jpg");
    });

    it("should return the right value without dir", () => {
      expect(hjoin(omit(baseHfile, ["dir"]))).toEqual("@source:file.jpg");
    });

    it("should return the right value without file", () => {
      expect(hjoin(omit(baseHfile, ["file"]))).toEqual("@source:dir");
    });

    it("should return the right value without dir and file", () => {
      expect(hjoin(omit(baseHfile, ["dir", "file"]))).toEqual("@source:.");
    });
  });

  describe("hparse", () => {
    it("should return the right value", () => {
      expect(hparse("@source:dir/file.jpg")).toMatchSnapshot();
      expect(hparse("@source:dir/subdir/file.jpg")).toMatchSnapshot();
    });

    it("should return the right value without file", () => {
      expect(hparse("@source:dir")).toMatchSnapshot();
    });

    it("should return the right value without dir", () => {
      expect(hparse("@source:file.jpg")).toMatchSnapshot();
    });

    it("should return the right value without dir and file", () => {
      expect(hparse("@source:.")).toMatchSnapshot();
    });
  });

  describe("path2hfile", () => {
    it("should return the right value", () => {
      expect(path2hfile("source", "dir/file.jpg")).toMatchSnapshot();
      expect(path2hfile("source", "dir/subdir/file.jpg")).toMatchSnapshot();
    });

    it("should return the right value without dir", () => {
      expect(path2hfile("source", "file.jpg")).toMatchSnapshot();
    });

    it("should return the right value with emtpy path", () => {
      expect(path2hfile("source", "")).toMatchSnapshot();
    });
  });

  describe("hfile2path", () => {
    it("should return the right value", () => {
      expect(hfile2path(baseHfile)).toEqual("dir/file.jpg");
    });

    it("should return the right value without dir", () => {
      expect(hfile2path(omit(baseHfile, ["dir"]))).toEqual("file.jpg");
    });

    it("should return the right value without file", () => {
      expect(hfile2path(omit(baseHfile, ["file"]))).toEqual("dir");
    });

    it("should return the right value without dir and file", () => {
      expect(hfile2path(omit(baseHfile, ["dir", "file"]))).toEqual("");
    });
  });

  describe("thumbnailPath", () => {
    it("should return the right value", () => {
      expect(thumbnailPath("/root", baseHfile)).toEqual(
        "/root/.howdypix/source/dir/file.jpg"
      );
    });

    it("should return the right value without dir", () => {
      expect(thumbnailPath("/root", omit(baseHfile, ["dir"]))).toEqual(
        "/root/.howdypix/source/file.jpg"
      );
    });

    it("should return the right value without file", () => {
      expect(thumbnailPath("/root", omit(baseHfile, ["file"]))).toEqual(
        "/root/.howdypix/source/dir"
      );
    });

    it("should return the right value without file or dir", () => {
      expect(thumbnailPath("/root", omit(baseHfile, ["dir", "file"]))).toEqual(
        "/root/.howdypix/source"
      );
    });

    it("should return the right value if a HPath is passed", () => {
      expect(thumbnailPath("/root", "@source:test")).toEqual(
        "/root/.howdypix/source/test"
      );
    });
  });

  describe("splitHowdyfiles", () => {
    it("should return the right value", () => {
      expect(splitHowdyfiles(baseHfile)).toMatchSnapshot();
      expect(
        splitHowdyfiles({ ...baseHfile, dir: "dir/subdir/subsubdir" })
      ).toMatchSnapshot();
    });
  });
});
