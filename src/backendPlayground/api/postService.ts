import { config } from "node-config-ts"
import { GetSingleApi } from "../../core/api/getSingleApi"
import { CreateApi } from "../../core/api/createApi"
import { UpdateApi } from "../../core/api/updateApi"
import { DeleteApi } from "../../core/api/deleteApi"
import { Post } from "../entities/postEntity"
import { GetAllApi } from "../../core/api/getAllApi"

export class PostService {
    private static readonly BASE_URL = `${config.basePostServiceUrl}users/%s/posts`
    private static readonly DIRECT_BASE_URL = `${config.basePostServiceUrl}posts`

    private constructor() { }

    public static create(userId: StringOrNumber, post: any): CreateApi<Post> {
        return new CreateApi<Post>(this.BASE_URL).withBody(post).withParentId(userId)
    }

    public static getById(id: StringOrNumber): GetSingleApi<Post> {
        return new GetSingleApi<Post>(this.DIRECT_BASE_URL).withId(id)
    }

    public static getAllForUser(userId: StringOrNumber): GetAllApi<Post> {
        return new GetAllApi<Post>(this.BASE_URL).withParentId(userId)
    }

    public static update(userId: StringOrNumber, postId: StringOrNumber, post: Post): UpdateApi<Post> {
        return new UpdateApi<Post>(this.BASE_URL).withParentId(userId).withId(postId).withBody(post)
    }

    public static delete(userId: StringOrNumber, postId: StringOrNumber): DeleteApi {
        return new DeleteApi(this.BASE_URL).withParentId(userId).withId(postId)
    }
}