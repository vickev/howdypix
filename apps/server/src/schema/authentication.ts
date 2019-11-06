import { mutationField, objectType, stringArg } from "nexus";
import { MessageId } from "@howdypix/shared-types";
import { createTransport } from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import { state } from "../state";
import { find } from "lodash";
import { NexusGenFieldTypes } from "@howdypix/graphql-schema/schema";
import { magickLink } from "../email";

export const SendEmailType = objectType({
  name: "SendEmailType",
  definition(t) {
    t.field("messageId", { type: "String" });
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
              console.log(error);
              resolve({
                messageId: MessageId.AUTH_EMAIL_ERR
              });
            } else {
              resolve({
                messageId: MessageId.AUTH_EMAIL_OK
              });
            }
          }
        );
      } else {
        resolve({
          messageId: MessageId.AUTH_EMAIL_ERR
        });
      }
    })
});
