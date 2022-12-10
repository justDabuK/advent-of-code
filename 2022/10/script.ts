import { readFileSync } from 'fs';

const NOOP = 'noop';

type Instruction = {
  command: string;
  value?: number;
};

function getData(fileName: string): Instruction[] {
  const file = readFileSync(fileName, 'utf-8');

  const commandList: Instruction[] = [];

  file.split(/r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log('reached the end');
    } else {
      if (trimmedLine.includes(NOOP)) {
        commandList.push({
          command: NOOP,
        });
      } else {
        const addInstructionRegex = /(.+) (-?\d+)?/;
        const matchingResult = addInstructionRegex.exec(trimmedLine)!;
        commandList.push({
          command: matchingResult[1],
          value: parseInt(matchingResult[2]),
        });
      }
    }
  });

  return commandList;
}

function isInterestingSignalStrength(cycleCount: number): boolean {
  return cycleCount === 20 || cycleCount % 40 === 20;
}

function runInstructions(instructionList: Instruction[]): number {
  let xRegister = 1;
  let cycleCount = 0;
  let interestingSignalStrengthSum = 0;

  instructionList.forEach((instruction) => {
    cycleCount++;
    if (isInterestingSignalStrength(cycleCount)) {
      let interestingStrength = cycleCount * xRegister;
      interestingSignalStrengthSum += interestingStrength;
      console.log(
        `${cycleCount} : interesting cycle ${cycleCount} current x ${xRegister} = ${interestingStrength} => ${interestingSignalStrengthSum}`
      );
    }

    if (instruction.command == NOOP) {
      // do nothing except for increasing the cycle count
    } else {
      // in the second cycle execute instruction
      cycleCount++;

      if (isInterestingSignalStrength(cycleCount)) {
        let interestingStrength = cycleCount * xRegister;
        interestingSignalStrengthSum += interestingStrength;
        console.log(
          `${cycleCount} : interesting cycle ${cycleCount} current x ${xRegister} = ${interestingStrength} => ${interestingSignalStrengthSum}`
        );
      }
      if (instruction.value) {
        // console.log(`${cycleCount} : ${xRegister} += ${instruction.value}`);
        xRegister += instruction.value;
      }
    }
    // check it at the end of each cycle (which is also the start of a new cycle)
  });

  return interestingSignalStrengthSum;
}

function part1() {
  const instructionList = getData('./2022/10/input.txt');
  const summedInterestingSignalStrengths = runInstructions(instructionList);
  console.log(summedInterestingSignalStrengths);
}

function runScreenInstructions(instructionList: Instruction[]): void {
  let lowerBound = 0;
  let xRegister = 1;
  let upperBound = 2;
  let cycleCount = 0;
  let crt = -1;

  let currentLine = '';
  let pixel = '.';

  instructionList.forEach((instruction) => {
    cycleCount++;
    crt++;
    pixel = crt >= lowerBound && crt <= upperBound ? '#' : '.';
    currentLine = currentLine.concat(pixel);

    if (currentLine.length === 40) {
      console.log(currentLine);
      currentLine = '';
      crt = -1;
    }
    if (instruction.command == NOOP) {
      // do nothing except for increasing the cycle count
    } else {
      // in the second cycle execute instruction
      cycleCount++;
      crt++;
      pixel = crt >= lowerBound && crt <= upperBound ? '#' : '.';
      currentLine = currentLine.concat(pixel);
      if (currentLine.length === 40) {
        console.log(currentLine);
        currentLine = '';
        crt = -1;
      }

      if (instruction.value) {
        // console.log(`${cycleCount} : ${xRegister} += ${instruction.value}`);
        xRegister += instruction.value;
        lowerBound = xRegister - 1;
        upperBound = xRegister + 1;
      }
    }
    // check it at the end of each cycle (which is also the start of a new cycle)
  });
}

function part2() {
  const instructionList = getData('./2022/10/input.txt');
  runScreenInstructions(instructionList);
}

part2();
