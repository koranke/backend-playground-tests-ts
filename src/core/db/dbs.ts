import PlaygroundDb from './playgroundDb';

class DBS {
    private static _playgroundDb: PlaygroundDb;

    public static get playgroundDb(): PlaygroundDb {
        if (!this._playgroundDb) {
            this._playgroundDb = new PlaygroundDb();
        }
        return this._playgroundDb;
    }
}

export default DBS;