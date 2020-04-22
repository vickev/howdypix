// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("config");

module.exports = {
  type: "sqlite",
  database: config.get("app.database.path"),
  synchronize: true,
  logging: false,
  entities: [`${__dirname}/dist/entity/**/*.js`],
  migrations: [`${__dirname}/dist/migration/**/*.js`],
  subscribers: [`${__dirname}/dist/subscriber/**/*.js`],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
