import { ApiBase } from './apiBase';

export class DeleteApi extends ApiBase<DeleteApi> {
    private parentId!: string
    private id!: string

    withParentId(parentId: string): DeleteApi {
        this.parentId = parentId
        return this
    }

    withId(id: string): DeleteApi {
        this.id = id
        return this
    }

    constructor(baseUrl: string) {
        super()
        this.baseUrl = baseUrl
    }

    async tryCall(): Promise<Response> {
        if (this.parentId) {
            this.baseUrl = `${this.baseUrl}/${this.parentId}`
        }
        return this.delete(this.id)
    }

    async call(): Promise<Response> {
        return this.tryCall().then(async (response) => {
            if (response.ok) {
                return response
            }
            throw new Error(response.statusText);
        })
    }
}