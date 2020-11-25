import { Connection, getRepository } from "typeorm";
import { closeDatabaseConnection, createConnection, wipeDatabase } from "./db";
import { User } from "./entity/User";

describe("database works", () => {
  beforeEach(async () => {
    await createTestConnection({ wipeDb: true });
  });
  afterAll(async () => {
    await closeDatabaseConnection();
  });
  it("the database works", async () => {
    const userRepo = getRepository(User);
    await userRepo.save({
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
