import { readFileSync } from "fs";
import { n } from "vitest/dist/chunks/reporters.d.BFLkQcL6";
import * as Module from "module";
import compileCacheStatus = module;

function getData(fileName: string): string[][] {
  const file = readFileSync(fileName, "utf-8");

  const paperRollMap: string[][] = [];

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      paperRollMap.push(trimmedLine.split(""));
    }
  });

  return paperRollMap;
}

function part1() {
  const paperRollMap = getData("./input.txt");
  const numberOfAccessibleRolls = paperRollMap.reduce((acc, row, rowIndex) => {
    return (
      acc +
      row.reduce((rowAcc, cell, colIndex) => {
        if (cell !== "@") return rowAcc;

        const adjacentCells: (string | undefined)[] = [
          paperRollMap[rowIndex - 1]?.[colIndex], // N
          paperRollMap[rowIndex - 1]?.[colIndex + 1], // NE
          paperRollMap[rowIndex][colIndex + 1], // E
          paperRollMap[rowIndex + 1]?.[colIndex + 1], // SE
          paperRollMap[rowIndex + 1]?.[colIndex], // S
          paperRollMap[rowIndex + 1]?.[colIndex - 1], // SW
          paperRollMap[rowIndex][colIndex - 1], // W
          paperRollMap[rowIndex - 1]?.[colIndex - 1], // NW
        ];
        const paperRollCount = adjacentCells.filter(
          (cell) => cell === "@",
        ).length;
        if (paperRollCount < 4) {
          return rowAcc + 1;
        }
        return rowAcc;
      }, 0)
    );
  }, 0);
  console.log("numberOfAccessibleRolls", numberOfAccessibleRolls);
}

function part2() {
  const paperRollMap = getData("./input.txt");
  let numberOfAccessibleRolls = 0;
  let oldPaperRollMap = paperRollMap.map((row) => [...row]);
  let numberOfRemovedRolls = 0;
  do {
    const newPaperRollMap = oldPaperRollMap.map((row) => [...row]);
    numberOfAccessibleRolls = oldPaperRollMap.reduce((acc, row, rowIndex) => {
      return (
        acc +
        row.reduce((rowAcc, cell, colIndex) => {
          if (cell !== "@") return rowAcc;

          const adjacentCells: (string | undefined)[] = [
            oldPaperRollMap[rowIndex - 1]?.[colIndex], // N
            oldPaperRollMap[rowIndex - 1]?.[colIndex + 1], // NE
            oldPaperRollMap[rowIndex][colIndex + 1], // E
            oldPaperRollMap[rowIndex + 1]?.[colIndex + 1], // SE
            oldPaperRollMap[rowIndex + 1]?.[colIndex], // S
            oldPaperRollMap[rowIndex + 1]?.[colIndex - 1], // SW
            oldPaperRollMap[rowIndex][colIndex - 1], // W
            oldPaperRollMap[rowIndex - 1]?.[colIndex - 1], // NW
          ];
          const paperRollCount = adjacentCells.filter(
            (cell) => cell === "@",
          ).length;
          if (paperRollCount < 4) {
            newPaperRollMap[rowIndex][colIndex] = ".";
            return rowAcc + 1;
          }
          return rowAcc;
        }, 0)
      );
    }, 0);
    oldPaperRollMap = newPaperRollMap.map((row) => [...row]);
    numberOfRemovedRolls += numberOfAccessibleRolls;
  } while (numberOfAccessibleRolls > 0);
  console.log("numberOfAccessibleRolls", numberOfRemovedRolls);
}

part2();
