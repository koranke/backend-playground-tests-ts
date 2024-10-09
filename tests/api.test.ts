import { faker } from '@faker-js/faker/.';
import { UserService } from '../src/backendPlayground/api/userService';
import { UserScenario } from '../src/backendPlayground/scenarioBuilders/userScenario';
import DBS from '../src/core/db/dbs';

test('should fetch user by id', async () => {
    // SETUP
    const userScenario = await new UserScenario().create();

    // ACTION UNDER TEST
    const user = await UserService.getById(userScenario.id.toString()).call();

    // VERIFY
    const expectedUser = userScenario.getAsUser();
    expect(user).toEqual(expectedUser);
});

test('should fail to fetch user by invalid id', async () => {
    // SETUP
    const invalidId = Number.MAX_SAFE_INTEGER.toString()

    // ACTION UNDER TEST
    await UserService.getById(invalidId).tryCall().then(async (response) => {
        // VERIFY
        expect(response.status).toBe(404)
        expect(response.text()).resolves.toBe('User with id ' + invalidId + ' does not exist')
    })
})

test('should get all users', async () => {
    // SETUP
    await new UserScenario().create()

    // ACTION UNDER TEST
    const users = await UserService.getAll().call()

    // VERIFY
    expect(users.currentPage).toEqual(0)
    expect(users.numberOfItems).toBeGreaterThan(0)
    expect(users.users.length).toBeGreaterThan(0)
})

test('should create user with all fields', async () => {
    const userScenario = await new UserScenario()
        .withPhone(faker.phone.number())
        .withDateOfBirth(faker.date.birthdate().toISOString().split('T')[0])
        .create()

    // VERIFY
    const savedUser = await UserService.getById(userScenario.id.toString()).call()
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
    test(`should return an error if missing a required field - ${scenario}`, async () => {

        // ACTION UNDER TEST & VERIFY
        await UserService.create(userScenario.getAsUser()).tryCall().then(async (response) => {
            expect(response.status).toBe(400)
            expect(response.text()).resolves.toBe(expectedErrorMessage)
        })
    })
})

test('should return error if duplicate user', async () => {
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

test('should be able to update user', async () => {
    // SETUP
    const userScenario = await new UserScenario().create()
    const userFromScenario = userScenario.getAsUser()
    userFromScenario.email = faker.internet.email()

    // ACTION UNDER TEST
    const updatedUser = await UserService.update(userScenario.id.toString(), userFromScenario).call()

    // VERIFY
    expect(updatedUser).toEqual(userFromScenario)
})

test('testUpdateUserToDuplicate', async () => {
    // SETUP
    const userScenario1 = await new UserScenario().create()
    const userScenario2 = await new UserScenario().create()

    const user1 = userScenario1.getAsUser()

    // ACTION UNDER TEST & VERIFY
    UserService.update(userScenario2.id.toString(), user1).tryCall().then(async (response) => {
        expect(response.status).toBe(400)
        expect(response.text()).resolves.toBe('User with same first name, last name and email already exists')
    })
})

test('should be able to delete a user', async () => {
    // SETUP
    const userScenario = await new UserScenario().create();

    // ACTION UNDER TEST
    await UserService.delete(userScenario.id.toString()).call();

    // VERIFY
    const deletedUser = await DBS.playgroundDb.getUserById(userScenario.id);
    expect(deletedUser).toBeNull();
})

// it('testDeleteUserWithPosts', async () => {
//     // SETUP
//     const userScenario = new UserScenario().withNumberOfPosts(1).create();

//     // ACTION UNDER TEST
//     try {
//         await UserService.delete(userScenario.getId()).call();
//     } catch (error) {
//         expect(error.response.status).to.equal(400);
//         expect(error.response.data).to.equal(`User with id ${userScenario.getId()} has posts and cannot be deleted`);
//     }
// })