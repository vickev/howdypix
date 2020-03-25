import { createTransport } from "nodemailer";
import { authEmailResolver } from "../authResolvers";
import { magicLink } from "../../../email";

type SendEmailOptions = { from: string; to: string };

jest.mock("nodemailer", () => ({
  createTransport: jest.fn(),
}));

jest.mock("../../../email", () => ({
  magicLink: jest.fn(),
}));

describe("authEmailResolver", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const resolver = authEmailResolver(
    { tls: false, port: 222, host: "toto", password: "", user: "" },
    [{ name: "Name", email: "success@vickev.com" }],
    { name: "Sender", email: "sender@vickev.com" }
  );

  test("should send an error if the user does not exist", async () => {
    expect(await resolver({}, { email: "toto" })).toEqual({
      messageId: "AUTH_EMAIL_ERR_NOT_EXIST",
    });
  });

  test("should send an email", async () => {
    (createTransport as jest.Mock).mockImplementation(() => ({
      sendMail: (options: SendEmailOptions, callback: Function): void => {
        expect(options.from).toEqual("Sender<sender@vickev.com>");
        expect(options.to).toEqual("Name<success@vickev.com>");
        expect(magicLink).toBeCalled();
        callback();
      },
    }));

    await resolver({}, { email: "success@vickev.com" });
  });

  test("should send an error if sending an email was not successful", async () => {
    (createTransport as jest.Mock).mockImplementation(() => ({
      sendMail: (options: SendEmailOptions, callback: Function): void => {
        callback({ message: "Error!!" });
      },
    }));

    expect(await resolver({}, { email: "success@vickev.com" })).toEqual({
      messageId: "AUTH_EMAIL_ERR",
      messageData: "Error!!",
    });
  });

  test("should resolve with a success if everything is good", async () => {
    (createTransport as jest.Mock).mockImplementation(() => ({
      sendMail: (options: SendEmailOptions, callback: Function): void => {
        callback();
      },
    }));

    expect(await resolver({}, { email: "success@vickev.com" })).toEqual({
      messageId: "AUTH_EMAIL_OK",
      code: expect.stringContaining(""),
    });
  });
});
