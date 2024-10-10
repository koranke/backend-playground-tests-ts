import { ApiBase } from './apiBase'

export class GetAllApi<T> extends ApiBase<GetAllApi<T>> {

    constructor(baseUrl: string) {
        super()
        this.baseUrl = baseUrl
    }

    async tryCall(): Promise<Response> {
        if (this.parentId) {
            this.baseUrl = this.baseUrl.replace('%s', this.parentId)
        }
        return this.get("")
    }

    async call(): Promise<T[]> {
        return this.tryCall().then(async (response) => {
            if (response.ok) {
                const data = await response.json()
                return data as T[]
            }
            throw new Error(response.statusText)
        })
    }
}