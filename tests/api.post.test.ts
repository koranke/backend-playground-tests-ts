import cloneDeep from "lodash.clonedeep"
import { PostService } from "../src/backendPlayground/api/postService"
import { PostVisibility } from "../src/backendPlayground/enums/postVisibility"
import { PostScenario } from "../src/backendPlayground/scenarioBuilders/postScenario"
import { UserScenario } from "../src/backendPlayground/scenarioBuilders/userScenario"
import DBS from "../src/core/db/dbs"
import '../src/core/utilities/customJestMatcher'

test('Can create a post.', async () => {
    // SETUP
    const userId = (await new UserScenario().create()).id
    const userPost = new PostScenario().withDefaults().withUserId(userId).getAsPost()

    // ACTION UNDER TEST
    const post = await PostService.create(userId, userPost).call()

    // VERIFY
    const savedPost = await DBS.playgroundPostDb.getById(post.id)
    expect(savedPost).toEqualExcludingFields(post, ['dateCreated', 'dateUpdated'])
})

test('Cannot create a post with invalid visibility.', async () => {
    // SETUP
    const userId = (await new UserScenario().create()).id
    let userPost = new PostScenario().withDefaults().withUserId(userId).getAsPost()
    userPost = JSON.parse(JSON.stringify(userPost).replace('PUBLIC', 'INVALID_VISIBILITY'))

    // ACTION UNDER TEST & VERIFY
    await PostService.create(userId, userPost).tryCall().then(async (response) => {
        expect(response.status).toBe(400)
        const responseBody = await response.text()
        expect(responseBody).toBe('Invalid value for PostVisibility: INVALID_VISIBILITY')
    })
})

test('Can get a post by id.', async () => {
    // SETUP
    const userScenario = await new UserScenario().withNumberOfPosts(1).create()
    const postId = userScenario.posts[0].id

    // ACTION UNDER TEST
    const post = await PostService.getById(postId).call()

    // VERIFY
    const savedPost = await PostService.getById(postId).call()
    expect(savedPost).toEqualExcludingFields(post, ['dateCreated', 'dateUpdated'])
})

test('Cannot get a post by invalid id.', async () => {
    // SETUP
    const postId = Number.MAX_SAFE_INTEGER;

    // ACTION UNDER TEST & VERIFY
    PostService.getById(postId).tryCall().then(async (response) => {
        expect(response.status).toBe(404)
        const responseBody = await response.text()
        expect(responseBody).toBe(`Post with id ${postId} does not exist`)
    })
})

test('Can get all posts for a user.', async () => {
    // SETUP
    const userScenario = await new UserScenario().withNumberOfPosts(2).create()
    const userId = userScenario.id

    // ACTION UNDER TEST & VERIFY
    const posts = await PostService.getAllForUser(userId).call()
    expect(posts.length).toEqual(2)
})

test('Can get filtered posts for user.', async () => {
    // SETUP
    const userScenario = await new UserScenario()
        .withPost(new PostScenario().withDefaults().withPostVisibility(PostVisibility.PUBLIC))
        .withPost(new PostScenario().withDefaults().withPostVisibility(PostVisibility.PRIVATE))
        .create()

    const userId = userScenario.id

    // ACTION UNDER TEST
    const posts = await PostService.getAllForUser(userId)
        .withQueryParam('visibility', PostVisibility.PUBLIC.toString())
        .call()

    // VERIFY
    expect(posts.length).toEqual(1)
    expect(posts[0]).toEqualExcludingFields(userScenario.postScenarios[0].getAsPost(), ['dateCreated', 'dateUpdated'])
})

test('Can update a post', async () => {
    // SETUP
    const userScenario = await new UserScenario().withNumberOfPosts(1).create()
    const originalPost = (await DBS.playgroundPostDb.getById(userScenario.postScenarios[0].postId))!
    const updatedPost = cloneDeep(originalPost)
    updatedPost.title = 'Updated title'
    updatedPost.dateCreated = undefined
    updatedPost.dateUpdated = undefined

    // ACTION UNDER TEST
    await PostService.update(userScenario.id, originalPost.id, updatedPost).call()

    // VERIFY
    const savedPost = (await DBS.playgroundPostDb.getById(originalPost.id))!
    expect(savedPost).toEqualExcludingFields(updatedPost, ['dateCreated', 'dateUpdated'])
    expect(savedPost.dateUpdated!.getTime()).toBeGreaterThan(originalPost.dateUpdated!.getTime())
})

test('Can delete a post.', async () => {
    // SETUP
    const userScenario = await new UserScenario().withNumberOfPosts(1).create()
    const post = await DBS.playgroundPostDb.getById(userScenario.postScenarios[0].postId)

    // ACTION UNDER TEST
    await PostService.delete(userScenario.id, post!.id).call()

    // VERIFY
    const deletedPost = await DBS.playgroundPostDb.getById(post!.id)
    expect(deletedPost).toBeNull()
})

test('Cannot delete with an invalid post id.', async () => {
    // SETUP
    const userScenario = await new UserScenario().create();
    const postId = Number.MAX_SAFE_INTEGER;

    // ACTION UNDER TEST & VERIFY
    PostService.delete(userScenario.id, postId).tryCall().then(async (response) => {
        expect(response.status).toBe(404)
        const responseBody = await response.text()
        expect(responseBody).toBe(`Post with id ${postId} does not exist`)
    })
})

test('Cannot delete with an invalid user id.', async () => {
    // SETUP
    const userScenario = await new UserScenario().withNumberOfPosts(1).create()
    const userId = Number.MAX_SAFE_INTEGER
    const postId = userScenario.postScenarios[0].postId

    // ACTION UNDER TEST & VERIFY
    PostService.delete(userId, postId).tryCall().then(async (response) => {
        expect(response.status).toBe(404)
        const responseBody = await response.text()
        expect(responseBody).toBe(`User with id ${userId} does not exist`)
    })
})