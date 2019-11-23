import { Handler } from "express";
import * as emails from "../email";

const typedEmails = emails as {
  [name: string]: (queryparams: object) => string;
};

export const emailListHandler: Handler = (req, res) => {
  res.send(
    `<ul>${Object.keys(emails)
      .map(
        templateName =>
          `<li><a href="/email/${templateName}">${templateName}</a></li>`
      )
      .join("")}</ul>`
  );
};

export const emailViewHandler: Handler = (req, res) => {
  const templateName = req.params[0];

  if (!templateName || !typedEmails[templateName]) {
    res.send(
      `Error: The template "${templateName}" does not exist. Select between: [${Object.keys(
        emails
      ).join(", ")}].`
    );
  } else {
    res.send(typedEmails[templateName](req.query));
  }
};
