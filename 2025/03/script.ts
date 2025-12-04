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

const debug = true;
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

  const windowSize = 12;

  let currentHighestNumberList: number[] = [];
  for (let i = 0; i < windowSize; i++) {
    currentHighestNumberList.push(9);
  }
  currentHighestNumberList.map((num) => )
  if (debug) console.groupEnd();
  return maxJoltage;
}

function part2() {
  const bankList = getData("./test-input.txt");
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
