import { NexusGenFieldTypes } from "@howdypix/graphql-schema/schema";
import { UserConfigState } from "../../state";
import { createTransport } from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import { magicLink } from "../../email";
import { appDebug } from "@howdypix/utils";
import { NexusGenArgTypes } from "@howdypix/graphql-schema/schema";

const debug = appDebug("gql:auth");

export const authEmailResolver = (
  authorizedUsers: UserConfigState["users"],
  sender: UserConfigState["emailSender"]
) => async (root: {}, args: NexusGenArgTypes["Mutation"]["authEmail"]) =>
  new Promise<NexusGenFieldTypes["Mutation"]["authEmail"]>(resolve => {
    const user = authorizedUsers.find(u => u.email == args.email);

    debug(
      `Authentication requested: ${args.email} - user found: ${(user &&
        user.name) ||
        "none"}`
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

      transporter.sendMail(
        {
          ...mailOptions,
          html: magicLink({ code: "123", name: user.name })
        },
        (error, info) => {
          if (error) {
            debug("Error sending the email", error.message);
            resolve({
              messageId: "AUTH_EMAIL_ERR",
              messageData: error.message
            });
          } else {
            debug(`Email sent successfully to ${user.email}.`);
            resolve({
              messageId: "AUTH_EMAIL_OK"
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
