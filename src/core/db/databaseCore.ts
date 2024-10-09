import { DataSource, DataSourceOptions } from 'typeorm';

class DataSourceCore {
    private dataSource!: DataSource;

    constructor(private config: DataSourceOptions) {}

    public async initialize(): Promise<void> {
        if (!this.dataSource) {
            this.dataSource = new DataSource(this.config);
            await this.dataSource.initialize();
        }
    }

    public async executeQuery(query: string): Promise<any> {
        await this.initialize();
        return await this.dataSource.query(query);
    }

    public async getManager() {
        await this.initialize();
        return this.dataSource.manager;
    }

    public async getRepository(entity: any) {
        await this.initialize();
        return this.dataSource.getRepository(entity);
    }

    public async findAll(entity: any) {
        await this.initialize();
        return this.dataSource.manager.find(entity);
    }

    public async findOne(entity: any, id: any) {
        await this.initialize();
        return this.dataSource.manager.findOne(entity, { where: { id } });
    }

    public async close(): Promise<void> {
        if (this.dataSource) {
            await this.dataSource.destroy();
        }
    }
}

export default DataSourceCore;