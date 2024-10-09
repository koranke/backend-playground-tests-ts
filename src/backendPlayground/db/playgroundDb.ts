import DataSourceCore from '../../core/db/databaseCore';
import { config } from "node-config-ts";
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from '../entities/userEntity';

class PlaygroundDb extends DataSourceCore {

    constructor() {
        super({
            type: config.db.type,
            host: config.db.host,
            port: config.db.port,
            username: config.db.DB_USER,
            password: config.db.DB_PASSWORD,
            database: config.db.database,
            namingStrategy: new SnakeNamingStrategy(),
            synchronize: false,
            logging: false,
            entities: ['src/backendPlayground/entities/**/*.ts'],
            migrations: ['src/migration/**/*.ts'],
            subscribers: ['src/subscriber/**/*.ts'],
        });
    }

    public async getUserById(id: number) {
        const manager = await this.getManager();
        return await manager.findOne(User, { where: { id } });
    }
}

export default PlaygroundDb;