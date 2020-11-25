import { Connection, getRepository } from "typeorm";
import { createConnection } from "./db";
import { User } from "./entity/User";

describe("database works", () => {
  beforeEach(() => {
    createTestConnection({ wipeDb: true });
  });
  it("the database works", async () => {
    const userRepo = getRepository(User);
    await userRepo.create({
      age: 25,
      firstName: "gage",
      lastName: "vander clay",
    });
    const users = await userRepo.find();
    expect(users.length).toEqual(1);
    expect(users[0].age).toEqual(25);
    expect(users[0].firstName).toEqual("gage");
    expect(users[0].lastName).toEqual("vander clay");
  });
});

const createTestConnection: (opts?: {
  wipeDb: boolean;
}) => Promise<Connection> = async (opts) => {
  const conn = await createConnection({ loadEntitiesAndMigrations: false });
  if (opts?.wipeDb === true) {
    await wipeDatabase(conn);
  }
  return conn;
};
async function wipeDatabase(conn: Connection): Promise<void> {
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
