import { readFileSync } from "fs";

function getData(fileName: string): string[][] {
  const file = readFileSync(fileName, "utf-8");

  const map: string[][] = [];

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      map.push(trimmedLine.split(""));
    }
  });

  return map;
}

const directionMap = {
  up: [-1, 0],
  right: [0, 1],
  down: [1, 0],
  left: [0, -1],
} as const;

type Direction = keyof typeof directionMap;
type GuardPath = { position: [number, number]; direction: Direction }[];

const getDirectionAfterTurn = (currentDirection: Direction): Direction => {
  switch (currentDirection) {
    case "up":
      return "right";
    case "right":
      return "down";
    case "down":
      return "left";
    case "left":
      return "up";
    default:
      console.error("Invalid direction");
      return "up";
  }
};

const getInitialGuardPosition = (map: string[][]): [number, number] => {
  for (let rowIndex = 0; rowIndex < map.length; rowIndex++) {
    for (let columnIndex = 0; columnIndex < map[0].length; columnIndex++) {
      if (map[rowIndex][columnIndex] === "^") {
        return [rowIndex, columnIndex];
      }
    }
  }
};

function followGuard(map: string[][]) {
  const observedMap = JSON.parse(JSON.stringify(map));

  let guardPosition = getInitialGuardPosition(map);
  let guardDirection: Direction = "up";
  const lowerColumnBound = 0;
  const upperColumnBound = map[0].length - 1;
  const lowerRowBound = 0;
  const upperRowBound = map.length - 1;

  const isGuardInBounds = (guardPosition: [number, number]): boolean => {
    return (
      guardPosition[0] >= lowerRowBound &&
      guardPosition[0] <= upperRowBound &&
      guardPosition[1] >= lowerColumnBound &&
      guardPosition[1] <= upperColumnBound
    );
  };
  const guardPath: GuardPath = [];

  while (isGuardInBounds(guardPosition)) {
    const [currentRow, currentColumn] = guardPosition;
    observedMap[currentRow][currentColumn] = "X";
    guardPath.push({
      position: [currentRow, currentColumn],
      direction: guardDirection,
    });

    const nextRow = currentRow + directionMap[guardDirection][0];
    const nextColumn = currentColumn + directionMap[guardDirection][1];
    if (
      isGuardInBounds([nextRow, nextColumn]) &&
      observedMap[nextRow][nextColumn] === "#"
    ) {
      guardDirection = getDirectionAfterTurn(guardDirection);
    } else {
      guardPosition = [nextRow, nextColumn];
    }
  }

  return { observedMap, guardPath };
}

function part1() {
  const map = getData("./dominiks-input.txt");
  const { guardPath } = followGuard(map);
  const guardPositions = new Set(
    guardPath.map(({ position: [row, column] }) => `${row}-${column}`),
  );
  console.log("number of guard positions: ", guardPositions.size);
}

function findLoopPositions(
  originalMap: string[][],
  originalGuardPath: GuardPath,
) {
  const initialGuardPosition = getInitialGuardPosition(originalMap);

  const lowerColumnBound = 0;
  const upperColumnBound = originalMap[0].length - 1;
  const lowerRowBound = 0;
  const upperRowBound = originalMap.length - 1;

  const isGuardInBounds = (guardPosition: [number, number]): boolean => {
    return (
      guardPosition[0] >= lowerRowBound &&
      guardPosition[0] <= upperRowBound &&
      guardPosition[1] >= lowerColumnBound &&
      guardPosition[1] <= upperColumnBound
    );
  };

  const isDuplicatedPosition = (
    guardPosition: [number, number],
    direction: Direction,
    guardPath: GuardPath,
  ): boolean => {
    return guardPath.some(
      (entry) =>
        entry.position[0] === guardPosition[0] &&
        entry.position[1] === guardPosition[1] &&
        entry.direction === direction,
    );
  };

  const loopWallPositions: [number, number][] = [];

  for (
    let originalGuardPathIndex = 1;
    originalGuardPathIndex < originalGuardPath.length;
    originalGuardPathIndex++
  ) {
    if (originalGuardPathIndex % 500 === 0)
      console.log(
        `loop counter ${loopWallPositions.length} (${originalGuardPathIndex}/${originalGuardPath.length})`,
      );
    const extraWallPosition =
      originalGuardPath[originalGuardPathIndex].position;
    const adjustedMap = JSON.parse(JSON.stringify(originalMap));
    adjustedMap[extraWallPosition[0]][extraWallPosition[1]] = "#";
    const currentGuardPath: {
      position: [number, number];
      direction: Direction;
    }[] = [];

    let guardPosition: [number, number] = [...initialGuardPosition];
    let guardDirection: Direction = "up";

    while (
      isGuardInBounds(guardPosition) &&
      !isDuplicatedPosition(guardPosition, guardDirection, currentGuardPath)
    ) {
      const [currentRow, currentColumn] = guardPosition;
      adjustedMap[currentRow][currentColumn] = "X";
      currentGuardPath.push({
        position: [currentRow, currentColumn],
        direction: guardDirection,
      });

      const nextRow = currentRow + directionMap[guardDirection][0];
      const nextColumn = currentColumn + directionMap[guardDirection][1];
      if (
        isGuardInBounds([nextRow, nextColumn]) &&
        adjustedMap[nextRow][nextColumn] === "#"
      ) {
        guardDirection = getDirectionAfterTurn(guardDirection);
      } else {
        guardPosition = [nextRow, nextColumn];
      }
    }

    if (!isGuardInBounds(guardPosition)) {
      // nothing to do
    } else if (
      isDuplicatedPosition(guardPosition, guardDirection, currentGuardPath)
    ) {
      loopWallPositions.push(extraWallPosition);
    } else {
      console.log(
        `EXCEPTION: guard position ${guardPosition} (bounds: ${upperRowBound},${upperColumnBound}), direction: ${guardDirection} extra wall position ${extraWallPosition} guard direction ${guardDirection}`,
      );
      return loopWallPositions;
    }
  }

  return loopWallPositions;
}

function part2() {
  const map = getData("./input.txt");
  const { guardPath } = followGuard(map);
  const loopWallPositions = findLoopPositions(map, guardPath);
  const positionSet = new Set(
    loopWallPositions.map(([row, column]) => `${row}-${column}`),
  );
  console.log("number of potential loop positions: ", positionSet.size);
}

part2();
