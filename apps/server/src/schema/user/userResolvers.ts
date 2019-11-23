import { NexusGenFieldTypes } from "@howdypix/graphql-schema/schema";
import { UserConfigState } from "../../state";
import { createTransport } from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import { magicLink } from "../../email";
import { appDebug } from "@howdypix/utils";
import { NexusGenArgTypes } from "@howdypix/graphql-schema/schema";
import { generateCode, isEmailValid, storeCode } from "../../lib/auth";
import { ApolloContext } from "../../types";

const debug = appDebug("gql:user");

export const currentUserResolver = () => async (
  root: {},
  args: {},
  ctx: ApolloContext
) =>
  new Promise<NexusGenFieldTypes["Query"]["currentUser"]>(async resolve => {
    resolve(ctx.user || undefined);
  });
