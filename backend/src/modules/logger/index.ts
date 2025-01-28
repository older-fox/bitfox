import config from 'config';
import colors from 'colors';

interface LogInfo {
    level: "debug" | "info" | "warn" | "error";
    format: "beautify" | "json";
}

interface LogMsg {
    message: string;
    module: string;
    data?: any;
}

const log: LogInfo = config.get('log');

let logLevel:number = 0
switch (log.level) {
    case 'debug':
        logLevel = 0
        break
    case 'info':
        logLevel = 1
        break
    case 'warn':
        logLevel = 2
        break
    case 'error':
        logLevel = 3
        break
    default:
        logLevel = 1
        break
}
// 定义 logger 对象
const logger = {
    debug: (msg: LogMsg) => logMessage("debug", msg),
    info: (msg: LogMsg) => logMessage("info", msg),
    warn: (msg: LogMsg) => logMessage("warn", msg),
    error: (msg: LogMsg) => logMessage("error", msg),
};

// 内部通用的日志处理函数
async function logMessage(level: LogInfo["level"], msg: LogMsg) {
    switch (level) {
        case "debug":
            if (logLevel > 0){
                break
            }
            if (log.format === "beautify") {
                console.debug(
                    `${colors.green(`[DEBUG][${msg.module}]`)} ${colors.white(msg.message)}`
                );
            } else if (log.format === "json") {
                console.debug({
                    level: "debug",
                    message: msg.message,
                    module: msg.module,
                    data: msg.data,
                });
            }
            break;

        case "info":
            if (logLevel > 1){
                break
            }
            if (log.format === "beautify") {
                console.info(
                    `${colors.blue(`[INFO][${msg.module}]`)} ${colors.white(msg.message)}`
                );
            } else if (log.format === "json") {
                console.info({
                    level: "info",
                    message: msg.message,
                    module: msg.module,
                    data: msg.data,
                });
            }
            break;

        case "warn":
            if (logLevel > 2){
                break
            }
            if (log.format === "beautify") {
                console.warn(
                    `${colors.yellow(`[WARN][${msg.module}]`)} ${colors.white(msg.message)}`
                );
            } else if (log.format === "json") {
                console.warn({
                    level: "warn",
                    message: msg.message,
                    module: msg.module,
                    data: msg.data,
                });
            }
            break;

        case "error":
            if (logLevel > 3){
                break
            }
            if (log.format === "beautify") {
                console.error(
                    `${colors.red(`[ERROR][${msg.module}]`)} ${colors.white(msg.message)}\r\n${msg.data}`
                );
            } else if (log.format === "json") {
                console.error({
                    level: "error",
                    message: msg.message,
                    module: msg.module,
                    data: msg.data,
                });
            }
            break;
    }
}

export default logger;
