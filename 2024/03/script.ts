import { readFileSync } from "fs";

function getData(fileName: string): number[][] {
  const file = readFileSync(fileName, "utf-8");

  const numberListList: number[][] = [];

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      const extractNumberRegex = /mul\((\d+),(\d+)\)/g;
      let regExpMatchArray = extractNumberRegex.exec(trimmedLine);
      while (regExpMatchArray !== null) {
        numberListList.push([
          parseInt(regExpMatchArray[1]),
          parseInt(regExpMatchArray[2]),
        ]);
        console.log(regExpMatchArray);
        regExpMatchArray = extractNumberRegex.exec(trimmedLine);
      }
    }
  });

  return numberListList;
}

function part1() {
  const data = getData("input.txt");
  console.table(data);
  const multipliedData = data.map((numbers) =>
    numbers.reduce((acc, number) => acc * number, 1),
  );
  console.table(multipliedData);
  const sum = multipliedData.reduce((acc, number) => acc + number, 0);
  console.log("Multiplication sum: ", sum);
}

function getEnhancedData(fileName: string): number[][] {
  const file = readFileSync(fileName, "utf-8");

  const numberListList: number[][] = [];

  const isDo = (line: string) => line.includes("do()");
  const isDont = (line: string) => line.includes("don't()");
  let isAvoidingInstructions = false;

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      const extractNumberRegex = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;
      let regExpMatchArray = extractNumberRegex.exec(trimmedLine);
      while (regExpMatchArray !== null) {
        if (isDo(regExpMatchArray[0])) {
          isAvoidingInstructions = false;
        } else if (isDont(regExpMatchArray[0])) {
          isAvoidingInstructions = true;
        } else if (!isAvoidingInstructions) {
          numberListList.push([
            parseInt(regExpMatchArray[1]),
            parseInt(regExpMatchArray[2]),
          ]);
        }
        regExpMatchArray = extractNumberRegex.exec(trimmedLine);
      }
    }
  });

  return numberListList;
}

function part2() {
  const data = getEnhancedData("input.txt");
  console.table(data);
  const multipliedData = data.map((numbers) =>
    numbers.reduce((acc, number) => acc * number, 1),
  );
  console.table(multipliedData);
  const sum = multipliedData.reduce((acc, number) => acc + number, 0);
  console.log("Multiplication sum: ", sum);
}

part2();
