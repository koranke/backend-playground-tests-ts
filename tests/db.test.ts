import DBS from '../src/core/db/dbs';

test('should fetch users', async () => {
    const users = await DBS.playgroundDb.executeQuery('SELECT * FROM user');
    console.log('Users:', users);
    expect(users).toBeDefined();
});

test('should fetch first user', async () => {
    const users = await DBS.playgroundDb.executeQuery('SELECT * FROM user where id = 1');
    console.log('Users:', users);
    expect(users).toBeDefined();
});
