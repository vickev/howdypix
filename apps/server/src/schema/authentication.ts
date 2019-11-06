import { enumType, mutationField, objectType, stringArg } from "nexus";
import { createTransport } from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import { state } from "../state";
import { find } from "lodash";
import { NexusGenFieldTypes } from "@howdypix/graphql-schema/schema";
import { magickLink } from "../email";

export const SendEmailMessage = enumType({
  name: "SendEmailMessage",
  members: ["AUTH_EMAIL_OK", "AUTH_EMAIL_ERR_NOT_EXIST", "AUTH_EMAIL_ERR"],
  description:
    "The type of message that the user can get when requesting a magic link."
});

export const SendEmailType = objectType({
  name: "SendEmailType",
  definition(t) {
    t.field("messageId", { type: "SendEmailMessage" });
  }
});

export const sendEmail = mutationField("sendEmail", {
  type: "SendEmailType",
  args: {
    email: stringArg()
  },
  resolve: async (root, args) =>
    new Promise<NexusGenFieldTypes["Mutation"]["sendEmail"]>(resolve => {
      const user = find(state.userConfig.users, u => u.email == args.email);
      console.log(user);

      if (user) {
        const transporter = createTransport(
          smtpTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT as string),
            ignoreTLS: true
          })
        );

        transporter.sendMail(
          {
            from: `${state.userConfig.emailSender.name}<${state.userConfig.emailSender.email}>`,
            to: `${user.name}<${user.email}>`,
            html: magickLink({ code: "123", name: user.name })
          },
          (error, info) => {
            if (error) {
              resolve({
                messageId: "AUTH_EMAIL_ERR"
              });
            } else {
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
