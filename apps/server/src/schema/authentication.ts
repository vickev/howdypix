import { arg, enumType, mutationField, objectType, stringArg } from "nexus";
import { createTransport } from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import { state } from "../state";
import { NexusGenFieldTypes } from "@howdypix/graphql-schema/schema";
import { magicLink } from "../email";
import { appDebug } from "@howdypix/utils";

const debug = appDebug("gql:auth");

export const AuthEmailMessage = enumType({
  name: "AuthEmailMessage",
  members: ["AUTH_EMAIL_OK", "AUTH_EMAIL_ERR_NOT_EXIST", "AUTH_EMAIL_ERR"],
  description:
    "The type of message that the user can get when requesting a magic link."
});

export const AuthEmailType = objectType({
  name: "AuthEmailType",
  definition(t) {
    t.field("messageId", { type: "AuthEmailMessage" });
    t.field("messageData", { type: "String", nullable: true });
  }
});

export const authEmail = mutationField("authEmail", {
  type: "AuthEmailType",
  args: {
    email: stringArg()
  },
  resolve: async (root, args) =>
    new Promise<NexusGenFieldTypes["Mutation"]["authEmail"]>(resolve => {
      const user = state.userConfig.users.find(u => u.email == args.email);

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
          from: `${state.userConfig.emailSender.name}<${state.userConfig.emailSender.email}>`,
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
    })
});
