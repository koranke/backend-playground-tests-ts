import PlaygroundDb from '../../backendPlayground/db/playgroundDb'
import PostDb from '../../backendPlayground/db/playgroundPostDb'
import UserDb from '../../backendPlayground/db/playgroundUserDb'

class DBS {
    private static _playgroundDb: PlaygroundDb
    private static _playgroundPostDb: PostDb
    private static _playgroundUserDb: UserDb

    public static get playgroundDb(): PlaygroundDb {
        if (!this._playgroundDb) {
            this._playgroundDb = new PlaygroundDb()
        }
        return this._playgroundDb
    }

    public static get playgroundPostDb(): PostDb {
        if (!this._playgroundPostDb) {
            this._playgroundPostDb = new PostDb()
        }
        return this._playgroundPostDb
    }

    public static get playgroundUserDb(): UserDb {
        if (!this._playgroundUserDb) {
            this._playgroundUserDb = new UserDb()
        }
        return this._playgroundUserDb
    }
}

export default DBS