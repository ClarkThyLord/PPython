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
        .replaceAll("*", " * ")
        .replaceAll("+", " + ")
        .replaceAll("-", " - ")
        .replaceAll("/", " / ")
        .split(/[ ]+/).filter(n => n);

    console.log("RAW_TOKENS: ", raw_tokens);
    // console.log(JSON.stringify(raw_tokens));

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

    if (lexical_tokens.length > 0)
        lexical_tokens.splice(0, 0, ["Delimiter", "newline", "\n"]);

    console.log("LEXICAL TOKENS: ", lexical_tokens);

    class LexicalLine {
        constructor() {
            this.indentation = 0;
            this.indentation_req = 0;
            this.lexical_tokens = [];
        }
    }

    let lexical_lines = [
        new LexicalLine()
    ];
    for (let lexical_token_index = 0; lexical_token_index < lexical_tokens.length; lexical_token_index++) {
        const lexical_token = lexical_tokens[lexical_token_index];
        const token_group = lexical_token[0];
        const token_name = lexical_token[1];
        const token_raw = lexical_token[2];
        const lexical_token_line = lexical_lines[lexical_lines.length - 1];
        if (token_name == "newline") {
            lexical_lines.push(new LexicalLine());
        } else if (token_name == "tab") {
            lexical_token_line.indentation += 1;
        } else {
            if (token_group == "IterationStructure" || token_group == "ConditionalStructure") {
                lexical_token_line.indentation_req = lexical_token_line.indentation + 1;
            }
            lexical_token_line.lexical_tokens.push(lexical_token);
        }
    }

    console.log("LEXICAL LINES: ", lexical_lines);

    class SyntaxTree {
        constructor() {
            this.indentation = 0;
            this.indentation_req = 0;
            this.branches = [];
        }
    }

    let source_tree = new SyntaxTree();

    let stack = [
        source_tree,
    ];
    for (let lexical_line_index = 0; lexical_line_index < lexical_lines.length; lexical_line_index++) {
        const lexical_line = lexical_lines[lexical_line_index];

        if (lexical_line.indentation_req != stack[stack.length - 1].indentation_req) {
            let st = new SyntaxTree();
            st.indentation = lexical_line.indentation;
            st.indentation_req = lexical_line.indentation_req;
            st.branches.push(lexical_line)
            stack[stack.length - 1].branches.push(st);
            stack.push(st);
        } else if (lexical_line.indentation == stack[stack.length - 1].indentation_req) {
            stack[stack.length - 1].branches.push(lexical_line);
        } else {
            stack.pop();
            lexical_line_index -= 1;
        }
    }

    console.log("SOURCE TREE: ", source_tree);
    // console.log(JSON.stringify(source_tree, null, "\t"));

    // let source_tree = [
    //     [],
    // ];

    // cpp_source = JSON.stringify(lexical_tokens, null, "\t");

    // class SyntaxTree {
    //     constructor(indentation = 0) {
    //         this.lexical_tokens = [];

    //         this.indentation = indentation;
    //         this.indentation_req = indentation;

    //         this.syntax_trees = [];
    //         this.parent_syntax_tree = undefined;
    //     }
    // }


    // let syntax_tree = new SyntaxTree();
    // let source_tree = [syntax_tree];

    // for (let lexical_token_index = 0; lexical_token_index < lexical_tokens.length; lexical_token_index++) {
    //     const lexical_token = lexical_tokens[lexical_token_index];
    //     const token_group = lexical_token[0];
    //     const token_name = lexical_token[1];
    //     const token_raw = lexical_token[2];

    //     if (token_name == "newline") {
    //         let indentation = 0;
    //         while (lexical_token_index + indentation + 1 < lexical_tokens.length &&
    //             lexical_tokens[lexical_token_index + indentation + 1][1] == "tab")
    //             indentation += 1;

    //         if (indentation == 0) {
    //             syntax_tree = new SyntaxTree(indentation);
    //             source_tree.push(syntax_tree);
    //         } else if (indentation == syntax_tree.indentation_req) {
    //             if (syntax_tree.indentation == syntax_tree.indentation_req) {
    //                 let _syntax_tree = new SyntaxTree(indentation);
    //                 syntax_tree.syntax_trees.push(_syntax_tree);
    //                 syntax_tree = _syntax_tree;
    //             } else {
    //                 let _syntax_tree = new SyntaxTree(indentation);
    //                 syntax_tree.syntax_trees.push(_syntax_tree);
    //                 syntax_tree = _syntax_tree;
    //             }
    //         } else {
    //             logErrorMessage("IndentationError: unexpected indent");
    //             break;
    //         }
    //         continue;
    //     } else if (token_group == "IterationStructure" || token_group == "LogicalOperator") {
    //         syntax_tree.indentation_req = syntax_tree.indentation + 1;
    //     }

    //     syntax_tree.lexical_tokens.push(lexical_token);
    // }

    // lexical_tokens.forEach((lexical_token, index) => {
    //     const token_group = lexical_token[0];
    //     const token_name = lexical_token[1];
    //     const raw_token = lexical_token[2];

    //     if (token_group === "Delimiter") {
    //         if (token_name === "newline") {
    //             source_tree.push(new SyntaxTree());
    //             sub_syntax_tree = undefined;
    //             // if (lexical_tokens[index + 1][1] == "tab") {
    //             //     sub_syntax_tree = new SyntaxTree();
    //             //     source_tree[source_tree.length - 1].syntax_trees.push(sub_syntax_tree);
    //             // } else {
    //             //     source_tree.push(new SyntaxTree());
    //             //     sub_syntax_tree = undefined;
    //             // }
    //             return;
    //         } else if (token_name === "tab") {
    //             tab_count -= 1;
    //             return;
    //         }
    //     } else if (token_group == "IterationStructure" || token_group == "ConditionalStructure") {
    //         source_tree[source_tree.length - 1].indentation += 1;
    //     }

    //     if (sub_syntax_tree === undefined) {
    //         source_tree[source_tree.length - 1].lexical_tokens.push(lexical_token);
    //     } else {
    //         sub_syntax_tree.lexical_tokens.push(lexical_token);
    //     }
    // // });

    // console.log(JSON.stringify(source_tree, null, "\t"));

    // cpp_source = "";

    // function ppython_to_cpp(lexical_token) {
    //     switch (lexical_token[1]) {
    //         case "and":
    //             return "&&";
    //         case "or":
    //             return "||";
    //         case "bool":
    //             return lexical_token[2] == "True" ? 1 : 0;

    //         default:
    //             return lexical_token[2];
    //     }
    // }

    // let level = 0;
    // let scope = 0;
    // for (let index = 0; index < lexical_tokens.length; index++) {
    //     const token_group = lexical_tokens[index][0];
    //     const token_name = lexical_tokens[index][1];
    //     const raw_token = lexical_tokens[index][2];

    //     switch (token_name) {
    //         case "while":
    //             cpp_source += "while ("
    //             while (lexical_tokens[index + 1][1] != "colon") {
    //                 index += 1;
    //                 cpp_source += " " + ppython_to_cpp(lexical_tokens[index]) + " ";
    //             }
    //             cpp_source += ") {"
    //             break;
    //     }
    // }

    if (cpp_source === undefined) {
        logErrorMessage("Error: no C++ source code could be produced");
    }

    return {
        result: cpp_source,
        logs: logs
    }
}