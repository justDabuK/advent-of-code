import { readFileSync } from "fs";

function readFiles(fileName: string) {
  const file = readFileSync(fileName, "utf8");

  const elfCaloryList: number[] = [];

  let newCaloryList: number[] = [];
  file.split(/r?\n/).forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      elfCaloryList.push(
        newCaloryList.reduce((sum, current) => sum + current, 0),
      );
      newCaloryList = [];
    } else {
      newCaloryList.push(parseInt(trimmedLine));
    }
  });

  return elfCaloryList;
}

function findHighestCalories(elfCaloryList: number[]) {
  return Math.max(...elfCaloryList);
}

function findTopThreeCaloriesSum(elfCaloryList: number[]) {
  elfCaloryList.sort((a, b) => {
    return b - a;
  });

  let sum = 0;
  for (let i = 0; i < 3; i++) {
    console.log(`${i}: ${elfCaloryList[i]}`);
    sum += elfCaloryList[i];
  }

  return sum;
}

const elfCalories = readFiles("./2022/01/input.txt");
const highestCalories = findHighestCalories(elfCalories);
console.log(`Highest calories: ${highestCalories}`);
const threeHighestCombined = findTopThreeCaloriesSum(elfCalories);
console.log(`three highest calories combined: ${threeHighestCombined}`);
