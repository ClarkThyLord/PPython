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
        .replaceAll("<=", " <= ")
        .replaceAll("<", " < ")
        .replaceAll(">", " > ")
        .replaceAll(">=", " >= ")
        .replaceAll("==", " == ")
        .replaceAll("!=", " != ")
        .replaceAll("*", " * ")
        .replaceAll("+", " + ")
        .replaceAll("-", " - ")
        .replaceAll("/", " / ") 
        .split(/[ ]+/).filter(n => n);

    //Logger to check what the word means
    var TokenExpressions = {};


    let RegInt = /(?<!.)(Int)(?!.)/;
    let RegIntVal = /(?<!.)[0-9]+(?!.)/;
    let RegStr = /(?<!.)(String)(?!.)/;
    let RegStrVal = /(?<!.)(".*")(?!.)/;
    let RegBul = /(?<!.)(Bool)(?!.)/;
    let RegBulVal = /(?<!.)(True|False)(?!.)/;
    let RegSum = /(?<!.)[+](?!.)/;
    let RegSub = /(?<!.)[-](?!.)/;
    let RegMlt = /(?<!.)[*](?!.)/;
    let RegDiv = /(?<!.)[/](?!.)/;
    let RegEql = /(?<!.)(==)(?!.)/;
    let RegAsn = /(?<!.)(=)(?!.)/;
    let RegDif = /(?<!.)(!=)(?!.)/;
    let RegGrt = /(?<!.)[>](?!.)/;
    let RegGte = /(?<!.)(>=)(?!.)/;
    let RegLwt = /(?<!.)[<](?!.)/;
    let RegLte = /(?<!.)(<=)(?!.)/;
    let RegAnd = /(?<!.)(and)(?!.)/;
    let RegOor = /(?<!.)(or)(?!.)/;
    let RegWle = /(?<!.)(While)(?!.)/;
    let RegIff = /(?<!.)(If)(?!.)/;
    let RegEls = /(?<!.)(Else)(?!.)/;
    let RegLif = /(?<!.)(Elif)(?!.)/;
    let RegRtn = /(?<!.)([^\\d][a-zA-Z0-9]*)(?!.)/;
    let RegBrk = /(?<!.)(Break)(?!.)/;
    let RegVar = /(?<!.)([^d][a-zA-Z]*)(?!.)/;
    let RegCom = /(\s(#[a-zA-Z0-9]*))/;
    let RegDdt = /(?<!.)(:)(?!.)/;
    let RegRgt =  /(?<!.)([(])(?!.)/;
    let RegLft =  /(?<!.)([)])(?!.)/;  

    
    let state = 0;
    let token_lex;
   
    for (let i = 0; i < raw_tokens.length; i++) { 
        switch(state){
            case 0: 

            break;
            case 1: 

            break;
            case 2:

             

            break;
            case 3:

             

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