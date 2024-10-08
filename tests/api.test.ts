import { UserService } from '../src/backendPlayground/api/userService';

test('should fetch user by id', async () => {
    const user = await UserService.getById('1').call();
    console.log('User:', user);
});