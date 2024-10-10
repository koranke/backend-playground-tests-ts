import { User } from "../entities/userEntity";
import PlaygroundDb from "./playgroundDb";

export default class UserDb extends PlaygroundDb {
    public async getById(id: number) {
        const manager = await this.getManager();
        return await manager.findOne(User, { where: { id } });
    }

}