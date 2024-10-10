import { ApiBase } from './apiBase'

export class UpdateApi<T> extends ApiBase<UpdateApi<T>> {
    private body!: any

    withBody(body: any): UpdateApi<T> {
        this.body = body
        return this
    }

    constructor(baseUrl: string) {
        super()
        this.baseUrl = baseUrl
    }

    async tryCall(): Promise<Response> {
        if (this.parentId) {
            this.baseUrl = this.baseUrl.replace('%s', this.parentId)
        }
        return this.put(this.id, this.body)
    }

    async call(): Promise<T> {
        return this.tryCall().then(async (response) => {
            if (response.ok) {
                const data = await response.json()
                return data as T
            }
            throw new Error(response.statusText)
        })
    }
}