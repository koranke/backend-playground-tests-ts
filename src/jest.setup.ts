import { createLogger, format, transports } from "winston"
import DBS from "./core/db/dbs"
import { archiveLog, logger } from "./core/utilities/logging"
import path from "path"
import { Worker, isMainThread, workerData } from "worker_threads"
import { ar } from "@faker-js/faker/."

beforeEach(() => {
    const testName = expect.getState().currentTestName
    logger.info('')
    logger.info(`STARTING TEST: ${testName}`)
})

afterEach(() => {
    const testName = expect.getState().currentTestName
    logger.info(`FINISHED TEST: ${testName}`)
    logger.info('')
})

afterAll(async () => {
    logger.info('Closing DB connections')
    await DBS.playgroundDb.close()
})

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})