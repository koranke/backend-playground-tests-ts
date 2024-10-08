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

    public async close(): Promise<void> {
        if (this.dataSource) {
            await this.dataSource.destroy();
        }
    }
}

export default DataSourceCore;