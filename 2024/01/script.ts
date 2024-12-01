import { readFileSync } from 'fs';

function getData(fileName: string): number[][] {
    const file = readFileSync(fileName, 'utf-8');

    const numberListList: number[][] = [[],[]]

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            const extractNumberRegex = /(\d+)/g;
            let regExpMatchArray = trimmedLine.match(extractNumberRegex)
            if(regExpMatchArray) {
                regExpMatchArray.forEach((number, index) => {
                    numberListList[index].push(parseInt(number));
                });
            }
        }
    });

    return numberListList;
}

function part1() {
    console.group('Part 1');
    const dataTable = getData('./input.txt')
    console.table(dataTable);
    dataTable[0].sort((a, b) => a - b);
    dataTable[1].sort((a, b) => a - b);
    console.table(dataTable);
    let sum = 0;
    for(let i = 0; i < dataTable[0].length; i++) {
        const result = Math.abs(dataTable[0][i] - dataTable[1][i]);
        sum += result;
        console.log(`|${dataTable[0][i]} - ${dataTable[1][i]}| = ${result} => ${sum}`);
    }
    console.groupEnd();
}

function part2() {
    console.group('Part 2');
    const dataTable = getData('./input.txt')
    const occurrenceCounter = dataTable[1].reduce((acc, curr) => (acc[curr] ? ++acc[curr] : acc[curr] = 1, acc), {});
    let sum = 0;
    for(let i = 0; i < dataTable[0].length; i++) {
        const numberOfInterest = dataTable[0][i];
        const result = occurrenceCounter[numberOfInterest] !== undefined ? numberOfInterest * occurrenceCounter[numberOfInterest] : 0;
        sum += result;
    }
    console.log('Sum:', sum);
    console.groupEnd();
}

part2();