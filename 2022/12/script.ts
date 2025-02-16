import { readFileSync } from "fs";

const START = "S";
const END = "E";
function getData(fileName: string): string[][] {
  const file = readFileSync(fileName, "utf-8");

  const heightMap: string[][] = [];

  file.split(/r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      heightMap.push(trimmedLine.split(""));
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
  parentList: GraphKnot[];
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
    parentList: [],
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

function sanitizeStartAndEnd(height: string): string {
  if (height === START) {
    return "a";
  } else if (height === END) {
    return "z";
  } else {
    return height;
  }
}

function isReachable(currentHeight: string, targetHeight: string) {
  const sanitizedCurrentHeight = sanitizeStartAndEnd(currentHeight);
  const sanitizedTargetHeight = sanitizeStartAndEnd(targetHeight);

  const reachableHeight = String.fromCharCode(
    sanitizedCurrentHeight.charCodeAt(0) + 1,
  );
  return sanitizedTargetHeight <= reachableHeight;
}

function linkChildren(graphMatrix: GraphKnot[][]) {
  // i could either only link children that are equal or higher
  // or I could link all possible children, meaning also once that are way lower,
  // i will link all of them
  let numOfRows = graphMatrix.length;
  let numOfColumns = graphMatrix[0].length;

  for (let row = 0; row < numOfRows; row++) {
    for (let column = 0; column < numOfColumns; column++) {
      const currentNode = graphMatrix[row][column];
      if (currentNode.value === END) {
        // we don't give the END children, since it is the END
        continue;
      }

      if (row > 0) {
        const potentialChild = graphMatrix[row - 1][column];
        if (isReachable(currentNode.value, potentialChild.value)) {
          currentNode.children.push(potentialChild);
          potentialChild.parentList.push(currentNode);
        }
      }

      if (column > 0) {
        const potentialChild = graphMatrix[row][column - 1];
        if (isReachable(currentNode.value, potentialChild.value)) {
          currentNode.children.push(potentialChild);
          potentialChild.parentList.push(currentNode);
        }
      }

      if (row < numOfRows - 1) {
        const potentialChild = graphMatrix[row + 1][column];
        if (isReachable(currentNode.value, potentialChild.value)) {
          currentNode.children.push(potentialChild);
          potentialChild.parentList.push(currentNode);
        }
      }

      if (column < numOfColumns - 1) {
        const potentialChild = graphMatrix[row][column + 1];
        if (isReachable(currentNode.value, potentialChild.value)) {
          currentNode.children.push(potentialChild);
          potentialChild.parentList.push(currentNode);
        }
      }
    }
  }
}

function getKnot(graphMatrix: GraphKnot[][], value: string): GraphKnot {
  for (let row = 0; row < graphMatrix.length; row++) {
    for (let col = 0; col < graphMatrix[0].length; col++) {
      let currentKnot = graphMatrix[row][col];
      if (currentKnot.value === value) {
        return currentKnot;
      }
    }
  }
  throw "There was no start knot you fool";
}

function getNodeWithMinCost(nodeQue: GraphKnot[]): GraphKnot {
  let potentialNode = nodeQue[0];
  let potentialNodeIndex = 0;

  nodeQue.forEach((node, index) => {
    if (node.cost < potentialNode.cost) {
      potentialNode = node;
      potentialNodeIndex = index;
    }
  });

  return nodeQue.splice(potentialNodeIndex, 1)[0];
}

function findShortestWayFromEndToStart(
  graphMatrix: GraphKnot[][],
  startValue: string,
) {
  let currentKnot = getKnot(graphMatrix, END);

  const shortestPath: GraphKnot[] = [];

  while (currentKnot.value !== startValue) {
    shortestPath.push(currentKnot);

    let costList = currentKnot.parentList.map((node) => node.cost);
    const lowestCost = Math.min(...costList);
    const lowestCostParentIndex = costList.indexOf(lowestCost);

    currentKnot = currentKnot.parentList[lowestCostParentIndex];
  }

  // push the last one, the START as well
  shortestPath.push(currentKnot);

  return shortestPath;
}

function calculateCost(graphMatrix: GraphKnot[][], startKnot: GraphKnot) {
  startKnot.cost = 0;

  const nodeQeu: GraphKnot[] = [startKnot];

  while (nodeQeu.length > 0) {
    const currentNode = getNodeWithMinCost(nodeQeu);
    currentNode.children.forEach((child) => {
      const currentCost = currentNode.cost + 1;
      if (currentCost < child.cost) {
        child.cost = currentCost;
        nodeQeu.push(child);
      }
    });
  }
}

function part1() {
  const heightMap = getData("./2022/12/test-input.txt");
  const graphMatrix = createGraphMatrix(heightMap);
  linkChildren(graphMatrix);
  calculateCost(graphMatrix, getKnot(graphMatrix, START));
  const shortestPath = findShortestWayFromEndToStart(graphMatrix, START);
  console.log(`the shortest path has ${shortestPath.length - 1} steps`);
}

function resetCost(graphMatrix: GraphKnot[][]) {
  graphMatrix.forEach((nodeRow) =>
    nodeRow.forEach((node) => (node.cost = Infinity)),
  );
}

function findPossibleShortestASteps(graphMatrix: GraphKnot[][]) {
  const startNodes = graphMatrix
    .flat()
    .filter((node) => node.value === "a" || node.value === START);

  const shortestStepList = startNodes.map<number>((startNode) => {
    startNode.cost = 0;
    calculateCost(graphMatrix, startNode);

    if (getKnot(graphMatrix, END).cost === Infinity) {
      resetCost(graphMatrix);
      return Infinity;
    }

    const shortestPath = findShortestWayFromEndToStart(
      graphMatrix,
      startNode.value,
    );

    resetCost(graphMatrix);

    return shortestPath.length - 1;
  });

  return Math.min(...shortestStepList);
}

function part2() {
  const heightMap = getData("./2022/12/input.txt");
  const graphMatrix = createGraphMatrix(heightMap);
  linkChildren(graphMatrix);
  const possibleShortestSteps = findPossibleShortestASteps(graphMatrix);
  console.log(`possible shortest way ${possibleShortestSteps}`);
}

part2();
