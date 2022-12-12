import { readFileSync } from 'fs';

function getData(fileName: string): string[][] {
  const file = readFileSync(fileName, 'utf-8');

  const heightMap: string[][] = [];

  file.split(/r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log('reached the end');
    } else {
      heightMap.push(trimmedLine.split(''));
    }
  });

  return heightMap;
}

type Position = {
  x: number;
  y: number;
};

type GraphKnot = {
  value: string;
  position: Position;
  children: GraphKnot[];
  cost: number;
};

function mapToGraphKnot(value: string, x: number, y: number): GraphKnot {
  return {
    value,
    position: {
      x,
      y,
    },
    children: [],
    cost: Infinity,
  };
}

function createGraphMatrix(heightMap: string[][]) {
  const graphMatrix: GraphKnot[][] = [];
  for (let row = 0; row < heightMap.length; row++) {
    const knotList: GraphKnot[] = [];
    for (let column = 0; column < heightMap[0].length; column++) {
      knotList.push(mapToGraphKnot(heightMap[row][column], row, column));
    }
    graphMatrix.push(knotList);
  }
  return graphMatrix;
}

function linkChildren(graphMatrix: GraphKnot[][]) {
  // i could either only link children that are equal or higher
  // or I could link all possible children, meaning also once that are way lower,
}

function part1() {
  const heightMap = getData('./2022/12/test-input.txt');
  const graphMatrix = createGraphMatrix(heightMap);
  console.log(heightMap);
}
