import { ConnectionOptions } from "typeorm";

export type EntitiesAndMigrationsOpts = Pick<
  ConnectionOptions,
  "entities" | "migrations"
>;

const importAllFunctions = (
  requireContext: __WebpackModuleApi.RequireContext
) =>
  requireContext
    .keys()
    .sort()
    .map((filename) => {
      const required = requireContext(filename);
      return Object.keys(required).reduce((result, exportedKey) => {
        const exported = required[exportedKey];
        if (typeof exported === "function") {
          return result.concat(exported);
        }
        return result;
      }, [] as any);
    })
    .flat();

const entitiesViaWebpack: NonNullable<
  EntitiesAndMigrationsOpts["entities"]
> = importAllFunctions(require.context("./entity/", true, /\.ts$/));
const migrationsViaWebpack: NonNullable<
  EntitiesAndMigrationsOpts["migrations"]
> = importAllFunctions(require.context("./migration/", true, /\.ts$/));

export const entitiesAndMigrations: EntitiesAndMigrationsOpts = {
  entities: entitiesViaWebpack,
  migrations: migrationsViaWebpack,
};
