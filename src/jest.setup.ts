import DBS from "./core/dbs";

afterAll(async () => {
    await DBS.playgroundDb.close();
});