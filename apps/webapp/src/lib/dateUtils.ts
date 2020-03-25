export const formatDate = (locale = "en-US", date: Date): string =>
  new Intl.DateTimeFormat(locale, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
