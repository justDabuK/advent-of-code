import { readFileSync } from "fs";
import { n } from "vitest/dist/chunks/reporters.d.BFLkQcL6";
import * as Module from "module";
import compileCacheStatus = module;

function getData(fileName: string): number[][] {
  const file = readFileSync(fileName, "utf-8");

  const bankList: number[][] = [];

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      bankList.push(trimmedLine.split("").map(Number));
    }
  });

  return bankList;
}

function findMaxJoltageBruteForce(bank: number[]): number {
  let maxJoltage = 0;

  for (let leftIndex = 0; leftIndex < bank.length - 1; leftIndex++) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < bank.length;
      rightIndex++
    ) {
      const joltage = parseInt(`${bank[leftIndex]}${bank[rightIndex]}`, 10);
      if (joltage > maxJoltage) {
        maxJoltage = joltage;
      }
    }
  }
  return maxJoltage;
}

function part1() {
  const bankList = getData("./input.txt");
  const maxJoltageList = bankList.map(findMaxJoltageBruteForce);
  const jultageSum = maxJoltageList.reduce((a, b) => a + b, 0);
  console.log("jultageSum", jultageSum);
}

const debug = false;
function findMaxJoltage12Batteries(bank: number[]): number {
  if (debug) console.group(bank.join(""));
  let maxJoltage = 0;

  const checkAndReplaceJoltage = (localIndexList: number[]) => {
    let currentJoltage = parseInt(
      localIndexList.map((index) => bank[index]).join(""),
    );
    if (debug) console.log(localIndexList.join("-"), "=>", currentJoltage);
    if (currentJoltage > maxJoltage) {
      maxJoltage = currentJoltage;
    }
  };

  // no the moving frame is wrong, as there can also be solutions that have gaps in between
  let initialIndexList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  let indexList = [...initialIndexList];

  while (indexList[0] < bank.length - 11) {
    while (indexList[1] < bank.length - 10) {
      while (indexList[2] < bank.length - 9) {
        while (indexList[3] < bank.length - 8) {
          while (indexList[4] < bank.length - 7) {
            while (indexList[5] < bank.length - 6) {
              while (indexList[6] < bank.length - 5) {
                while (indexList[7] < bank.length - 4) {
                  while (indexList[8] < bank.length - 3) {
                    while (indexList[9] < bank.length - 2) {
                      while (indexList[10] < bank.length - 1) {
                        while (indexList[11] < bank.length) {
                          checkAndReplaceJoltage(indexList);
                          indexList[11]++;
                        }
                        indexList[10]++;
                        indexList[11] = indexList[10] + 1;
                      }
                      indexList[9]++;
                      indexList[10] = indexList[9] + 1;
                      indexList[11] = indexList[10] + 1;
                    }
                    indexList[8]++;
                    indexList[9] = indexList[8] + 1;
                    indexList[10] = indexList[9] + 1;
                    indexList[11] = indexList[10] + 1;
                  }
                  indexList[7]++;
                  indexList[8] = indexList[7] + 1;
                  indexList[9] = indexList[8] + 1;
                  indexList[10] = indexList[9] + 1;
                  indexList[11] = indexList[10] + 1;
                }
                indexList[6]++;
                indexList[7] = indexList[6] + 1;
                indexList[8] = indexList[7] + 1;
                indexList[9] = indexList[8] + 1;
                indexList[10] = indexList[9] + 1;
                indexList[11] = indexList[10] + 1;
              }
              indexList[5]++;
              indexList[6] = indexList[5] + 1;
              indexList[7] = indexList[6] + 1;
              indexList[8] = indexList[7] + 1;
              indexList[9] = indexList[8] + 1;
              indexList[10] = indexList[9] + 1;
              indexList[11] = indexList[10] + 1;
            }
            indexList[4]++;
            indexList[5] = indexList[4] + 1;
            indexList[6] = indexList[5] + 1;
            indexList[7] = indexList[6] + 1;
            indexList[8] = indexList[7] + 1;
            indexList[9] = indexList[8] + 1;
            indexList[10] = indexList[9] + 1;
            indexList[11] = indexList[10] + 1;
          }
          indexList[3]++;
          indexList[4] = indexList[3] + 1;
          indexList[5] = indexList[4] + 1;
          indexList[6] = indexList[5] + 1;
          indexList[7] = indexList[6] + 1;
          indexList[8] = indexList[7] + 1;
          indexList[9] = indexList[8] + 1;
          indexList[10] = indexList[9] + 1;
          indexList[11] = indexList[10] + 1;
        }
        indexList[2]++;
        indexList[3] = indexList[2] + 1;
        indexList[4] = indexList[3] + 1;
        indexList[5] = indexList[4] + 1;
        indexList[6] = indexList[5] + 1;
        indexList[7] = indexList[6] + 1;
        indexList[8] = indexList[7] + 1;
        indexList[9] = indexList[8] + 1;
        indexList[10] = indexList[9] + 1;
        indexList[11] = indexList[10] + 1;
      }
      indexList[1]++;
      indexList[2] = indexList[1] + 1;
      indexList[3] = indexList[2] + 1;
      indexList[4] = indexList[3] + 1;
      indexList[5] = indexList[4] + 1;
      indexList[6] = indexList[5] + 1;
      indexList[7] = indexList[6] + 1;
      indexList[8] = indexList[7] + 1;
      indexList[9] = indexList[8] + 1;
      indexList[10] = indexList[9] + 1;
      indexList[11] = indexList[10] + 1;
    }
    indexList[0]++;
    indexList[1] = indexList[0] + 1;
    indexList[2] = indexList[1] + 1;
    indexList[3] = indexList[2] + 1;
    indexList[4] = indexList[3] + 1;
    indexList[5] = indexList[4] + 1;
    indexList[6] = indexList[5] + 1;
    indexList[7] = indexList[6] + 1;
    indexList[8] = indexList[7] + 1;
    indexList[9] = indexList[8] + 1;
    indexList[10] = indexList[9] + 1;
    indexList[11] = indexList[10] + 1;
  }

  if (debug) console.log(maxJoltage);
  if (debug) console.groupEnd();
  return maxJoltage;
}

function part2() {
  const bankList = getData("./input.txt");
  const maxJoltageList = bankList.map((bank, index) => {
    if (index % 10 === 0)
      console.log(`Processing bank ${index + 1} of ${bankList.length}`);
    return findMaxJoltage12Batteries(bank);
  });
  const jultageSum = maxJoltageList.reduce((a, b) => a + b, 0);
  if (debug) console.log("maxJoltageList", maxJoltageList);
  console.log("jultageSum", jultageSum);
}

part2();
