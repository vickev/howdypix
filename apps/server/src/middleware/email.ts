import * as emails from "../email";
import { Handler } from "express";

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

  if (!templateName || !emails.hasOwnProperty(templateName)) {
    res.send(
      `Error: The template "${templateName}" does not exist. Select between: [${Object.keys(
        emails
      ).join(", ")}].`
    );
  } else {
    // @ts-ignore
    res.send(emails[templateName](req.query));
  }
};
