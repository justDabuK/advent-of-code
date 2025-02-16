import { readFileSync } from "fs";

const MONKEY = "Monkey";
const STARTING = "Starting";
const OPERATION = "Operation";
const TEST = "Test";
const IF_TRUE = "If true";
const IF_FALSE = "If false";
const MULTIPLY = "*";
const ADD = "+";
const SELF = "old";
const PLAY_ROUNDS = 20;

type Monkey = {
  itemWorryLevels: number[];
  worryOperation: (worryValue: number) => number;
  throwToWhom: (worryValue: number) => number;
  numberOfInspectedItems: number;
  divisor: number;
};

type TestData = {
  divisor: number;
  monkeyOnTrue: number;
  monkeyOnFalse: number;
};

function getData(fileName: string): Monkey[] {
  const file = readFileSync(fileName, "utf-8");

  const monkeyList: Monkey[] = [];
  let currentMonkey: Monkey;
  let testData: TestData;

  file.split(/r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("in between monkeys, will attach current one");
      monkeyList.push(currentMonkey);
    } else {
      if (trimmedLine.includes(MONKEY)) {
        currentMonkey = {
          numberOfInspectedItems: 0,
          itemWorryLevels: [],
          worryOperation: (worryValue: number) => 0,
          throwToWhom: (worryValue: number) => 0,
          divisor: 0,
        };
      } else if (trimmedLine.includes(STARTING)) {
        const itemRegex = /(\d+, )*(\d+)/;
        const matches = itemRegex.exec(trimmedLine)!;
        const numberList = matches[0]
          .split(", ")
          .map((number) => parseInt(number));

        currentMonkey.itemWorryLevels = numberList;
      } else if (trimmedLine.includes(OPERATION)) {
        const operationRegex = /Operation: new = old ([*+]) (\d+|old)/;
        const matches = operationRegex.exec(trimmedLine)!;
        const operator = matches[1];
        const rightPart = matches[2];

        if (operator === MULTIPLY) {
          if (rightPart === SELF) {
            currentMonkey.worryOperation = (worryValue: number) =>
              worryValue * worryValue;
          } else {
            const rightPartNumber = parseInt(matches[2]);
            currentMonkey.worryOperation = (worryValue: number) =>
              worryValue * rightPartNumber;
          }
        } else if (operator === ADD) {
          if (rightPart === SELF) {
            currentMonkey.worryOperation = (worryValue: number) =>
              worryValue + worryValue;
          } else {
            const rightPartNumber = parseInt(matches[2]);
            currentMonkey.worryOperation = (worryValue: number) =>
              worryValue + rightPartNumber;
          }
        } else {
          throw `What kind of operation should ${operator} even be?`;
        }
      } else if (trimmedLine.includes(TEST)) {
        const numberRegex = /(\d+)/;
        const matches = numberRegex.exec(trimmedLine)!;

        let divisor = parseInt(matches[1]);
        testData = {
          divisor,
          monkeyOnTrue: 0,
          monkeyOnFalse: 0,
        };
        currentMonkey.divisor = divisor;
      } else if (trimmedLine.includes(IF_TRUE)) {
        const numberRegex = /(\d+)/;
        const matches = numberRegex.exec(trimmedLine)!;

        testData.monkeyOnTrue = parseInt(matches[1]);
      } else if (trimmedLine.includes(IF_FALSE)) {
        const numberRegex = /(\d+)/;
        const matches = numberRegex.exec(trimmedLine)!;

        testData.monkeyOnFalse = parseInt(matches[1]);
        const localTestData = { ...testData };

        currentMonkey.throwToWhom = (worryValue: number) =>
          worryValue % localTestData.divisor === 0
            ? localTestData.monkeyOnTrue
            : localTestData.monkeyOnFalse;
      } else {
        throw `what kind of trickery is this: ${trimmedLine}`;
      }
    }
  });

  return monkeyList;
}

function relieveOperation(worryLevel: number): number {
  return Math.floor(worryLevel / 3);
}

