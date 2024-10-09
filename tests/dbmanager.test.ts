import DBS from "../src/core/db/dbs"
import { User } from "../src/backendPlayground/entities/userEntity"
import { And, IsNull, LessThan, Not } from "typeorm"

test('should fetch users', async () => {
    const users = await DBS.playgroundDb.executeQuery('SELECT * FROM user')
    console.log('Users:', users)
    expect(users).toBeDefined()
})

test('should do find all', async () => {
    const users = await DBS.playgroundDb.findAll(User)
    console.log('Users:', users)
    expect(users).toBeDefined()
})

test('should do find one', async () => {
    const users = await DBS.playgroundDb.findOne(User, 1)
    console.log('Users:', users)
    expect(users).toBeDefined()
})

test('should be able to do custom find', async () => {
    const manager = await DBS.playgroundDb.getManager()

    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 30);
    const users = await manager.find(User, { 
        where: { 
            dateOfBirth: And(
                LessThan(tenYearsAgo.toISOString()), 
                Not(IsNull()),
                Not('')
            )
        } 
    })
    console.log('Users:', users)
    expect(users).toBeDefined()
})

test('should be able to do custom find', async () => {
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    const tenYearsAgoString = tenYearsAgo.toISOString();

    const query = `
        SELECT * FROM user
        WHERE dateOfBirth < ${tenYearsAgoString}
        AND dateOfBirth IS NOT NULL
        AND dateOfBirth != ''
    `;
    const users = await DBS.playgroundDb.executeQuery(query);
    console.log('Users:', users);
    expect(users).toBeDefined();
});
