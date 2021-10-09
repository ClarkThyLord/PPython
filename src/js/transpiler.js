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

    const TokenExpressions = {
        "identifier": {
            "variable_name": /(?<!.)[^0-9]\w*(?!.)/,
        },
        "keyword": {
            "and": /(?<!.)and(?!.)/,
            "or": /(?<!.)or(?!.)/,
            "if": /(?<!.)if(?!.)/,
            "elif": /(?<!.)elif(?!.)/,
            "else": /(?<!.)else(?!.)/,
            "while": /(?<!.)while(?!.)/,
            "break": /(?<!.)break(?!.)/,
            "return": /(?<!.)return(?!.)/,
        },
        "separator": {
            "parenthesis_left": /(?<!.)[(](?!.)/,
            "parenthesis_right": /(?<!.)[)](?!.)/,
            "colon": /(?<!.):(?!.)/,
        },
        "operator": {
            "addition": /(?<!.)[+](?!.)/,
            "subtraction": /(?<!.)[-](?!.)/,
            "multiplication": /(?<!.)[*](?!.)/,
            "division": /(?<!.)[/](?!.)/,
            "assignment": /(?<!.)=(?!.)/,
            "equals": /(?<!.)==(?!.)/,
            "diffrent": /(?<!.)!=(?!.)/,
            "greater": /(?<!.)[>](?!.)/,
            "lesser": /(?<!.)[<](?!.)/,
        },
        "literal": {
            "bool": /(?<!.)True|False(?!.)/,
            "string": /(?<!.)".*"(?!.)/,
            "integer": /(?<!.)[0-9]+(?!.)/,
        },
        "comment": {
            "line": /#.*/,
        },
    };

    let raw_tokens = ppython_source
        .replaceAll("\n", " \n ")
        .replaceAll("\t", " \t ")
        .replaceAll(":", " : ")
        .replaceAll("(", " ( ")
        .replaceAll(")", " ) ")
        .replaceAll("=", " = ")
        .replaceAll("<", " < ")
        .replaceAll(">", " > ")
        .replaceAll("==", " == ")
        .replaceAll("!=", " != ")
        .replaceAll("*", " * ")
        .replaceAll("+", " + ")
        .replaceAll("-", " - ")
        .replaceAll("/", " / ")
        .split(/[ ]+/).filter(n => n);

    console.log(JSON.stringify(raw_tokens));

    let lexical_tokens = [];

    raw_tokens.forEach(raw_token => {
        let match = undefined;
        Object.keys(TokenExpressions).some(token_name => {
            Object.values(TokenExpressions[token_name]).some(token_expression => {
                match = raw_token.match(token_expression);
                if (match !== null && match.length == 1) {
                    lexical_tokens.push([token_name, raw_token]);
                    return true;
                }
            });
            if (match)
                return true;
        });
        if (!match)
            logErrorMessage("Error: Syntax error");
    });

    cpp_source = JSON.stringify(lexical_tokens, null, "\t");

    if (cpp_source === undefined) {
        logErrorMessage("Error: No C++ source code could be produced")
    }

    return {
        result: cpp_source,
        logs: logs
    }
}