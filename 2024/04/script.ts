import {readFileSync} from "fs";

function getData(fileName: string): string[][] {
    const file = readFileSync(fileName, 'utf-8');

    const characterMatrix: string[][] = []

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            characterMatrix.push(trimmedLine.split(''));
        }
    });

    return characterMatrix;
}


function findXmas(characterMatrix: string[][], debug = false): number {
    let xmasCounter = 0;
    const directionMap = {
        'up': [-1, 0],
        'down': [1, 0],
        'left': [0, -1],
        'right': [0, 1],
        'up-left': [-1, -1],
        'up-right': [-1, 1],
        'down-left': [1, -1],
        'down-right': [1, 1],
    }
    const directionCounter = {
        'up': 0,
        'down': 0,
        'left': 0,
        'right': 0,
        'up-left': 0,
        'up-right': 0,
        'down-left': 0,
        'down-right': 0,
    }
    characterMatrix.forEach((line: string[], row) => {
        line.forEach((character: string, column) => {
            if(debug) console.group(`row ${row} column ${column}`);
            if (character === 'X') {
                if(debug) console.log('FOUND X');
                // look for character sequence M-A-S in all directions
                Object.keys(directionMap).forEach((direction) => {
                    if(debug) console.log('looking in direction: ', direction);
                    const [rowDirection, columnDirection] = directionMap[direction];
                    let nextRow = row + rowDirection;
                    let nextColumn = column + columnDirection;
                    if(nextColumn < 0 || nextColumn >= line.length || nextRow < 0 || nextRow >= characterMatrix.length) {
                        if(debug) console.log('out of bounds');
                        return;
                    }
                    if (characterMatrix[nextRow] && characterMatrix[nextRow][nextColumn] === 'M') {
                        if(debug) console.log(`FOUND M at ${nextRow} x ${nextColumn}`);
                        nextRow = nextRow + rowDirection;
                        nextColumn = nextColumn+ columnDirection;
                        if(nextColumn < 0 || nextColumn >= line.length || nextRow < 0 || nextRow >= characterMatrix.length) {
                            if(debug) console.log('out of bounds');
                            return;
                        }
                        if (characterMatrix[nextRow] && characterMatrix[nextRow][nextColumn] === 'A') {
                            if(debug) console.log(`FOUND A at ${nextRow} x ${nextColumn}`);
                            nextRow = nextRow + rowDirection;
                            nextColumn = nextColumn+ columnDirection;
                            if(nextColumn < 0 || nextColumn >= line.length || nextRow < 0 || nextRow >= characterMatrix.length) {
                                if(debug) console.log('out of bounds');
                                return;
                            }
                            if (characterMatrix[nextRow] && characterMatrix[nextRow][nextColumn] === 'S') {
                                if(debug) console.log(`FOUND S at ${nextRow} x ${nextColumn}, xmas++`);
                                xmasCounter++;
                                directionCounter[direction]++;
                                return;
                            }
                        }
                    }
                })
            } else {
                if(debug) console.log('nope');
            }
            if(debug) console.groupEnd();
        });
    });
    console.table(directionCounter);
    return xmasCounter;
}

function part1() {
    const characterMatrix = getData('dominiks-input.txt');
    const xmasCounter = findXmas(characterMatrix);
    console.log("XMAS Counter: ", xmasCounter);

}

function findCrossMas(characterMatrix: string[][], debug = false): number {
    let crossMassCounter = 0;
    const crossOrientationMap = {
        '0 degree': [
            {
                character: 'M',
                rowDelta: -1,
                columnDelta: -1
            },
            {
                character: 'M',
                rowDelta: -1,
                columnDelta: 1
            },
            {
                character: 'S',
                rowDelta: 1,
                columnDelta: -1
            },
            {
                character: 'S',
                rowDelta: 1,
                columnDelta: 1
            },
        ],
        '90 degree': [
            {
                character: 'M',
                rowDelta: -1,
                columnDelta: 1
            },
            {
                character: 'M',
                rowDelta: 1,
                columnDelta: 1
            },
            {
                character: 'S',
                rowDelta: -1,
                columnDelta: -1
            },
            {
                character: 'S',
                rowDelta: 1,
                columnDelta: -1
            },
        ],
        '180 degree': [
            {
                character: 'M',
                rowDelta: 1,
                columnDelta: -1
            },
            {
                character: 'M',
                rowDelta: 1,
                columnDelta: 1
            },
            {
                character: 'S',
                rowDelta: -1,
                columnDelta: -1
            },
            {
                character: 'S',
                rowDelta: -1,
                columnDelta: 1
            },
        ],
        '270 degree': [
            {
                character: 'M',
                rowDelta: -1,
                columnDelta: -1
            },
            {
                character: 'M',
                rowDelta: 1,
                columnDelta: -1
            },
            {
                character: 'S',
                rowDelta: -1,
                columnDelta: 1
            },
            {
                character: 'S',
                rowDelta: 1,
                columnDelta: 1
            },
        ],
    }

    const checkAtPosition = (row: number, column: number, character: string): boolean => {
        if(column < 0 || column >= characterMatrix[0].length || row < 0 || row >= characterMatrix.length) {
            if(debug) console.log('out of bounds');
            return false;
        }
        return characterMatrix[row][column] === character
    }

    characterMatrix.forEach((line: string[], row) => {
        line.forEach((character: string, column) => {
            if(debug) console.group(`row ${row} column ${column}`);
            if (character === 'A') {
                if(debug) console.log('FOUND A');
                // look for possible crosses
                Object.keys(crossOrientationMap).forEach((orientation) => {
                    if(debug) console.log(`checking for ${orientation} orientation: `);
                    const characterLocations = crossOrientationMap[orientation];
                    for(let locationIndex = 0; locationIndex < characterLocations.length; locationIndex++) {
                        if(!checkAtPosition(
                            row + characterLocations[locationIndex].rowDelta,
                            column + characterLocations[locationIndex].columnDelta,
                            characterLocations[locationIndex].character)) {
                            if(debug) console.log(`FAIL for ${characterLocations[locationIndex].character} at ${row + characterLocations[locationIndex].rowDelta} x ${column + characterLocations[locationIndex].columnDelta}`);
                            return;
                        }
                        if(debug) console.log(`FOUND ${characterLocations[locationIndex].character} at ${row + characterLocations[locationIndex].rowDelta} x ${column + characterLocations[locationIndex].columnDelta}`);
                    }
                    if(debug) console.log(`FOUND CROSS at ${row} x ${column} with orientation ${orientation}, crossMass++`);
                    crossMassCounter++;
                })

            } else {
                if(debug) console.log('nope');
            }
            if(debug) console.groupEnd();
        });
    });
    return crossMassCounter;
}

function part2() {
    const characterMatrix = getData('input.txt');
    const crossMasCounter = findCrossMas(characterMatrix);
    console.log("X-MAS Counter: ", crossMasCounter);

}

part1();