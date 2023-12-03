import {readFileSync} from "fs";

function getData(fileName: string): string[][] {
    const file = readFileSync(fileName, 'utf-8');

    const schematic: string[][] = []

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            schematic.push(trimmedLine.split(''));
        }
    });

    return schematic;
}

type Position = {
    row: number,
    column: number
}

type Symbol = Position & {
    symbol: string
    adjacentNumbers?: number[]
}

function findSymbolPositions(schematic: string[][]): Symbol[] {
    const nonSymbols = ['.', ' ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const symbolPositionList: Symbol[] = []

    schematic.forEach((row, rowIndex) => {
        row.forEach((potentialSymbol, columnIndex) => {
            if (!nonSymbols.includes(potentialSymbol)) {
                symbolPositionList.push({ symbol: potentialSymbol, row: rowIndex, column: columnIndex });
            }
        });
    });

    return symbolPositionList;
}

function findSymbolPositionsViaRegex(schematic: string[][]): Symbol[] {
    const symbolPositionList: Symbol[] = []
    schematic.forEach((row, rowIndex) => {
        const symbolRegex = /[^0-9. ]/g;
        const rowAsString = row.join('');
        let regExpMatchArray = rowAsString.match(symbolRegex);
        if (regExpMatchArray) {
            regExpMatchArray.forEach((match) => {
                symbolPositionList.push({
                    symbol: match,
                    row: rowIndex,
                    column: rowAsString.indexOf(match)
                });
            });
        }
    });
    return symbolPositionList;
}

type Number = {
    value: number,
    row: number,
    startColumn: number,
    endColumn: number
}

const findNumbersViaRegex = (schematic: string[][]): Number[] => {
    const numberList: Number[] = [];
    schematic.forEach((row, rowIndex) => {
        const numberRegex = /\d+/g;
        const rowAsString = row.join('');
        let regExpMatchArray: RegExpExecArray[] = [];
        let currentMatch: RegExpExecArray | null = null;

        do{
            currentMatch = numberRegex.exec(rowAsString);
            if (currentMatch) {
                regExpMatchArray.push(currentMatch);
            }
        } while(currentMatch);

        if (regExpMatchArray) {
            regExpMatchArray.forEach((match) => {
                numberList.push({
                    value: parseInt(match[0]),
                    row: rowIndex,
                    startColumn: match.index,
                    endColumn: match.index + match[0].length - 1
                });
            });
        }
    });
    return numberList;
}

const filterNumbers = (numberList: Number[], symbolPositionList: Symbol[]): Number[] => {
    return numberList.filter((number) => {
        const adjacentSymbols = symbolPositionList.filter((symbol) => {
            return symbol.row >= number.row - 1 &&
                symbol.row <= number.row + 1 &&
                symbol.column >= number.startColumn - 1 &&
                symbol.column <= number.endColumn + 1;
        });
        return adjacentSymbols.length > 0;
    });
};

function part1() {
    const schematic = getData('./2023/03/input.txt');

    // find symbols in schematic
    const symbolPositionList = findSymbolPositions(schematic);
    const symbolPositionListViaRegex = findSymbolPositionsViaRegex(schematic);
    console.log(`symbolPositionListViaRegex.length: ${symbolPositionListViaRegex.length} vs. symbolPositionList.length: ${symbolPositionList.length}`);
    const numberListViaRegex = findNumbersViaRegex(schematic);
    //console.table(numberListViaRegex);
    // filter numbers that don't have an adjacent symbol
    const filteredNumberList = filterNumbers(numberListViaRegex, symbolPositionList);
    //console.table(filteredNumberList);
    // sum up adjacent numbers
    const sum = filteredNumberList.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
    console.log(sum);
}

function findPotentialGears(schematic: string[][]): Symbol[] {
    const gearSymbol = '*';
    const symbolPositionList: Symbol[] = []

    schematic.forEach((row, rowIndex) => {
        row.forEach((potentialSymbol, columnIndex) => {
            if (potentialSymbol === gearSymbol) {
                symbolPositionList.push({ symbol: potentialSymbol, row: rowIndex, column: columnIndex });
            }
        });
    });

    return symbolPositionList;
}

function part2() {
    const schematic = getData('./2023/03/input.txt');
    const potentialGears = findPotentialGears(schematic);
    const numberList = findNumbersViaRegex(schematic);

    // filter for gears that have two adjacent numbers
    const filteredGears = potentialGears.filter((gear) => {
        const adjacentNumbers = numberList.filter((number) => {
            return gear.row >= number.row - 1 &&
                gear.row <= number.row + 1 &&
                gear.column >= number.startColumn - 1 &&
                gear.column <= number.endColumn + 1;
        });
        if(adjacentNumbers.length === 2) {
            gear.adjacentNumbers = adjacentNumbers.map((number) => number.value);
            return true;
        } else {
            return false;
        }
    });


    const gearSum = filteredGears.map((gear) => gear.adjacentNumbers?.reduce((accumulator, currentValue) => accumulator * currentValue, 1) ?? 0).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    console.log(gearSum);

}

part2();