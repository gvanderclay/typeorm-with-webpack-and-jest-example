import {
  Connection,
  ConnectionOptions,
  createConnection as createTypeOrmConnection,
  getConnection,
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

export const closeDatabaseConnection = async (): Promise<void> => {
  const connection = getConnection();
  if (connection.isConnected) {
    await connection.close();
  }
};

export async function wipeDatabase(conn: Connection): Promise<void> {
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      "Refusing to wipeDb() because it was called from NODE_ENV != 'test'."
    );
  }
  const tableList = (await allTableNamesFromDb(conn))
    .map((t) => `"${t}"`)
    .join(", ");
  if (tableList.length > 0) {
    const query = `TRUNCATE TABLE ${tableList} CASCADE`;
    await conn.query(query);
  }
}

async function allTableNamesFromDb(conn: Connection): Promise<string[]> {
  // eslint-disable-next-line camelcase
  type TableNamesResultT = { table_name: string; table_schema: string }[];
  const tables = (await conn.query(`
  SELECT table_schema, table_name
  FROM information_schema.tables
  WHERE   (table_schema='public')
  AND table_type='BASE TABLE'
  AND not table_name ~ 'migrations'; `)) as TableNamesResultT;
  return tables.map((t) => t.table_name);
}
