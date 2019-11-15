import { NexusGenFieldTypes } from "@howdypix/graphql-schema/schema";
import { UserConfigState } from "../../state";
import { createTransport } from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import { magicLink } from "../../email";
import { appDebug } from "@howdypix/utils";
import { NexusGenArgTypes } from "@howdypix/graphql-schema/schema";
import { generateCode, isEmailValid, storeCode } from "../../lib/auth";

const debug = appDebug("gql:auth");

export const authEmailResolver = (
  authorizedUsers: UserConfigState["users"],
  sender: UserConfigState["emailSender"]
) => async (root: {}, args: NexusGenArgTypes["Mutation"]["authEmail"]) =>
  new Promise<NexusGenFieldTypes["Mutation"]["authEmail"]>(async resolve => {
    const email = args.email ?? "NONE";
    const user = isEmailValid(authorizedUsers, email);

    debug(
      `Authentication requested: ${email} - user found: ${user?.name ?? "none"}`
    );

    if (user) {
      const transporter = createTransport(
        smtpTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT as string),
          ignoreTLS: true
        })
      );

      const mailOptions = {
        from: `${sender.name}<${sender.email}>`,
        to: `${user.name}<${user.email}>`
      };

      debug("Send email", mailOptions);

      const code = await generateCode({ email: user.email });

      transporter.sendMail(
        {
          ...mailOptions,
          html: magicLink({
            code,
            name: user.name
          })
        },
        (error, info) => {
          if (error) {
            debug("Error sending the email", error.message);
            resolve({
              messageId: "AUTH_EMAIL_ERR",
              messageData: error.message
            });
          } else {
            // Save in memory
            storeCode(user.email, code);
            debug(`Email sent successfully to ${user.email}.`);
            resolve({
              messageId: "AUTH_EMAIL_OK",
              code
            });
          }
        }
      );
    } else {
      resolve({
        messageId: "AUTH_EMAIL_ERR_NOT_EXIST"
      });
    }
  });
