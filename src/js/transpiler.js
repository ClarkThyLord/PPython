export default function transpiler(ppython_source) {
    let cpp_source = "";
    let logs = []
    let fail = false;

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
        fail = true;
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
        "ComparisonOperator": {
            "equals": /(?<!.)==(?!.)/,
            "diffrent": /(?<!.)!=(?!.)/,
            "greater": /(?<!.)[>](?!.)/,
            "lesser": /(?<!.)[<](?!.)/,
        },
        "AssignmentOperator": {
            "assignment": /(?<!.)=(?!.)/,
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
        .replaceAll("<", " < ")
        .replaceAll(">", " > ")
        .replaceAll("==", " == ")
        .replaceAll("!=", " != ")
        .replaceAll("=", " = ")
        .replaceAll("=  =", "==")
        .replaceAll("!  =", "!=")
        .replaceAll("*", " * ")
        .replaceAll("+", " + ")
        .replaceAll("-", " - ")
        .replaceAll("/", " / ")
        .split(/[ ]+/).filter(n => n);

    console.log("RAW_TOKENS: ", raw_tokens);

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
            logErrorMessage("NameError: name '" + raw_token + "' is not defined");
    });

    if (lexical_tokens.length > 0)
        lexical_tokens.splice(0, 0, ["Delimiter", "newline", "\n"]);

    console.log("LEXICAL TOKENS: ", lexical_tokens);

    class SyntaxTree {
        constructor() {
            this.is_structure = false;
            this.indentation = 0;
            this.branch_indentation = 0;
            this.nodes = [];
        }

        push(branch) {
            this.nodes.push(branch);
        }
    }

    class Branch {
        constructor() {
            this.lexical_tokens = [];
        }

        push(lexical_token) {
            this.lexical_tokens.push(lexical_token);
        }
    }

    let source_tree = new SyntaxTree();
    let stack = [source_tree];
    for (let lexical_token_index = 0; lexical_token_index < lexical_tokens.length; lexical_token_index++) {
        const lexical_token = lexical_tokens[lexical_token_index];
        const token_group = lexical_token[0];
        const token_name = lexical_token[1];
        const token_raw = lexical_token[2];

        if (token_name == "newline") {
            let indentation = 0;
            while (lexical_tokens[lexical_token_index + indentation + 1][1] == "tab")
                indentation += 1;
            lexical_token_index += indentation;
            if (indentation == stack[stack.length - 1].branch_indentation) {
                if (lexical_token_index + 1 <= lexical_tokens.length &&
                    (lexical_tokens[lexical_token_index + 1][0] == "IterationStructure" ||
                        lexical_tokens[lexical_token_index + 1][0] == "ConditionalStructure")) {
                    let st = new SyntaxTree();
                    st.is_structure = true;
                    st.indentation = indentation;
                    st.branch_indentation = indentation + 1;
                    st.push(new Branch());
                    stack[stack.length - 1].push(st);
                    stack.push(st);
                } else {
                    stack[stack.length - 1].push(new Branch());
                }
            } else if (stack.length > 1 && indentation < stack[stack.length - 1].branch_indentation) {
                stack.pop();
                lexical_token_index -= 1;
            } else {
                logErrorMessage("IndentationError: unexpected indent");
                break;
            }
            continue;
        }

        stack[stack.length - 1].nodes[stack[stack.length - 1].nodes.length - 1].push(lexical_token);
    }

    console.log("SOURCE TREE: ", source_tree);

    function ppython_to_cpp(node) {
        if (node instanceof(SyntaxTree)) {
            for (let index = 0; index < node.nodes.length; index++) {
                if (node.is_structure && !node.nodes[index].is_structure) {
                    cpp_source += "\t".repeat(index == 0 ? node.indentation : node.branch_indentation);
                }
                ppython_to_cpp(node.nodes[index])
            }
            if (node.is_structure) {
                cpp_source += "\t".repeat(node.indentation) + "}\n";
            }
        } else if (node instanceof(Branch)) {
            for (let index = 0; index < node.lexical_tokens.length; index++) {
                switch (node.lexical_tokens[index][1]) {
                    case "hashtag":
                        cpp_source += "//";
                        for (; index < node.lexical_tokens.length - 1;) {
                            index += 1;
                            cpp_source += node.lexical_tokens[index][2];
                        }
                        break;
                    case "while":
                        cpp_source += "while ("
                        while (node.lexical_tokens[index + 1][1] != "colon") {
                            index += 1;
                            cpp_source += (1 < index && index < node.lexical_tokens.length) ? " " : "";
                            ppython_to_cpp(node.lexical_tokens[index]);
                        }
                        cpp_source += ") {"
                        break;
                    case "if":
                        cpp_source += "if ("
                        while (node.lexical_tokens[index + 1][1] != "colon") {
                            index += 1;
                            cpp_source += (1 < index && index < node.lexical_tokens.length) ? " " : "";
                            ppython_to_cpp(node.lexical_tokens[index]);
                        }
                        cpp_source += ") {"
                        break;
                    case "elif":
                        cpp_source += "else if ("
                        while (node.lexical_tokens[index + 1][1] != "colon") {
                            index += 1;
                            cpp_source += (1 < index && index < node.lexical_tokens.length) ? " " : "";
                            ppython_to_cpp(node.lexical_tokens[index]);
                        }
                        cpp_source += ") {"
                        break;
                    case "else":
                        cpp_source += "else {"
                        break;
                    case "break":
                        cpp_source += "break;";
                        break;
                    case "return":
                        cpp_source += "return ";
                        for (; index < node.lexical_tokens.length - 1;) {
                            index += 1;
                            cpp_source += (1 < index && index < node.lexical_tokens.length) ? " " : "";
                            ppython_to_cpp(node.lexical_tokens[index]);
                        }
                        cpp_source += ";"
                        break;
                    case "variable_name":
                        cpp_source += "auto " + node.lexical_tokens[index][2];
                        for (; index < node.lexical_tokens.length - 1;) {
                            index += 1;
                            ppython_to_cpp(node.lexical_tokens[index]);
                        }
                        cpp_source += ";"
                        break;
                }
            }
            cpp_source += "\n";
        } else {
            switch (node[1]) {
                case "and":
                    cpp_source += "&&";
                    break;
                case "or":
                    cpp_source += "||";
                    break;
                case "bool":
                    cpp_source += node[2] == "True" ? 1 : 0;
                    break;
                default:
                    cpp_source += node[2];
                    break;
            }
        }
    }

    ppython_to_cpp(source_tree);

    if (fail) {
        cpp_source = "";
    }
    if (cpp_source.length === 0) {
        cpp_source = "No c++ source code could be produced...";
    }

    return {
        result: cpp_source,
        logs: logs
    }
}