import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import fs from 'fs'
import path from 'path'

const logDirectory = 'logs'
const logFilename = 'testlog.log'
const archiveFilename = `testlog-${new Date().toISOString().split('T')[0]}.log`

const rotateLogs = () => {
    const logPath = path.join(logDirectory, logFilename)
    const archivePath = path.join(logDirectory, archiveFilename)

    if (fs.existsSync(logPath)) {
        fs.renameSync(logPath, archivePath)
    }
}

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.simple()
    ),
    transports: [
        new transports.Console(),
        new DailyRotateFile({
            filename: path.join(logDirectory, logFilename),
            datePattern: 'YYYY-MM-DDTHH-mm-ss',
            zippedArchive: false,
            maxFiles: '3d'
        })
    ]
})

export { logger, rotateLogs }