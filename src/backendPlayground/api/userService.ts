import { config } from "node-config-ts"
import { GetSingleApi } from "../../core/api/getSingleApi"
import { User } from "../models/user"
import { CreateApi } from "../../core/api/createApi"
import { UpdateApi } from "../../core/api/updateApi"
import { PaginatedUserResponse } from "../models/paginatedUserResponse"
import { DeleteApi } from "../../core/api/deleteApi"


export class UserService {
    private static baseUrl = config.baseUserServiceUrl + 'users'

    private constructor() {}

    public static getById(id: string): GetSingleApi<User> {
        return new GetSingleApi<User>(this.baseUrl).withId(id)
    }

    public static getAll(): GetSingleApi<PaginatedUserResponse> {
        return new GetSingleApi<PaginatedUserResponse>(this.baseUrl)
    }

    public static create(user: User): CreateApi<User> {
        return new CreateApi<User>(this.baseUrl).withBody(user)
    }

    public static update(id: string, user: User): UpdateApi<User> {
        return new UpdateApi<User>(this.baseUrl).withId(id).withBody(user)
    }

    public static delete(id: string): DeleteApi {
        return new DeleteApi(this.baseUrl).withId(id)
    }
}