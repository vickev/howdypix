module.exports = {
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [__dirname + "/dist/entity/**/*.js"],
  migrations: [__dirname + "/dist/migration/**/*.js"],
  subscribers: [__dirname + "/dist/subscriber/**/*.js"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
