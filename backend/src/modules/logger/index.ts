import * as config from 'config';
import * as colors from 'colors';

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
            if (log.format === "beautify") {
                console.error(
                    `${colors.red(`[ERROR][${msg.module}]`)} ${colors.white(msg.message)}`
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
