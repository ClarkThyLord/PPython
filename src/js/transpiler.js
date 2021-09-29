export default function transpiler(ppython_source) {
    let cpp_source = undefined;
    let logs = []
    const logMessage = (message) => {
        logs.push({
            message: message
        })
    }
    const logErrorMessage = (message) => {
        logs.push({
            isError: true,
            message: message
        })
    }
    const logWarningMessage = (message) => {
        logs.push({
            isWarning: true,
            message: message
        })
    }

    // TODO transpiler logic

    return {
        result: cpp_source,
        logs: logs
    }
}