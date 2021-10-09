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
            "variable_name": /(?<!.)([^d][a-zA-Z]*)(?!.)/,
        },
        "keyword": {
            "and": /(?<!.)(and)(?!.)/,
            "or": /(?<!.)(or)(?!.)/,
            "if": /(?<!.)(if)(?!.)/,
            "elif": /(?<!.)(elif)(?!.)/,
            "else": /(?<!.)(else)(?!.)/,
            "while": /(?<!.)(while)(?!.)/,
            "break": /(?<!.)(break)(?!.)/,
            "return": /(?<!.)(return)(?!.)/,
        },
        "separator": {
            "parenthesis_left": /(?<!.)([(])(?!.)/,
            "parenthesis_right": /(?<!.)([)])(?!.)/,
            "colon": /(?<!.)(:)(?!.)/,
        },
        "operator": {
            "addition": /(?<!.)[+](?!.)/,
            "subtraction": /(?<!.)[-](?!.)/,
            "multiplication": /(?<!.)[*](?!.)/,
            "division": /(?<!.)[/](?!.)/,
            "assignment": /(?<!.)(=)(?!.)/,
            "equals": /(?<!.)(==)(?!.)/,
            "diffrent": /(?<!.)(!=)(?!.)/,
            "greater": /(?<!.)[>](?!.)/,
            "greater_equal": /(?<!.)(>=)(?!.)/,
            "lesser": /(?<!.)[<](?!.)/,
            "lesser_equal": /(?<!.)(<=)(?!.)/,
        },
        "literal": {
            "bool": /(?<!.)(True|False)(?!.)/,
            "string": /(?<!.)(".*")(?!.)/,
            "integer": /(?<!.)[0-9]+(?!.)/,
        },
        "comment": {
            "line": /(\s(#[a-zA-Z0-9]*))/,
        },
    };

    let state = 0;
    let token_lex;

    console.log(raw_tokens)

    for (let i = 0; i < raw_tokens.length; i++) {
        const raw_token = raw_tokens[i];
        switch (state) {
            case 0:
                for (const token_name in TokenExpressions["keyword"]) {
                    const token_expression = TokenExpressions["keyword"][token_name];
                    console.log(raw_token.match(token_expression))
                }
                break;
        }

    }

    cpp_source = JSON.stringify(raw_tokens, null, "\t");

    if (cpp_source === undefined) {
        logErrorMessage("Error: No C++ source code could be produced")
    }

    return {
        result: cpp_source,
        logs: logs
    }
}