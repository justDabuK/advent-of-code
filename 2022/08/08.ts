import { readFileSync } from "fs";

function getData(fileName: string): number[][] {
  const file = readFileSync(fileName, "utf-8");

  const treeHeightMatrix: number[][] = [];

  file.split(/r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      treeHeightMatrix.push(
        trimmedLine.split("").map((height) => parseInt(height))
      );
    }
  });

  return treeHeightMatrix;
}

function isVisibleFromTop(
  treeMatrix: number[][],
  row: number,
  col: number
): boolean {
  const currentTreeHeight = treeMatrix[row][col];
  let maximumHeightFromTop = 0;
  for (let comparedRow = 0; comparedRow < row; comparedRow++) {
    const comparedHeight = treeMatrix[comparedRow][col];
    if (comparedHeight > maximumHeightFromTop) {
      maximumHeightFromTop = comparedHeight;
    }
  }
  return currentTreeHeight > maximumHeightFromTop;
}

function isVisibleFromRight(
  treeMatrix: number[][],
  row: number,
  col: number
): boolean {
  const currentTreeHeight = treeMatrix[row][col];
  const maxColumn = treeMatrix[row].length;

  let maximumHeightFromTop = 0;
  for (let comparedCol = col + 1; comparedCol < maxColumn; comparedCol++) {
    const comparedHeight = treeMatrix[row][comparedCol];
    if (comparedHeight > maximumHeightFromTop) {
      maximumHeightFromTop = comparedHeight;
    }
  }
  return currentTreeHeight > maximumHeightFromTop;
}

function isVisibleFromBottom(
  treeMatrix: number[][],
  row: number,
  col: number
): boolean {
  const currentTreeHeight = treeMatrix[row][col];
  const maxRow = treeMatrix.length;

  let maximumHeightFromTop = 0;
  for (let comparedRow = row + 1; comparedRow < maxRow; comparedRow++) {
    const comparedHeight = treeMatrix[comparedRow][col];
    if (comparedHeight > maximumHeightFromTop) {
      maximumHeightFromTop = comparedHeight;
    }
  }
  return currentTreeHeight > maximumHeightFromTop;
}

function isVisibleFromLeft(
  treeMatrix: number[][],
  row: number,
  col: number
): boolean {
  const currentTreeHeight = treeMatrix[row][col];

  let maximumHeightFromTop = 0;
  for (let comparedCol = 0; comparedCol < col; comparedCol++) {
    const comparedHeight = treeMatrix[row][comparedCol];
    if (comparedHeight > maximumHeightFromTop) {
      maximumHeightFromTop = comparedHeight;
    }
  }
  return currentTreeHeight > maximumHeightFromTop;
}

function getVisibleTreeCount(treeMatrix: number[][]): number {
  let visibleCounter = 0;
  const rowLength = treeMatrix.length;
  const columnLength = treeMatrix[0].length;
  for (let row = 0; row < rowLength; row++) {
    for (let col = 0; col < columnLength; col++) {
      if (
        row === 0 ||
        col === 0 ||
        row === rowLength - 1 ||
        col === columnLength - 1
      ) {
        visibleCounter++;
      } else {
        const visibleFromTop = isVisibleFromTop(treeMatrix, row, col);
        const visibleFromRight = isVisibleFromRight(treeMatrix, row, col);
        const visibleFromBottom = isVisibleFromBottom(treeMatrix, row, col);
        const visibleFromLeft = isVisibleFromLeft(treeMatrix, row, col);
        if (
          visibleFromTop ||
          visibleFromRight ||
          visibleFromBottom ||
          visibleFromLeft
        ) {
          visibleCounter++;
        }
      }
    }
  }
  return visibleCounter;
}

