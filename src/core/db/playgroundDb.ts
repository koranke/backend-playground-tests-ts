import DataSourceCore from './databaseCore';
import { config } from "node-config-ts";

class PlaygroundDb extends DataSourceCore {

    constructor() {
        super({
            type: config.db.type,
            host: config.db.host,
            port: config.db.port,
            username: config.db.DB_USER,
            password: config.db.DB_PASSWORD,
            database: config.db.database,
            synchronize: true,
            logging: false,
            entities: ['src/entity/**/*.ts'],
            migrations: ['src/migration/**/*.ts'],
            subscribers: ['src/subscriber/**/*.ts'],
        });
    }
}

export default PlaygroundDb;