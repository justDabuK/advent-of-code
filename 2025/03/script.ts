import { readFileSync } from "fs";
import { n } from "vitest/dist/chunks/reporters.d.BFLkQcL6";

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

function findMaxJoltage12Batteries(bank: number[]): number {
  console.group(bank);
  let maxJoltage = 0;

  // the frame needs to move differently
  // we start with the first 12, the last index can move to the end
  // then the last two move to the end together
  // then the last three move to the end together, etc.
  // but how?
  console.groupEnd();
  return maxJoltage;
}

function part2() {
  const bankList = getData("./test-input.txt");
  const maxJoltageList = bankList.map(findMaxJoltage12Batteries);
  const jultageSum = maxJoltageList.reduce((a, b) => a + b, 0);
  console.log("maxJoltageList", maxJoltageList);
  console.log("jultageSum", jultageSum);
}

part2();
