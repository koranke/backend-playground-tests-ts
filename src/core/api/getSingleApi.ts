import { ApiBase } from './apiBase';

export class GetSingleApi<T> extends ApiBase<GetSingleApi<T>> {
    private parentId!: string;
    private id!: string;

    withParentId(parentId: string): GetSingleApi<T> {
        this.parentId = parentId;
        return this;
    }

    withId(id: string): GetSingleApi<T> {
        this.id = id;
        return this;
    }

    constructor(baseUrl: string) {
        super();
        this.baseUrl = baseUrl;
    }

    async tryCall(): Promise<Response> {
        if (this.parentId) {
            this.baseUrl = `${this.baseUrl}/${this.parentId}`;
        }
        return this.get(this.id);
    }

    async call(): Promise<T> {
        return this.tryCall().then(async (response) => {
            if (response.ok) {
                const data = await response.json();
                return data as T;
            }
            throw new Error(response.statusText);
        });
    }
}