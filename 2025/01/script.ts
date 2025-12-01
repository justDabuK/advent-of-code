import { readFileSync } from "fs";

type Instruction = {
  direction: "L" | "R";
  steps: number;
};
function getData(fileName: string): Instruction[] {
  const file = readFileSync(fileName, "utf-8");

  const instructionList: Instruction[] = [];

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      const extractNumberRegex = /([LR])(\d+)/;
      let regExpMatchArray = trimmedLine.match(extractNumberRegex);
      if (regExpMatchArray) {
        instructionList.push({
          direction: regExpMatchArray[1] as "L" | "R",
          steps: parseInt(regExpMatchArray[2], 10),
        });
      }
    }
  });

  return instructionList;
}

function part1() {
  console.group("Part 1");
  const instructionList = getData("./input.txt");

  let dialState = 50; // dial starts at 50
  let zeroPositionCount = 0;
  for (const instruction of instructionList) {
    if (instruction.direction === "L") {
      dialState -= instruction.steps;
    } else {
      dialState += instruction.steps;
    }
    if (dialState < 0) {
      dialState %= 100;
      dialState += 100;
    }
    if (dialState > 99) {
      dialState %= 100;
    }

    if (dialState === 0) {
      zeroPositionCount++;
    }
  }

  console.log("zero position count: ", zeroPositionCount);
  console.groupEnd();
}

function part2() {
  console.group("Part 1");
  const instructionList = getData("./input.txt");

  let dialState = 50; // dial starts at 50
  let zeroPositionCount = 0;
  for (const instruction of instructionList) {
    for (let _ = 0; _ < instruction.steps; _++) {
      if (instruction.direction === "L") {
        dialState -= 1;
      } else {
        dialState += 1;
      }
      if (dialState < 0) {
        dialState += 100;
      }
      if (dialState > 99) {
        dialState %= 100;
      }
      if (dialState === 0) {
        zeroPositionCount++;
      }
    }
  }

  console.log("zero position count: ", zeroPositionCount);
  console.groupEnd();
}

part2();
