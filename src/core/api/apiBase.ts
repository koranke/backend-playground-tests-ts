import { AuthType } from '../../types/authType'
import { logger } from '../utilities/logging'

export class ApiBase<T> {
    protected baseUrl!: string
    protected headers!: Headers
    protected queryParams!: URLSearchParams
    protected contentType: string = 'application/json'
    protected accept!: string
    protected authorization!: string
    protected authtype!: AuthType

    protected parentId!: string
    protected id!: string

    withParentId(parentId: StringOrNumber): T {
        this.parentId = parentId.toString()
        return this as unknown as T
    }

    withId(id: StringOrNumber): T {
        this.id = id.toString()
        return this as unknown as T
    }

    withHeader(key: string, value: string): T {
        if (this.headers == null) {
            this.headers = new Headers()
        }
        this.headers.append(key, value)
        return this as unknown as T
    }

    withQueryParam(key: string, value: string): T {
        if (this.queryParams == null) {
            this.queryParams = new URLSearchParams()
        }
        this.queryParams.append(key, value)
        return this as unknown as T
    }

    withAuthorization(token: string): T {
        this.authorization = token
        return this as unknown as T
    }

    withContentType(contentType: string): T {
        this.contentType = contentType
        return this as unknown as T
    }

    withAccept(accept: string): T {
        this.accept = accept
        return this as unknown as T
    }

    getEndpointWithQueryParams(endpoint: string): string {
        if (this.queryParams == null || this.queryParams.toString() === '') {
            return `${this.baseUrl}${endpoint}`
        }
        return `${this.baseUrl}${endpoint}?${this.queryParams.toString()}`
    }

    async get(endpoint: string): Promise<Response> {
        return this.runRequest('GET', endpoint, null)
    }

    async post(endpoint: string, body: any): Promise<Response> {
        return this.runRequest('POST', endpoint, body)
    }

    async put(endpoint: string, body: any): Promise<Response> {
        return this.runRequest('PUT', endpoint, body)
    }

    async delete(endpoint: string): Promise<Response> {
        return this.runRequest('DELETE', endpoint, null)
    }

    async runRequest(method: string, endpoint: string, body: any): Promise<Response> {
        this.configureRequest()
        endpoint = ApiBase.formatEndpoint(endpoint)
        const fullUrl: string = this.getEndpointWithQueryParams(endpoint)
        this.logRequestDetails(method, fullUrl, body)
        const response = await fetch(fullUrl, {
            method: method,
            headers: this.headers,
            ...(body !== null ? { body: JSON.stringify(body) } : {})
        })

        this.logResponseDetails(response)
        return response
    }

    configureRequest(): void {
        if (this.contentType) {
            this.withHeader('Content-Type', this.contentType)
        }
        if (this.accept) {
            this.withHeader('Accept', this.accept)
        }
        if (this.authorization && this.authtype) {
            this.withHeader('Authorization', `${this.authtype} ${this.authorization}`)
        }
    }

    private static formatEndpoint(endpoint: string): string {
        if (!endpoint) {
            endpoint = ''
        }
        if (endpoint !== '' && !endpoint.startsWith('/')) {
            endpoint = `/${endpoint}`
        }
        return endpoint
    }

    logRequestDetails(method: string, endpoint: string, body: any): void {
        const headers = this.headers ? Array.from(this.headers.entries()).map(([name, value]) => `${name}: ${value}`).join(', ') : ''
        const bodyContent = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : ''
        const logMessage = `
            Request Details:
            method: ${method}
            endpoint: ${endpoint}
            headers: ${headers}
            queryParams: ${this.queryParams}
            body: ${bodyContent}
        `.trim().replace(/\s+/g, ' ')

        logger.info(logMessage)
    }

    logResponseDetails(response: Response): void {
        const headers = response.headers ? Array.from(response.headers.entries()).map(([name, value]) => `${name}: ${value}`).join(', ') : ''
        const bodyContent = response.body ? (typeof response.body === 'string' ? response.body : JSON.stringify(response.body)) : ''
        const logMessage = `
            Response Details:
            status: ${response.status}
            statusText: ${response.statusText}
            headers: ${headers}
            body: ${bodyContent}
        `.trim().replace(/\s+/g, ' ')

        logger.info(logMessage)
    }
}