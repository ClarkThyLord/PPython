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
        "EstructuraDeIteracion": {
            "while": /(?<!.)while(?!.)/,
        },
        "OperadorLogico": {
            "and": /(?<!.)and(?!.)/,
            "or": /(?<!.)or(?!.)/,
        },
        "EstructuraCondicional": {
            "if": /(?<!.)if(?!.)/,
            "elif": /(?<!.)elif(?!.)/,
            "else": /(?<!.)else(?!.)/,
        },
        "FuncionAuxilliar": {
            "break": /(?<!.)break(?!.)/,
            "return": /(?<!.)return(?!.)/,
        },
        "DelimitadorEmparejado": {
            "parenthesis_left": /(?<!.)[(](?!.)/,
            "parenthesis_right": /(?<!.)[)](?!.)/,
        },
        "Delimitador": {
            "single quotes": /(?<!.)'(?!.)/,
            "double quotes": /(?<!.)"(?!.)/,
            "colon": /(?<!.):(?!.)/,
            "line_comment": /#/,
            "newline": /(?<!.)\n(?!.)/,
            "tab": /(?<!.)\t(?!.)/,
        },
        "OperadorDeAsignacion": {
            "assignment": /(?<!.)=(?!.)/,
        },
        "OperadorDeComparacion": {
            "equals": /(?<!.)==(?!.)/,
            "diffrent": /(?<!.)!=(?!.)/,
            "greater": /(?<!.)[>](?!.)/,
            "lesser": /(?<!.)[<](?!.)/,
        },
        "OperadorAritmetico": {
            "addition": /(?<!.)[+](?!.)/,
            "subtraction": /(?<!.)[-](?!.)/,
            "multiplication": /(?<!.)[*](?!.)/,
            "division": /(?<!.)[/](?!.)/,
        },
        "Literal": {
            "bool": /(?<!.)True|False(?!.)/,
            "string": /(?<!.)".*"(?!.)/,
            "integer": /(?<!.)[0-9]+(?!.)/,
        },
        "Identificador": {
            "variable_name": /(?<!.)[^0-9]\w*(?!.)/,
        },
        "Comentario": {
            "comment": /.*/,
        },
    };

    let raw_tokens = ppython_source
        .replaceAll("'", " ' ")
        .replaceAll('"', ' " ')
        .replaceAll(":", " : ")
        .replaceAll("#", " # ")
        .replaceAll("\n", " \n ")
        .replaceAll("\t", " \t ")
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