import { createLogger, format, transports } from 'winston'
import fs from 'fs'
import path from 'path'

const logDirectory = 'logs'
const logFilename = 'testlog.log'

const archiveLog = () => {
    const logPath = path.join(logDirectory, logFilename);
    const archiveFilename = `testlog-${new Date().toISOString().replace(/:/g, '-')}.log`
    const archivePath = path.join(logDirectory, archiveFilename)

    if (fs.existsSync(logPath)) {
        fs.renameSync(logPath, archivePath);
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
        new transports.File({
            filename: path.join(logDirectory, logFilename)
        })
    ]
})

export { logger, archiveLog }