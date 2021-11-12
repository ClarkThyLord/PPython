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
        "Delimiter": {
            "quote": /(?<!.)['"](?!.)/,
            "colon": /(?<!.)[:](?!.)/,
            "hashtag": /(?<!.)[#](?!.)/,
            "newline": /(?<!.)\n(?!.)/,
            "tab": /(?<!.)\t(?!.)/,
        },
        "IterationStructure": {
            "while": /(?<!.)while(?!.)/,
        },
        "LogicalOperator": {
            "and": /(?<!.)and(?!.)/,
            "or": /(?<!.)or(?!.)/,
        },
        "ConditionalStructure": {
            "if": /(?<!.)if(?!.)/,
            "elif": /(?<!.)elif(?!.)/,
            "else": /(?<!.)else(?!.)/,
        },
        "FunctionAuxiliary": {
            "break": /(?<!.)break(?!.)/,
            "return": /(?<!.)return(?!.)/,
        },
        "AssignmentOperator": {
            "assignment": /(?<!.)=(?!.)/,
        },
        "ComparisonOperator": {
            "equals": /(?<!.)==(?!.)/,
            "diffrent": /(?<!.)!=(?!.)/,
            "greater": /(?<!.)[>](?!.)/,
            "lesser": /(?<!.)[<](?!.)/,
        },
        "ArithmeticOperator": {
            "addition": /(?<!.)[+](?!.)/,
            "subtraction": /(?<!.)[-](?!.)/,
            "multiplication": /(?<!.)[*](?!.)/,
            "division": /(?<!.)[/](?!.)/,
            "parenthesis_left": /(?<!.)[(](?!.)/,
            "parenthesis_right": /(?<!.)[)](?!.)/,
        },
        "Literal": {
            "bool": /(?<!.)True|False(?!.)/,
            "integer": /(?<!.)[0-9]+(?!.)/,
        },
        "Identifier": {
            "variable_name": /(?<!.)[^0-9]\w*(?!.)/,
        }
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

    let flag_comment = false;
    let flag_string = false;

    raw_tokens.forEach(raw_token => {
        let match = null;
        Object.keys(TokenExpressions).some(token_group => {
            Object.keys(TokenExpressions[token_group]).some(token_name => {
                const token_expression = TokenExpressions[token_group][token_name];

                match = raw_token.match(token_expression);
                if (match !== null && match.length == 1) {
                    if (token_name == "quote") {
                        match = [raw_token];
                        flag_string = !flag_string;
                        lexical_tokens.push([token_group, token_name, raw_token]);
                        return true;
                    }
                    if (token_name == "hashtag") {
                        match = [raw_token];
                        flag_comment = true;
                        lexical_tokens.push([token_group, token_name, raw_token]);
                        return true;
                    }
                    if (token_name == "newline" && flag_comment) {
                        match = [raw_token];
                        flag_comment = false;
                        lexical_tokens.push([token_group, token_name, raw_token]);
                        return true;
                    }
                }

                if (flag_string) {
                    match = [raw_token]
                    lexical_tokens.push(["Literal", "string", raw_token]);
                    return true;
                } else if (flag_comment) {
                    match = [raw_token]
                    lexical_tokens.push(["Comentario", "comment", raw_token]);
                    return true;
                }

                if (match !== null && match.length == 1) {
                    lexical_tokens.push([token_group, token_name, raw_token]);
                    return true;
                }
            });
            if (match)
                return true;
        });
        if (!match)
            logErrorMessage("Error: Syntax error `", raw_token, "`");
    });

    cpp_source = JSON.stringify(lexical_tokens, null, "\t");

    class SyntaxTree {
        constructor() {
            this.lexical_tokens = [];
            this.syntax_trees = [];
        }
    }

    let syntax_tree = [
        new SyntaxTree()
    ];
    let sub_syntax_tree;

    lexical_tokens.forEach((lexical_token, index) => {
        const token_group = lexical_token[0];
        const token_name = lexical_token[1];
        const raw_token = lexical_token[2];

        if (token_group === "Delimiter") {
            if (token_name === "newline") {
                if (lexical_tokens[index + 1][1] == "tab") {
                    sub_syntax_tree = new SyntaxTree();
                    syntax_tree[syntax_tree.length - 1].syntax_trees.push(sub_syntax_tree);
                } else {
                    syntax_tree.push(new SyntaxTree());
                    sub_syntax_tree = undefined;
                }
                return;
            } else if (token_name === "tab") {
                return;
            }
        }

        if (sub_syntax_tree === undefined) {
            syntax_tree[syntax_tree.length - 1].lexical_tokens.push(lexical_token);
        } else {
            sub_syntax_tree.lexical_tokens.push(lexical_token);
        }
    });

    if (cpp_source === undefined) {
        logErrorMessage("Error: No C++ source code could be produced")
    }

    console.log(JSON.stringify(syntax_tree, null, "\t"));

    return {
        result: cpp_source,
        logs: logs
    }
}