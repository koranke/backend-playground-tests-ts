import DBS from "./core/db/dbs";

afterAll(async () => {
    await DBS.playgroundDb.close();
});