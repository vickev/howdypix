import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
} from "@howdypix/graphql-schema/schema.d";
import { createTransport } from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import { appDebug } from "@howdypix/utils";
import { magicLink } from "../../email";
import { UserConfig, AppConfig } from "../../config";
import { generateCode, isEmailValid, storeCode } from "../../lib/auth";

const debug = appDebug("gql:auth");

export const authEmailResolver = (
  smtpConfig: AppConfig["smtp"],
  authorizedUsers: UserConfig["users"],
  sender: UserConfig["emailSender"]
) => async (
  root: {},
  args: NexusGenArgTypes["Mutation"]["authEmail"]
): Promise<NexusGenFieldTypes["Mutation"]["authEmail"]> =>
  new Promise<NexusGenFieldTypes["Mutation"]["authEmail"]>((resolve) => {
    const email = args.email || "NONE";
    const user = isEmailValid(authorizedUsers, email);

    debug(
      `Authentication requested: ${email} - user found: ${user?.name || "none"}`
    );

    if (user) {
      const transporter = process.env.MOCK
        ? createTransport({
            streamTransport: true,
            newline: "windows",
          })
        : createTransport(
            smtpTransport({
              host: smtpConfig.host,
              port: smtpConfig.port,
              requireTLS: smtpConfig.tls,
              auth: {
                user: smtpConfig.user,
                pass: smtpConfig.password,
              },
            })
          );

      const mailOptions = {
        subject: "Authentication code",
        from: `${sender.name}<${sender.email}>`,
        to: `${user.name}<${user.email}>`,
      };

      debug("Send email", mailOptions);

      generateCode({ email: user.email, name: user.name }).then((code) => {
        transporter.sendMail(
          {
            ...mailOptions,
            html: magicLink({
              code,
              name: user.name,
            }),
          },
          (error) => {
            if (error) {
              debug("Error sending the email", error.message);
              resolve({
                messageId: "AUTH_EMAIL_ERR",
                messageData: error.message,
              });
            } else {
              // Save in memory
              storeCode(user.email, code);
              debug(`Email sent successfully to ${user.email}.`);
              resolve({
                messageId: "AUTH_EMAIL_OK",
                code,
              });
            }
          }
        );
      });
    } else {
      resolve({
        messageId: "AUTH_EMAIL_ERR_NOT_EXIST",
      });
    }
  });
