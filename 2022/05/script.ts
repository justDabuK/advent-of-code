import { readFileSync } from "fs";

type RearrangeCommand = {
  amount: number;
  from: number;
  to: number;
};

type Supplies = {
  stackList: string[][];
  commands: RearrangeCommand[];
};

function getData(fileName: string): Supplies {
  const file = readFileSync(fileName, "utf-8");

  let stackList: string[][];
  if (fileName === "./2022/05/test-input.txt") {
    stackList = [["Z", "N"], ["M", "C", "D"], ["P"]];
  } else {
    stackList = [
      ["N", "D", "M", "Q", "B", "P", "Z"],
      ["C", "L", "Z", "Q", "M", "D", "H", "V"],
      ["Q", "H", "R", "D", "V", "F", "Z", "G"],
      ["H", "G", "D", "F", "N"],
      ["N", "F", "Q"],
      ["D", "Q", "V", "Z", "F", "B", "T"],
      ["Q", "M", "T", "Z", "D", "V", "S", "H"],
      ["M", "G", "F", "P", "N", "Q"],
      ["B", "W", "R", "M"],
    ];
  }

  const commands: RearrangeCommand[] = [];
  let isReadingCrates = true;
  file.split(/r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      if (isReadingCrates) {
        console.log("found empty line. Will switch to read-commands-mode");
      } else {
        console.log("reached end");
      }
      isReadingCrates = false;
    } else {
      if (!isReadingCrates) {
        const extractCleanupSectionRegex = /move (\d+) from (\d+) to (\d+)/;
        const regexMatches = extractCleanupSectionRegex.exec(line)!;
        let command = {
          amount: parseInt(regexMatches[1]),
          from: parseInt(regexMatches[2]),
          to: parseInt(regexMatches[3]),
        };
        commands.push(command);
      }
    }
  });

  return { stackList, commands };
}

function applyCommand(stackList: string[][], command: RearrangeCommand) {
  const fromContainer = stackList[command.from - 1];
  const toContainer = stackList[command.to - 1];

  for (let i = 0; i < command.amount; i++) {
    const movedCrate = fromContainer.pop();
    if (movedCrate) {
      toContainer.push(movedCrate);
    }
  }
}

function applyAllCommands(
  supplies: Supplies,
  commandConsumer: (stackList: string[][], command: RearrangeCommand) => void
) {
  supplies.commands.forEach((command) =>
    commandConsumer(supplies.stackList, command)
  );
}

function getResultingWord(stackList: string[][]) {
  let word = "";

  stackList.forEach((stack) => {
    const lastCrate = stack[stack.length - 1];
    word = word.concat(lastCrate);
  });

  return word;
}

function part1() {
  const supplies = getData("./2022/05/test-input.txt");
  applyAllCommands(supplies, applyCommand);
  const resultingWord = getResultingWord(supplies.stackList);
  console.log(`resulting word: ${resultingWord}`);
}

function applyCommand9001(stackList: string[][], command: RearrangeCommand) {
  const sliceIndex = stackList[command.from - 1].length - command.amount;
  stackList[command.to - 1] = stackList[command.to - 1].concat(
    stackList[command.from - 1].slice(sliceIndex)
  );
  stackList[command.from - 1] = stackList[command.from - 1].slice(
    0,
    sliceIndex
  );
}

function part2() {
  const supplies = getData("./2022/05/input.txt");
  applyAllCommands(supplies, applyCommand9001);
  const resultingWord = getResultingWord(supplies.stackList);
  console.log(`resulting word: ${resultingWord}`);
}

part2();
