import { readFileSync } from "fs";

type PacketPair = {
  leftSide: any[];
  rightSide: any[];
};

function getData(fileName: string): PacketPair[] {
  const file = readFileSync(fileName, "utf-8");

  const pairList: PacketPair[] = [];

  let currentPair: PacketPair = {
    leftSide: [],
    rightSide: [],
  };

  let leftSideWritten = false;

  file.split(/r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
      leftSideWritten = false;
      pairList.push(currentPair);
      currentPair = {
        leftSide: [],
        rightSide: [],
      };
    } else {
      if (!leftSideWritten) {
        currentPair.leftSide = JSON.parse(trimmedLine);
        leftSideWritten = true;
      } else {
        currentPair.rightSide = JSON.parse(trimmedLine);
      }
    }
  });

  return pairList;
}

const CORRECT = -1;
const INCORRECT = 1;
const CONTINUE = 0;

function compareArrays(left: any[], right: any[]): number {
  const smallerLength = Math.min(left.length, right.length);

  for (let j = 0; j < smallerLength; j++) {
    let subLeft = left[j];
    let subRight = right[j];
    if (!Array.isArray(subLeft) && !Array.isArray(subRight)) {
      if (subLeft < subRight) {
        return CORRECT;
      } else if (subLeft > subRight) {
        return INCORRECT;
      }
    } else if (Array.isArray(subLeft) && Array.isArray(subRight)) {
      const result = compareArrays(subLeft, subRight);
      if (result === CORRECT || result === INCORRECT) {
        return result;
      }
    } else {
      if (Array.isArray(subLeft)) {
        const result = compareArrays(subLeft, [subRight]);
        if (result === CORRECT || result === INCORRECT) {
          return result;
        }
      } else {
        const result = compareArrays([subLeft], subRight);
        if (result === CORRECT || result === INCORRECT) {
          return result;
        }
      }
    }
  }

  if (left.length < right.length) {
    return CORRECT;
  } else if (left.length > right.length) {
    return INCORRECT;
  } else {
    return CONTINUE;
  }
}
function isCorrectOrder(pair: PacketPair): boolean {
  const result = compareArrays(pair.leftSide, pair.rightSide);
  return result !== INCORRECT;
}

function getOrderedSum(pairList: PacketPair[]) {
  let sum = 0;

  pairList.forEach((pair, index) => {
    if (isCorrectOrder(pair)) {
      sum += index + 1;
    }
  });

  return sum;
}

function part1() {
  const pairList = getData("./2022/13/input.txt");
  const sum = getOrderedSum(pairList);
  console.log(`sum of correct indices = ${sum}`);
}

function getDecoderKey(packetList: any[][]) {
  let dividerIndex1 = 0;
  let dividerIndex2 = 0;

  const divider1String = JSON.stringify([[2]]);
  const divider2String = JSON.stringify([[6]]);

  packetList.forEach((entry, index) => {
    const entryString = JSON.stringify(entry);
    if (entryString === divider1String) {
      dividerIndex1 = index + 1;
    }
    if (entryString === divider2String) {
      dividerIndex2 = index + 1;
    }
  });

  return dividerIndex1 * dividerIndex2;
}

function part2() {
  const pairList = getData("./2022/13/input.txt");
  const packetList = pairList.flatMap((pair) => [
    pair.leftSide,
    pair.rightSide,
  ]);
  packetList.push([[2]]);
  packetList.push([[6]]);
  packetList.sort(compareArrays);
  const decoderKey = getDecoderKey(packetList);
  console.log(`key: ${decoderKey}`);
}

part2();
