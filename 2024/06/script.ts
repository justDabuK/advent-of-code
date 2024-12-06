import {readFileSync} from "fs";


function getData(fileName: string): string[][] {
    const file = readFileSync(fileName, 'utf-8');

    const map: string[][] = [];

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            map.push(trimmedLine.split(''));
        }
    });

    return map;
}

function followGuard(map: string[][])  {
    const observedMap = [...map]

    const directionMap = {
        'up': [-1, 0],
        'right': [0, 1],
        'down': [1, 0],
        'left': [0, -1],
    } as const;

    type Direction = keyof typeof directionMap;

    const getDirectionAfterTurn = (currentDirection: Direction): Direction => {
        switch (currentDirection) {
            case 'up':
                return 'right';
            case 'right':
                return 'down';
            case 'down':
                return 'left';
            case 'left':
                return 'up';
            default:
                console.error('Invalid direction');
                return 'up';
        }
    }

    const getInitialGuardPosition = (map: string[][]): [number, number] => {
        for(let rowIndex = 0; rowIndex < map.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < map[0].length; columnIndex++) {
                if(map[rowIndex][columnIndex] === '^') {
                    return [rowIndex, columnIndex]
                }
            }
        }
    }

    let guardPosition = getInitialGuardPosition(map)
    let guardDirection: Direction = 'up'
    const lowerColumnBound = 0;
    const upperColumnBound = map[0].length - 1;
    const lowerRowBound = 0;
    const upperRowBound = map.length - 1;

    const isGuardInBounds = (guardPosition: [number, number]): boolean => {
        return guardPosition[0] >= lowerRowBound && guardPosition[0] <= upperRowBound && guardPosition[1] >= lowerColumnBound && guardPosition[1] <= upperColumnBound
    }

    const guardPath: string[] = []

    while (isGuardInBounds(guardPosition)) {
        const [currentRow, currentColumn] = guardPosition;
        observedMap[currentRow][currentColumn] = 'X'
        guardPath.push(`[${currentRow}-${currentColumn}]`)

        const nextRow = currentRow + directionMap[guardDirection][0]
        const nextColumn = currentColumn + directionMap[guardDirection][1]
        if(isGuardInBounds([nextRow, nextColumn]) && observedMap[nextRow][nextColumn] === '#') {
            guardDirection = getDirectionAfterTurn(guardDirection)
        } else {
            guardPosition = [nextRow, nextColumn]
        }
    }

    return {observedMap, guardPath}

}

function part1() {
    const map = getData('./input.txt');
    const {observedMap, guardPath} = followGuard(map)
    const guardPositions = new Set(guardPath);
    console.log('number of guard positions: ', guardPositions.size)
}

part1();