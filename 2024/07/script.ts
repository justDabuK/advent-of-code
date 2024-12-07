import {readFileSync} from "fs";
import { createOperatorListList } from './operatorListList';

type Equation = {
    result: number,
    operands: number[],
}

function getData(fileName: string): Equation[] {
    const file = readFileSync(fileName, 'utf-8');

    const equationList: Equation[] = [];

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            const [result, operandList] = trimmedLine.split(':');
            const operands = operandList.trim().split(' ').map((operand) => parseInt(operand.trim()));
            equationList.push({
                result: parseInt(result),
                operands
            });
        }
    });

    return equationList;
}


function isSolvable(equation: Equation, operatorListList: ((a: number, b: number) => number)[][], debug = false): boolean {
    if(equation.operands.length === 1) {
        console.log('this is ILLEGAL')
    }

    for(let possibleEquationIndex = 0; possibleEquationIndex < operatorListList.length; possibleEquationIndex++) {
        let equationResult = equation.operands[0];
        for(let operatorIndex = 0; operatorIndex < equation.operands.length - 1; operatorIndex++) {
           try {
               equationResult = operatorListList[possibleEquationIndex][operatorIndex](equationResult, equation.operands[operatorIndex + 1]);
               if (debug) console.log(`intermediate Result at operatorIndex ${operatorIndex}`, equationResult);
           } catch (e) {
               console.log(`exception when equation index: ${possibleEquationIndex} while number of possible equations: ${operatorListList.length}`, e);
               break;
           }
        }
        if(equationResult === equation.result) {
            if(debug) console.log('SUCCESS')
            return true;
        } else {
            if(debug) console.log('FAIL, let\'s try the next one');
        }
    }

    return false;
}

function part1() {
    const equationList = getData('./input.txt');
    const debug = false;
    if(debug) console.table(equationList);
    const maxOperators = Math.max(...equationList.map((equation) => equation.operands.length));
    const operatorListList = createOperatorListList(maxOperators);
    console.log(`operatorListList (with ${maxOperators} max operators) is finished, gonna see if equations are solvable`)
    const sumOfSolvableEquationResults = equationList.filter((equation) => {
        if(debug) console.group(equation.result);
        const result = isSolvable(equation, operatorListList, debug);
        if(debug) console.groupEnd();
        return result;
    }).reduce((acc, equation) => acc + equation.result, 0);
    console.log(sumOfSolvableEquationResults);
}

function part2() {
    const equationList = getData('./input.txt');
    const debug = false;
    if(debug) console.table(equationList);
    const maxOperators = Math.max(...equationList.map((equation) => equation.operands.length));
    const operatorListList = createOperatorListList(maxOperators, 3);
    console.log(`operatorListList (with ${maxOperators} max operators) is finished, gonna see if equations are solvable`)
    const sumOfSolvableEquationResults = equationList.filter((equation) => {
        if(debug) console.group(equation.result);
        const result = isSolvable(equation, operatorListList, debug);
        if(debug) console.groupEnd();
        return result;
    }).reduce((acc, equation) => acc + equation.result, 0);
    console.log(sumOfSolvableEquationResults);
}

part2();