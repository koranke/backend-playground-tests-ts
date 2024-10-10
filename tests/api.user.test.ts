import { faker } from '@faker-js/faker/.'
import { UserService } from '../src/backendPlayground/api/userService'
import { UserScenario } from '../src/backendPlayground/scenarioBuilders/userScenario'
import DBS from '../src/core/db/dbs'

test('Can get a user by id.', async () => {
    // SETUP
    const userScenario = await new UserScenario().create()

    // ACTION UNDER TEST
    const user = await UserService.getById(userScenario.id).call()

    // VERIFY
    const expectedUser = userScenario.getAsUser()
    expect(user).toEqual(expectedUser)
})

test('Cannot get a user by invalid id.', async () => {
    // SETUP
    const invalidId = Number.MAX_SAFE_INTEGER

    // ACTION UNDER TEST
    await UserService.getById(invalidId).tryCall().then(async (response) => {
        // VERIFY
        expect(response.status).toBe(404)
        expect(response.text()).resolves.toBe('User with id ' + invalidId + ' does not exist')
    })
})

test('Can get all users.', async () => {
    // SETUP
    await new UserScenario().create()

    // ACTION UNDER TEST
    const users = await UserService.getAll().call()

    // VERIFY
    expect(users.currentPage).toEqual(0)
    expect(users.numberOfItems).toBeGreaterThan(0)
    expect(users.users.length).toBeGreaterThan(0)
})

test('Can create a user with all fields.', async () => {
    const userScenario = await new UserScenario()
        .withPhone(faker.phone.number())
        .withDateOfBirth(faker.date.birthdate().toISOString().split('T')[0])
        .create()

    // VERIFY
    const savedUser = await UserService.getById(userScenario.id).call()
    expect(savedUser).toEqual(userScenario.getAsUser())
})

const missingRequiredFieldScenarios = [
    {
        scenario: 'Missing first name',
        userScenario: new UserScenario().withDefaults().withFirstName(null),
        expectedErrorMessage: 'User must have a first name'
    },
    {
        scenario: 'Missing last name',
        userScenario: new UserScenario().withDefaults().withLastName(null),
        expectedErrorMessage: 'User must have a last name'
    },
    {
        scenario: 'Missing email',
        userScenario: new UserScenario().withDefaults().withEmail(null),
        expectedErrorMessage: 'User must have an email'
    }
]

missingRequiredFieldScenarios.forEach(({ scenario, userScenario, expectedErrorMessage }) => {
    test(`Should return an error if missing a required field - ${scenario}`, async () => {

        // ACTION UNDER TEST & VERIFY
        await UserService.create(userScenario.getAsUser()).tryCall().then(async (response) => {
            expect(response.status).toBe(400)
            expect(response.text()).resolves.toBe(expectedErrorMessage)
        })
    })
})

test('Should return error if duplicate user.', async () => {
    // SETUP
    const userScenario = await new UserScenario().create()
    const newUser = userScenario.getAsUser()
    newUser.id = null
    newUser.phone ='123-456-7890'

    // ACTION UNDER TEST & VERIFY
    await UserService.create(newUser).tryCall().then(async (response) => {
        expect(response.status).toBe(400)
        expect(response.text()).resolves.toBe('User with same first name, last name and email already exists')
    })
})

test('Cam update a user.', async () => {
    // SETUP
    const userScenario = await new UserScenario().create()
    const userFromScenario = userScenario.getAsUser()
    userFromScenario.email = faker.internet.email()

    // ACTION UNDER TEST
    const updatedUser = await UserService.update(userScenario.id, userFromScenario).call()

    // VERIFY
    expect(updatedUser).toEqual(userFromScenario)
})

test('Cannot update a user to a duplicate of another user.', async () => {
    // SETUP
    const userScenario1 = await new UserScenario().create()
    const userScenario2 = await new UserScenario().create()

    const user1 = userScenario1.getAsUser()

    // ACTION UNDER TEST & VERIFY
    UserService.update(userScenario2.id, user1).tryCall().then(async (response) => {
        expect(response.status).toBe(400)
        expect(response.text()).resolves.toBe('User with same first name, last name and email already exists')
    })
})

test('Can delete a user.', async () => {
    // SETUP
    const userScenario = await new UserScenario().create()

    // ACTION UNDER TEST
    await UserService.delete(userScenario.id).call()

    // VERIFY
    const deletedUser = await DBS.playgroundUserDb.getById(userScenario.id)
    expect(deletedUser).toBeNull()
})

test('Cannot delete a user with posts.', async () => {
    // SETUP
    const userScenario = await new UserScenario().withNumberOfPosts(1).create()

    // ACTION UNDER TEST
    UserService.delete(userScenario.id).tryCall().then(async (response) => {
        // VERIFY
        expect(response.status).toBe(400)
        expect(response.text()).resolves.toBe(`User with id ${userScenario.id} has posts and cannot be deleted`)
    })
})