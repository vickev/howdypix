import debug from "debug";
import { connect } from "amqplib";
import { connectToRabbitMq } from "../rabbitMq";

jest.mock("debug", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("amqplib", () => ({
  connect: jest.fn(),
}));

describe("rabbitMQ::", () => {
  const url = "1.2.3.4";

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    ((debug as unknown) as jest.Mock).mockImplementation(() => (): void => {});
  });

  describe("connectToRabbitMq", () => {
    it("should connect to the rabbitMQ server", async () => {
      // Initialize
      (connect as jest.Mock).mockImplementation(() => "Connected!!");

      // Run
      await connectToRabbitMq(url);

      // Test
      expect(connect).toHaveBeenCalledWith(url);
    });

    it("should NOT retry to connect if it fails", async () => {
      // Initialize
      (connect as jest.Mock).mockImplementation(() => {
        throw new Error("NOPE");
      });

      // Test
      await expect(connectToRabbitMq(url)).rejects.toThrow("NOPE");
    });

    it("should retry to connect if it fails", (done) => {
      // Initialize
      jest.useFakeTimers("legacy");

      let numberFailure = 0;
      (connect as jest.Mock).mockImplementation(() => {
        if (numberFailure === 5) {
          return "OKAY";
        }

        numberFailure += 1;
        throw new Error("NOPE");
      });

      // run
      connectToRabbitMq(url, { retry: true }).then(() => {
        expect(setTimeout).toHaveBeenCalledTimes(5);
        expect(connect).toHaveBeenCalledTimes(6);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 5000);
        done();
      });

      jest.runAllTimers();
    });
  });
});
