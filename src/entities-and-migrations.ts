import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export type EntitiesAndMigrationsOpts = Pick<
  PostgresConnectionOptions,
  "entities" | "migrations"
>;
const requireEntities = require.context("./entity/", true, /\.ts$/);
const entitiesViaWebpack = requireEntities
  .keys()
  .sort()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  .map((filename) => {
    const required = requireEntities(filename);
    return Object.keys(required).reduce((result, exportedKey) => {
      const exported = required[exportedKey];
      if (typeof exported === "function") {
        return result.concat(exported);
      }
      return result;
    }, [] as NonNullable<EntitiesAndMigrationsOpts["entities"]>);
  })
  .flat();

const requireMigrations = require.context("./migration/", true, /\.ts$/);
const migrationsViaWebpack = requireMigrations
  .keys()
  .sort()
  .map((filename) => {
    // Allows for export of non default migrations
    const required = requireMigrations(filename);
    return Object.keys(required).reduce((result, exportedKey) => {
      const exported = required[exportedKey];
      if (typeof exported === "function") {
        return result.concat(exported);
      }
      return result;
    }, [] as NonNullable<EntitiesAndMigrationsOpts["migrations"]>);
  })
  .flat();

export const entitiesAndMigrations: EntitiesAndMigrationsOpts = {
  entities: entitiesViaWebpack,
  migrations: migrationsViaWebpack,
};
