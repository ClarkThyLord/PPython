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

    let raw_tokens = ppython_source
        .replaceAll("\n", " \n ")
        .replaceAll("\t", " \t ")
        .replaceAll(":", " : ")
        .split(/[ ]+/).filter(n => n);

    cpp_source = JSON.stringify(raw_tokens, null, "\t");

    if (cpp_source === undefined) {
        logErrorMessage("Error: No C++ source code could be produced")
    }

    return {
        result: cpp_source,
        logs: logs
    }
}