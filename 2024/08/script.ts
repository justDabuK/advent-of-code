import { readFileSync } from "fs";

function getData(fileName: string): string[][] {
  const file = readFileSync(fileName, "utf-8");

  const antennaMap = [];

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      antennaMap.push(trimmedLine.split(""));
    }
  });

  return antennaMap;
}

type Position = {
  row: number;
  column: number;
};

function registerAntenna(antennaMap: string[][]) {
  const antennaRegister: Map<string, Position[]> = new Map<
    string,
    Position[]
  >();
  for (let rowIndex = 0; rowIndex < antennaMap.length; rowIndex++) {
    for (
      let columnIndex = 0;
      columnIndex < antennaMap[rowIndex].length;
      columnIndex++
    ) {
      const potentialAntenna = antennaMap[rowIndex][columnIndex];
      if (potentialAntenna !== ".") {
        if (!antennaRegister.has(potentialAntenna)) {
          antennaRegister.set(potentialAntenna, []);
        }
        antennaRegister
          .get(potentialAntenna)
          .push({ row: rowIndex, column: columnIndex });
      }
    }
  }
  return antennaRegister;
}

function getAntinodes(antennaA: Position, antennaB: Position): Position[] {
  const deltaRow = antennaA.row - antennaB.row;
  const deltaColumn = antennaA.column - antennaB.column;
  return [
    { row: antennaA.row + deltaRow, column: antennaA.column + deltaColumn },
    { row: antennaB.row - deltaRow, column: antennaB.column - deltaColumn },
  ];
}

function getAntinodePositionList(antennaRegister: Map<string, Position[]>) {
  const antinodePositions: Position[] = [];
  for (let [antennaType, antennaPositions] of antennaRegister.entries()) {
    const antennaPositions = antennaRegister.get(antennaType);
    for (let i = 0; i < antennaPositions.length; i++) {
      for (let j = i + 1; j < antennaPositions.length; j++) {
        antinodePositions.push(
          ...getAntinodes(antennaPositions[i], antennaPositions[j]),
        );
      }
    }
  }
  return antinodePositions;
}

function part1() {
  const antennaMap = getData("./input.txt");

  const debug = false;

  if (debug) console.table(antennaMap);
  const antennaRegister = registerAntenna(antennaMap);
  if (debug) console.log(antennaRegister);
  let antinodePositions = getAntinodePositionList(antennaRegister);
  antinodePositions = antinodePositions.filter(
    (antinode) =>
      antinode.row >= 0 &&
      antinode.row < antennaMap.length &&
      antinode.column >= 0 &&
      antinode.column < antennaMap[0].length,
  );

  if (debug) {
    antinodePositions.forEach((antinode) => {
      if (antennaMap[antinode.row][antinode.column] === ".") {
        antennaMap[antinode.row][antinode.column] = "#";
      }
    });
    console.table(antennaMap);
  }

  const antinodeSet = new Set(
    antinodePositions.map((antinode) => `${antinode.row},${antinode.column}`),
  );
  console.log(antinodeSet.size);
}

const isPositionInBounds = (
  position: Position,
  bounds: {
    minRow: number;
    maxRow: number;
    minColumn: number;
    maxColumn: number;
  },
) => {
  return (
    position.row >= bounds.minRow &&
    position.row <= bounds.maxRow &&
    position.column >= bounds.minColumn &&
    position.column <= bounds.maxColumn
  );
};

function getAntinodesEnhanced(
  antennaA: Position,
  antennaB: Position,
  bounds: {
    minRow: number;
    maxRow: number;
    minColumn: number;
    maxColumn: number;
  },
): Position[] {
  const deltaRow = antennaA.row - antennaB.row;
  const deltaColumn = antennaA.column - antennaB.column;
  const antinodeList: Position[] = [];

  // register antinodes in the direction of the delta
  let potentialAntinode = { row: antennaA.row, column: antennaA.column };
  while (isPositionInBounds(potentialAntinode, bounds)) {
    antinodeList.push({ ...potentialAntinode });
    potentialAntinode.row += deltaRow;
    potentialAntinode.column += deltaColumn;
  }

  // register antinodes in the opposite direction of the delta
  potentialAntinode = {
    row: antennaA.row - deltaRow,
    column: antennaA.column - deltaColumn,
  };
  while (
    isPositionInBounds(potentialAntinode, bounds) &&
    potentialAntinode.column <= bounds.maxColumn
  ) {
    antinodeList.push({ ...potentialAntinode });
    potentialAntinode.row -= deltaRow;
    potentialAntinode.column -= deltaColumn;
  }

  return antinodeList;
}

function getEnhancedAntinodePositionList(
  antennaRegister: Map<string, Position[]>,
  bounds: {
    minRow: number;
    maxRow: number;
    minColumn: number;
    maxColumn: number;
  },
) {
  const antinodePositions: Position[] = [];
  for (let [antennaType, antennaPositions] of antennaRegister.entries()) {
    const antennaPositions = antennaRegister.get(antennaType);
    for (let i = 0; i < antennaPositions.length; i++) {
      for (let j = i + 1; j < antennaPositions.length; j++) {
        antinodePositions.push(
          ...getAntinodesEnhanced(
            antennaPositions[i],
            antennaPositions[j],
            bounds,
          ),
        );
      }
    }
  }
  return antinodePositions;
}

function part2() {
  const antennaMap = getData("./input.txt");

  const debug = false;

  if (debug) console.table(antennaMap);
  const antennaRegister = registerAntenna(antennaMap);
  if (debug) console.log(antennaRegister);
  let antinodePositions = getEnhancedAntinodePositionList(antennaRegister, {
    minRow: 0,
    maxRow: antennaMap.length - 1,
    minColumn: 0,
    maxColumn: antennaMap[0].length - 1,
  });

  if (debug) {
    antinodePositions.forEach((antinode) => {
      if (antennaMap[antinode.row][antinode.column] === ".") {
        antennaMap[antinode.row][antinode.column] = "#";
      }
    });
    console.table(antennaMap);
  }

  const antinodeSet = new Set(
    antinodePositions.map((antinode) => `${antinode.row},${antinode.column}`),
  );
  console.log(antinodeSet.size);
}

part2();
