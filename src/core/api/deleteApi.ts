import { ApiBase } from './apiBase'

export class DeleteApi extends ApiBase<DeleteApi> {

    constructor(baseUrl: string) {
        super()
        this.baseUrl = baseUrl
    }

    async tryCall(): Promise<Response> {
        if (this.parentId) {
            this.baseUrl = this.baseUrl.replace('%s', this.parentId)
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