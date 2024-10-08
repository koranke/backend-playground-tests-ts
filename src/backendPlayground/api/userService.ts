import { config } from "node-config-ts";
import { GetSingleApi } from "../../core/api/getSingleApi";
import { User } from "../models/user";


export class UserService {
    private static baseUrl = config.baseUserServiceUrl + 'users';

    private constructor() {}

    public static getById(id: string): GetSingleApi<User> {
        return new GetSingleApi<User>(this.baseUrl).withId(id);
    }
}