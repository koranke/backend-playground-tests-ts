import { AuthType } from '../../types/authType';

export class ApiBase<T> {
    protected baseUrl!: string
    protected headers!: Headers
    protected queryParams!: URLSearchParams
    protected contentType!: string
    protected accept!: string
    protected authorization!: string
    protected authtype!: AuthType

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
        console.log('\nRequest Details:')
        console.log(`method: ${method}`)
        console.log(`endpoint: ${endpoint}`)
        console.log(`headers: ${this.headers?.forEach((value, name) => `${name}: ${value}`)}`)
        console.log(`queryParams: ${this.queryParams}`)
        if (body) {
            console.log(`body: ${body}`)
        }
    }

    logResponseDetails(response: Response): void {
        console.log('\nResponse Details:')
        console.log(`status: ${response.status}`)
        console.log(`statusText: ${response.statusText}`)
        console.log(`headers: ${response.headers?.forEach((value, name) => `${name}: ${value}`)}`)
        if (response.body) {
            console.log(`body: ${response.body}`)
        }
    }
}