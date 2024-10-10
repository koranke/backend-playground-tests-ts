import DBS from "./core/db/dbs"
import { logger } from "./core/utilities/logging"

beforeEach(() => {
    const testName = expect.getState().currentTestName
    logger.info(`Starting test: ${testName}`)
})

afterEach(() => {
    const testName = expect.getState().currentTestName
    logger.info(`Finished test: ${testName}`)
})

afterAll(async () => {
    logger.info('Closing DB connections')
    await DBS.playgroundDb.close()
})

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})