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

    //Logger to check what the word means
    var TokenExpressions = {
        "identifier": {
            "variable_name": /(?<!.)[^d][a-zA-Z]*(?!.)/,
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

    let tokens = [];

    let state = 0;
    let token_lex;

    for (let i = 0; i < raw_tokens.length; i++) {
        const raw_token = raw_tokens[i];
        console.log(raw_token);

        for (let state = 0; state < Object.keys(TokenExpressions).length; state++) {
            if (state == -1)
                break;
            console.log(state);
            switch (state) {
                case 0:
                    for (const token_name in TokenExpressions["keyword"]) {
                        const token_expression = TokenExpressions["keyword"][token_name];
                        let match = raw_token.match(token_expression);
                        console.log(match);
                        if (match !== null && match.length == 1) {
                            tokens.push(["keyword", raw_token])
                            state = -1;
                            break;
                        }
                    }
                    break;
                case 1:
                    for (const token_name in TokenExpressions["operator"]) {
                        const token_expression = TokenExpressions["operator"][token_name];
                        let match = raw_token.match(token_expression);
                        if (match !== null && match.length == 1) {
                            tokens.push(["operator", raw_token]);
                            state = -1;
                            break;
                        }
                    }
                    break;
                case 2:
                    for (const token_name in TokenExpressions["seperator"]) {
                        const token_expression = TokenExpressions["seperator"][token_name];
                        let match = raw_token.match(token_expression);
                        if (match !== null && match.length == 1) {
                            tokens.push(["seperator", raw_token])
                            state = -1;
                            break;
                        }
                    }
                    break;
                case 3:
                    for (const token_name in TokenExpressions["literal"]) {
                        const token_expression = TokenExpressions["literal"][token_name];
                        let match = raw_token.match(token_expression);
                        if (match !== null && match.length == 1) {
                            tokens.push(["literal", raw_token]);
                            state = -1;
                            break;
                        }
                    }
                    break;
                case 4:
                    for (const token_name in TokenExpressions["comment"]) {
                        const token_expression = TokenExpressions["comment"][token_name];
                        let match = raw_token.match(token_expression);
                        if (match !== null && match.length == 1) {
                            tokens.push(["comment", raw_token]);
                            state = -1;
                            break;
                        }
                    }
                    break;
                case 5:
                    for (const token_name in TokenExpressions["identifier"]) {
                        const token_expression = TokenExpressions["identifier"][token_name];
                        let match = raw_token.match(token_expression);
                        if (match !== null && match.length == 1) {
                            tokens.push(["identifier", raw_token]);
                            state = -1;
                            break;
                        }
                    }
                    break;
                case -1:
                    break;
                default:
                    logErrorMessage("Error: Syntax error `" + raw_token + "`")
            }
        }
    }

    cpp_source = JSON.stringify(tokens, null, "\t");

    if (cpp_source === undefined) {
        logErrorMessage("Error: No C++ source code could be produced")
    }

    return {
        result: cpp_source,
        logs: logs
    }
}