function letMonkeysPlayPart1(monkeyList: Monkey[]) {
  for (let round = 0; round < PLAY_ROUNDS; round++) {
    // for every monkey
    for (let monkeyIndex = 0; monkeyIndex < monkeyList.length; monkeyIndex++) {
      const currentMonkey = monkeyList[monkeyIndex];
      // increase number of inspected items by items to inspect
      currentMonkey.numberOfInspectedItems +=
        currentMonkey.itemWorryLevels.length;

      // play with items and relieve on bored
      currentMonkey.itemWorryLevels = currentMonkey.itemWorryLevels
        .map(currentMonkey.worryOperation)
        .map(relieveOperation);
      // decide where to throw which item
      const throwToMonkeyList = currentMonkey.itemWorryLevels.map(
        currentMonkey.throwToWhom,
      );

      // throw them to the specific monkeys
      throwToMonkeyList.forEach((receivingMonkey: number) =>
        monkeyList[receivingMonkey].itemWorryLevels.push(
          currentMonkey.itemWorryLevels.shift()!,
        ),
      );
    }
  }
}

function printMonkeyBusiness(monkeyList: Monkey[]) {
  const monkeyItemInteractionList = monkeyList.map(
    (monkey) => monkey.numberOfInspectedItems,
  );
  const highestMonkey = Math.max(...monkeyItemInteractionList);
  // pop highest and repeat for second highest
  monkeyItemInteractionList.splice(
    monkeyItemInteractionList.indexOf(highestMonkey),
    1,
  );
  const secondHighest = Math.max(...monkeyItemInteractionList);
  const monkeyBusiness = highestMonkey * secondHighest;
  console.log(`${highestMonkey} * ${secondHighest} = ${monkeyBusiness}`);
}

function part1() {
  const monkeyList = getData("./2022/11/input.txt");
  letMonkeysPlayPart1(monkeyList);
  printMonkeyBusiness(monkeyList);
}

function relieveOperationPart2(worryLevel: number, divisor: number) {
  return worryLevel % divisor;
}

function allNumbersEqual(numberList: number[]): boolean {
  return numberList.every((entry) => entry === numberList[0]);
}

function getLeastCommonMultiple(numbersOfInterest: number[]): number {
  const possibleLCM = [...numbersOfInterest];
  while (!allNumbersEqual(possibleLCM)) {
    const currentMinimum = Math.min(...possibleLCM);
    const minimumIndex = possibleLCM.indexOf(currentMinimum)!;
    possibleLCM[minimumIndex] += numbersOfInterest[minimumIndex];
  }

  return possibleLCM[0];
}

function letMonkeysPlayPart2(monkeyList: Monkey[]) {
  const leastCommonMultiple = getLeastCommonMultiple(
    monkeyList.map((monkey) => monkey.divisor),
  );

  for (let round = 0; round < 10000; round++) {
    // for every monkey
    for (let monkeyIndex = 0; monkeyIndex < monkeyList.length; monkeyIndex++) {
      const currentMonkey = monkeyList[monkeyIndex];
      // increase number of inspected items by items to inspect
      currentMonkey.numberOfInspectedItems +=
        currentMonkey.itemWorryLevels.length;

      // play with items and relieve on bored
      currentMonkey.itemWorryLevels = currentMonkey.itemWorryLevels
        .map(currentMonkey.worryOperation)
        .map((worryLevel) =>
          relieveOperationPart2(worryLevel, leastCommonMultiple),
        );
      // decide where to throw which item
      const throwToMonkeyList = currentMonkey.itemWorryLevels.map(
        currentMonkey.throwToWhom,
      );

      // throw them to the specific monkeys
      throwToMonkeyList.forEach((receivingMonkey: number) =>
        monkeyList[receivingMonkey].itemWorryLevels.push(
          currentMonkey.itemWorryLevels.shift()!,
        ),
      );
    }

    if (
      [
        1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
      ].includes(round + 1)
    ) {
      console.log(`=== After round ${round} ===`);
      monkeyList.forEach((monkey, index) => {
        console.log(
          `Monkey ${index} inspected ${monkey.numberOfInspectedItems} times`,
        );
      });
      console.log("");
    }
  }
}

function part2() {
  const monkeyList = getData("./2022/11/input.txt");
  letMonkeysPlayPart2(monkeyList);
  printMonkeyBusiness(monkeyList);
}

part2();
