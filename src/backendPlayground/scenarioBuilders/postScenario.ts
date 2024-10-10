import { faker } from "@faker-js/faker/."
import { ScenarioCore } from "../../core/utilities/scenarioCore"
import { PostService } from "../api/postService"
import { PostVisibility } from "../enums/postVisibility"
import { Post } from "../entities/postEntity"

export class PostScenario extends ScenarioCore {
    private _userId: number | null = null
    private _postId: number | null = null
    private _postTitle: string | null = null
    private _postContent: string | null = null
    private _postVisibility: PostVisibility | null = null

    public withDefaults(): PostScenario {
        if (this.needsDefaultValuesPopulated) {
            this._postTitle = this.getNonNull(this._postTitle, faker.string.alphanumeric(10))
            this._postContent = this.getNonNull(this._postContent, faker.lorem.paragraph())
            this._postVisibility = this.getNonNull(this._postVisibility, PostVisibility.PUBLIC)
            this.needsDefaultValuesPopulated = false
        }
        return this
    }

    public async create(): Promise<PostScenario> {
        this.withDefaults();
        if (this._userId === null) {
            throw new Error("User ID is required to create a post")
        }

        const post = await PostService.create(this._userId.toString(), this.getAsPost()).call()
        this._postId = post.id
        return this
    }

    public getAsPost(): Post {
        return {
            id: this._postId!,
            userId: this._userId!,
            title: this._postTitle!,
            content: this._postContent!,
            visibility: this._postVisibility!,
            dateCreated: new Date(),
            dateUpdated: new Date()
        }
    }

    public get postId(): number {
        return this._postId!
    }

    public get postTitle(): string {
        return this._postTitle!
    }

    public get postContent(): string {
        return this._postContent!
    }

    public get postVisibility(): PostVisibility {
        return this._postVisibility!
    }

    public get userId(): number {
        return this._userId!
    }

    public withPostTitle(postTitle: string): PostScenario {
        this._postTitle = postTitle
        return this
    }

    public withPostContent(postContent: string): PostScenario {
        this._postContent = postContent
        return this
    }

    public withPostVisibility(postVisibility: PostVisibility): PostScenario {
        this._postVisibility = postVisibility
        return this
    }

    public withUserId(userId: number): PostScenario {
        this._userId = userId
        return this
    }
}