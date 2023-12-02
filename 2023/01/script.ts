import {readFileSync} from "fs";

function parseNumber(potentialNumber: string): number[] {
    switch (potentialNumber) {
        case 'one':
            return [1];
        case 'two':
            return [2];
        case 'three':
            return [3];
        case 'four':
            return [4];
        case 'five':
            return [5];
        case 'six':
            return [6];
        case 'seven':
            return [7];
        case 'eight':
            return [8];
        case 'nine':
            return [9];
        case "twone":
            return [2, 1]
        case "eightwo":
            return [8, 2]
        case "eighthree":
            return [8, 3]
        case "oneight":
            return [1, 8]
        case "threeight":
            return [3, 8]
        case "fiveight":
            return [5, 8]
        case "nineight":
            return [9, 8]
        case "sevenine":
            return [7, 9]
        default:
            return [parseInt(potentialNumber)];
    }
}

function getData(fileName: string): number[] {
    const file = readFileSync(fileName, 'utf-8');

    const numberListList: number[] = []
    const debugTable: {line: string, matches: string[], numberList: number[], result: number}[] = [];

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            const extractNumberRegex = /(\d|twone|eightwo|eighthree|oneight|threeight|fiveight|nineight|sevenine|one|two|three|four|five|six|seven|eight|nine)/g;
            let regExpMatchArray = trimmedLine.match(extractNumberRegex)

            if(regExpMatchArray) {
                let numberList = regExpMatchArray.map(parseNumber).flat();
                const result = parseInt(`${numberList[0]}${numberList[numberList.length - 1]}`)
                numberListList.push(result);
                //debugTable.push({line: trimmedLine, matches: regExpMatchArray ? regExpMatchArray : [], numberList, result});
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