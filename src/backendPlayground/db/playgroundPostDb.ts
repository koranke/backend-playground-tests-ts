import { Post } from "../entities/postEntity";
import PlaygroundDb from "./playgroundDb";

export default class PostDb extends PlaygroundDb {
    public async getById(id: number) {
        const manager = await this.getManager();
        return await manager.findOne(Post, { where: { id } });
    }

    public async create(post: Post) {
        const manager = await this.getManager();
        return await manager.save(Post, post);
    }

    public async update(post: Post) {
        const manager = await this.getManager();
        return await manager.save(Post, post);
    }

    public async delete(id: number) {
        const manager = await this.getManager();
        return await manager.delete(Post, { id });
    }

    public async getByUserId(userId: number) {
        const manager = await this.getManager();
        return await manager.find(Post, { where: { userId } });
    }
}