function getVisibleTreeCountFromTop(
  treeMatrix: number[][],
  row: number,
  col: number
): number {
  if (row === 0) {
    return 0;
  }

  const currentTreeHeight = treeMatrix[row][col];
  let visibleTreeCount = 0;

  for (let comparedRow = row - 1; comparedRow >= 0; comparedRow--) {
    const comparedHeight = treeMatrix[comparedRow][col];
    visibleTreeCount++;
    if (comparedHeight >= currentTreeHeight) {
      return visibleTreeCount;
    }
  }
  return visibleTreeCount;
}

function getVisibleTreeCountFromRight(
  treeMatrix: number[][],
  row: number,
  col: number
): number {
  const maxColumn = treeMatrix[row].length;
  if (col === maxColumn - 1) {
    return 0;
  }

  const currentTreeHeight = treeMatrix[row][col];
  let visibleTreeCount = 0;

  for (let comparedCol = col + 1; comparedCol < maxColumn; comparedCol++) {
    const comparedHeight = treeMatrix[row][comparedCol];
    visibleTreeCount++;
    if (comparedHeight >= currentTreeHeight) {
      return visibleTreeCount;
    }
  }
  return visibleTreeCount;
}

function getVisibleTreeCountFromBottom(
  treeMatrix: number[][],
  row: number,
  col: number
): number {
  const maxRow = treeMatrix.length;
  if (row === maxRow - 1) {
    return 0;
  }

  const currentTreeHeight = treeMatrix[row][col];
  let visibleTreeCount = 0;

  for (let comparedRow = row + 1; comparedRow < maxRow; comparedRow++) {
    const comparedHeight = treeMatrix[comparedRow][col];
    visibleTreeCount++;
    if (comparedHeight >= currentTreeHeight) {
      return visibleTreeCount;
    }
  }
  return visibleTreeCount;
}

function getVisibleTreeCountFromLeft(
  treeMatrix: number[][],
  row: number,
  col: number
): number {
  if (col === 0) {
    return 0;
  }

  const currentTreeHeight = treeMatrix[row][col];
  let visibleTreeCount = 0;

  for (let comparedCol = col - 1; comparedCol >= 0; comparedCol--) {
    const comparedHeight = treeMatrix[row][comparedCol];
    visibleTreeCount++;
    if (comparedHeight >= currentTreeHeight) {
      return visibleTreeCount;
    }
  }
  return visibleTreeCount;
}

function createScenicScoreMatrix(treeMatrix: number[][]): number[][] {
  const scoreMatrix: number[][] = [];
  const rowLength = treeMatrix.length;
  const columnLength = treeMatrix[0].length;
  for (let row = 0; row < rowLength; row++) {
    const currentRow = [];
    for (let col = 0; col < columnLength; col++) {
      const treesSeenOnTop = getVisibleTreeCountFromTop(treeMatrix, row, col);
      const treesSeenOnRight = getVisibleTreeCountFromRight(
        treeMatrix,
        row,
        col
      );
      const treesSeenOnBottom = getVisibleTreeCountFromBottom(
        treeMatrix,
        row,
        col
      );
      const treesSeenOnLeft = getVisibleTreeCountFromLeft(treeMatrix, row, col);
      const scenicScore =
        treesSeenOnTop * treesSeenOnRight * treesSeenOnBottom * treesSeenOnLeft;
      currentRow.push(scenicScore);
    }
    scoreMatrix.push(currentRow);
  }
  return scoreMatrix;
}

function part1() {
  const treeHeightMatrix = getData("./2022/08/input.txt");
  const visibleTreeCount = getVisibleTreeCount(treeHeightMatrix);

  console.log(`visible tree count: ${visibleTreeCount}`);
}

function part2() {
  const treeHeightMatrix = getData("./2022/08/input.txt");
  const scoreMatrix = createScenicScoreMatrix(treeHeightMatrix);
  const highestScorePerRowList = scoreMatrix.map((scoreRow) =>
    Math.max(...scoreRow)
  );
  const highestScore = Math.max(...highestScorePerRowList);

  console.log(`highest score: ${highestScore}`);
}

part2();
