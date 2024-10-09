import { ApiBase } from './apiBase'

export class CreateApi<T> extends ApiBase<CreateApi<T>> {
    private parentId!: string
    private body!: any

    withParentId(parentId: string): CreateApi<T> {
        this.parentId = parentId
        return this
    }

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
            this.baseUrl = `${this.baseUrl}/${this.parentId}`
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