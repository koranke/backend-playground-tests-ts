import DataSourceCore from './databaseCore';

class PlaygroundDb extends DataSourceCore {

    constructor() {
        super({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'appuser',
            password: 'secret99',
            database: 'playgroundDb',
            synchronize: true,
            logging: false,
            entities: ['src/entity/**/*.ts'],
            migrations: ['src/migration/**/*.ts'],
            subscribers: ['src/subscriber/**/*.ts'],
        });
    }
}

export default PlaygroundDb;