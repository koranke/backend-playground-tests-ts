import { ApiBase } from './apiBase'

export class CreateApi<T> extends ApiBase<CreateApi<T>> {
    private body!: any

    withBody(body: any): CreateApi<T> {
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
        return this.post("", this.body)
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