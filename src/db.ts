import {
  Connection,
  ConnectionOptions,
  createConnection as createTypeOrmConnection,
  getConnectionOptions,
} from "typeorm";

type CreateConnectionOpts = {
  loadEntitiesAndMigrations: boolean;
};
export const createConnection = async (
  opts: CreateConnectionOpts
): Promise<Connection> => {
  let entitiesAndMigrations = null;
  if (opts.loadEntitiesAndMigrations) {
    entitiesAndMigrations = require("./entities-and-migrations")
      .entitiesAndMigrations;
  }
  const baseConnectionOptions = await getConnectionOptions();
  const connectionOptions: ConnectionOptions = {
    ...baseConnectionOptions,
    ...entitiesAndMigrations,
  };
  return createTypeOrmConnection(connectionOptions);
};

const closeDatabaseConnection = async (): Promise<void> => {
  const connection = getConnection();
  if (connection.isConnected) {
    await connection.close();
  }
};
