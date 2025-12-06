import { readFileSync } from "fs";

type MathProblem = {
  numberList: number[];
  operator: "*" | "+";
};
function getDataPart1(fileName: string) {
  const file = readFileSync(fileName, "utf-8");

  const numberListList: number[][] = [];
  const mathProblemList: MathProblem[] = [];

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      const regex = /(\d+|[\+\*])/g; // Add 'g' flag for global matching

      const currentMatches = Array.from(trimmedLine.matchAll(regex)).map(
        (m) => m[1],
      );
      const isNumberList = currentMatches.every((m) => !isNaN(Number(m)));

      if (isNumberList && numberListList.length === 0) {
        currentMatches.forEach((match) => {
          numberListList.push([Number(match)]);
        });
      } else if (isNumberList) {
        currentMatches.map(Number).forEach((num, index) => {
          numberListList[index].push(num);
        });
      } else {
        currentMatches.forEach((match, index) => {
          mathProblemList.push({
            numberList: numberListList[index],
            operator: match as "*" | "+",
          });
        });
      }
    }
  });

  return mathProblemList;
}

function solveMathProblem(mathProblemList: MathProblem[]) {
  return mathProblemList
    .map((mathProblem) =>
      mathProblem.numberList.reduce(
        (a, b) => (mathProblem.operator === "+" ? a + b : a * b),
        mathProblem.operator === "+" ? 0 : 1,
      ),
    )
    .reduce((a, b) => a + b, 0);
}

function part1() {
  const mathProblemList = getDataPart1("./input.txt");

  const solution = solveMathProblem(mathProblemList);

  console.log("Solution:", solution);
}

function getDataPart2(fileName: string) {
  const file = readFileSync(fileName, "utf-8");

  const numberMatrix: string[][] = [];
  const mathProblemList: MathProblem[] = [];
  const transpose = <T>(matrix: T[][]) =>
    matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      const regex = /([\+\*])/g; // Add 'g' flag for global matching

      const currentMatches = Array.from(trimmedLine.matchAll(regex)).map(
        (m) => m[1],
      );
      const isOperatorList = currentMatches.length > 0;
      if (!isOperatorList) {
        numberMatrix.push(line.split(""));
      } else {
        const transposedNumberMatrix = transpose(numberMatrix);
        const numberListList: number[][] = [];
        let numberListIndex = 0;
        transposedNumberMatrix.forEach((numberToBe) => {
          const isEmptyLine = numberToBe.every((char) => char === " ");
          if (isEmptyLine) {
            numberListIndex++;
            return;
          }

          const num = Number(numberToBe.join("").trim());
          if (numberListList.length === numberListIndex) {
            numberListList.push([num]);
          } else {
            numberListList[numberListIndex].push(num);
          }
        });
        currentMatches.forEach((match, index) => {
          mathProblemList.push({
            numberList: numberListList[index],
            operator: match as "*" | "+",
          });
        });
      }
    }
  });

  return mathProblemList;
}

function part2() {
  const mathProblemList = getDataPart2("./input.txt");

  const solution = solveMathProblem(mathProblemList);

  console.log("Solution:", solution);
}

part2();
