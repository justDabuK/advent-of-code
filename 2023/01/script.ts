import {readFileSync} from "fs";

function parseNumber(potentialNumber: string): number {
    switch (potentialNumber) {
        case 'one':
            return 1;
        case 'two':
            return 2;
        case 'three':
            return 3;
        case 'four':
            return 4;
        case 'five':
            return 5;
        case 'six':
            return 6;
        case 'seven':
            return 7;
        case 'eight':
            return 8;
        case 'nine':
            return 9;
        default:
            return parseInt(potentialNumber);
    }
}

function getData(fileName: string): number[] {
    const file = readFileSync(fileName, 'utf-8');

    const numberListList: number[] = []
    const debugTable: {line: string, numberList: string[], result: number}[] = [];

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            const extractNumberRegex = /(\d|one|two|three|four|five|six|seven|eight|nine)/g;
            let numberList = trimmedLine.match(extractNumberRegex)

            if(numberList) {
                const result = parseInt(`${parseNumber(numberList[0])}${parseNumber(numberList[numberList.length - 1])}`)
                numberListList.push(result);
                debugTable.push({line: trimmedLine, numberList: numberList ? numberList : [], result});
            }
        }
    });

    console.table(debugTable);

    return numberListList;
}

function part1() {
    const numberListList = getData('./2023/01/input.txt');
    const sum = numberListList.reduce((sum, current) => sum + current, 0);
    console.log(numberListList);
    console.log(sum);
}

function part2() {
    const numberListList = getData('./2023/01/input.txt');
    const sum = numberListList.reduce((sum, current) => sum + current, 0);
    console.log(numberListList);
    console.log(sum);
}

part2();