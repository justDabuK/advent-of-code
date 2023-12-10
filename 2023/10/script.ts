import { readFileSync } from 'fs';

enum PipeType {
    VerticalPipe = '|',
    HorizontalPipe = '-',
    NorthEastPipe = 'L',
    NorthWestPipe = 'J',
    SouthWestPipe = '7',
    SouthEastPipe = 'F',
    Ground = '.',
    Start = 'S',
}

type Node = {
    row: number;
    column: number;
    symbol: PipeType;
    adjacentNodes?: Node[];
    distanceFromStart?: number;
    partOfMainLoop: boolean;
};

function getData(fileName: string): Node[][] {
    const file = readFileSync(fileName, 'utf-8');

    const pipeMap: Node[][] = [];

    file.split(/\r?\n/).forEach((line: string, rowIndex) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            pipeMap.push(
                trimmedLine
                    .split('')
                    .map<PipeType>((symbol) => symbol as PipeType)
                    .map((symbol, columnIndex) => ({
                        row: rowIndex,
                        column: columnIndex,
                        symbol,
                        partOfMainLoop: false,
                    }))
            );
        }
    });

    return pipeMap;
}

function addAdjacentNodes(
    pipeMap: Node[][],
    node: Node,
    row: number,
    column: number
): void {
    const potentialRow = pipeMap[row];
    if (!potentialRow) {
        return;
    }

    const potentialAdjacentNode = potentialRow[column];
    if (!potentialAdjacentNode) {
        return;
    }

    if (!node.adjacentNodes) {
        node.adjacentNodes = [potentialAdjacentNode];
    } else {
        node.adjacentNodes.push(potentialAdjacentNode);
    }
}

function linkNodes(pipeMap: Node[][], startNodeType: PipeType): void {
    function linkVerticalPipe(pipeMap: Node[][], node: Node): void {
        addAdjacentNodes(pipeMap, node, node.row - 1, node.column);
        addAdjacentNodes(pipeMap, node, node.row + 1, node.column);
    }
    function linkHorizontalPipe(pipeMap: Node[][], node: Node): void {
        addAdjacentNodes(pipeMap, node, node.row, node.column - 1);
        addAdjacentNodes(pipeMap, node, node.row, node.column + 1);
    }

    function linkNorthEastPipe(pipeMap: Node[][], node: Node): void {
        addAdjacentNodes(pipeMap, node, node.row - 1, node.column);
        addAdjacentNodes(pipeMap, node, node.row, node.column + 1);
    }

    function linkNorthWestPipe(pipeMap: Node[][], node: Node): void {
        addAdjacentNodes(pipeMap, node, node.row - 1, node.column);
        addAdjacentNodes(pipeMap, node, node.row, node.column - 1);
    }

    function linkSouthWestPipe(pipeMap: Node[][], node: Node): void {
        addAdjacentNodes(pipeMap, node, node.row + 1, node.column);
        addAdjacentNodes(pipeMap, node, node.row, node.column - 1);
    }

    function linkSouthEastPipe(pipeMap: Node[][], node: Node): void {
        addAdjacentNodes(pipeMap, node, node.row + 1, node.column);
        addAdjacentNodes(pipeMap, node, node.row, node.column + 1);
    }

    function linkPipe(pipeMap: Node[][], node: Node, symbol: PipeType): void {
        switch (symbol) {
            case PipeType.VerticalPipe:
                linkVerticalPipe(pipeMap, node);
                break;
            case PipeType.HorizontalPipe:
                linkHorizontalPipe(pipeMap, node);
                break;
            case PipeType.NorthEastPipe:
                linkNorthEastPipe(pipeMap, node);
                break;
            case PipeType.NorthWestPipe:
                linkNorthWestPipe(pipeMap, node);
                break;
            case PipeType.SouthWestPipe:
                linkSouthWestPipe(pipeMap, node);
                break;
            case PipeType.SouthEastPipe:
                linkSouthEastPipe(pipeMap, node);
                break;
            case PipeType.Ground:
            default:
                node.adjacentNodes = [];
                break;
        }
    }

    pipeMap.forEach((row) => {
        row.forEach((node) => {
            linkPipe(
                pipeMap,
                node,
                node.symbol === PipeType.Start ? startNodeType : node.symbol
            );
        });
    });
}

const TEST_INPUT_1 = './2023/10/test-input-1.txt';
const TEST_INPUT_2 = './2023/10/test-input-2.txt';
const TEST_INPUT_3 = './2023/10/test-input-3.txt';
const TEST_INPUT_4 = './2023/10/test-input-4.txt';
const INPUT = './2023/10/input.txt';

const inputMap: Record<string, PipeType> = {
    [TEST_INPUT_1]: PipeType.SouthEastPipe,
    [TEST_INPUT_2]: PipeType.SouthEastPipe,
    [TEST_INPUT_3]: PipeType.SouthEastPipe,
    [TEST_INPUT_4]: PipeType.SouthWestPipe,
    [INPUT]: PipeType.NorthEastPipe,
};

function findStartNode(pipeMap: Node[][]): Node {
    let startNode = pipeMap[0][0];
    pipeMap.forEach((row) => {
        row.forEach((node) => {
            if (node.symbol === PipeType.Start) {
                startNode = node;
            }
        });
    });
    return startNode;
}

function walkThroughMainLoop(pipeMap: Node[][], startNode: Node): void {
    const queue: Node[] = [startNode];
    startNode.distanceFromStart = 0;

    while (queue.length > 0) {
        const currentNode = queue.shift();
        if (currentNode) {
            currentNode.adjacentNodes?.forEach((node) => {
                if (node && node.distanceFromStart === undefined) {
                    node.distanceFromStart =
                        (currentNode.distanceFromStart ?? 0) + 1;
                    queue.push(node);
                }
            });
        }
    }
}

function printPipeMap(pipeMap: Node[][]): void {
    let currentString = '';
    pipeMap.forEach((row) => {
        row.forEach((node) => {
            currentString = currentString.concat(`${node.symbol}`);
        });
        console.log(currentString);
        currentString = '';
    });
    console.log(currentString);
}

function findMaxDistance(pipeMap: Node[][]): number {
    let currentString = '';
    let maxDistance = 0;
    pipeMap.forEach((row) => {
        row.forEach((node) => {
            currentString = currentString.concat(
                `${node.distanceFromStart ?? PipeType.Ground}`
            );
            maxDistance = Math.max(maxDistance, node.distanceFromStart ?? 0);
        });
        console.log(currentString);
        currentString = '';
    });
    console.log(currentString);

    return maxDistance;
}

function part1(fileName: string, startNodeType: PipeType) {
    const pipeMap = getData(fileName);
    linkNodes(pipeMap, startNodeType);

    printPipeMap(pipeMap);

    const startNode = findStartNode(pipeMap);

    walkThroughMainLoop(pipeMap, startNode);

    const maxDistance = findMaxDistance(pipeMap);

    console.log(`maxDistance: ${maxDistance}`);
}

function part2(fileName: string, startNodeType: PipeType) {
    const pipeMap = getData(fileName);
    linkNodes(pipeMap, startNodeType);
}

const currentInput = TEST_INPUT_2;

part1(currentInput, inputMap[currentInput]);
