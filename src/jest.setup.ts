import DBS from "./core/db/dbs"
import { logger, rotateLogs } from "./core/utilities/logging"

// beforeAll(() => {
//     rotateLogs()
// })

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