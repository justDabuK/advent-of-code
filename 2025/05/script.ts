import { readFileSync } from "fs";

type ValidIdRange = {
  start: number;
  end: number;
};
function getData(fileName: string): {
  validIdRangeList: ValidIdRange[];
  idList: number[];
} {
  const file = readFileSync(fileName, "utf-8");

  const validIdRangeList: ValidIdRange[] = [];
  const idList: number[] = [];
  let isRegisteringIds = false;

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      if (isRegisteringIds) console.log("reached the end");
      else isRegisteringIds = true;
    } else {
      if (!isRegisteringIds) {
        const [start, end] = trimmedLine.split("-").map(Number);
        if (end < start) console.warn("END smaller than start");
        validIdRangeList.push({ start, end });
      } else {
        idList.push(Number(trimmedLine));
      }
    }
  });

  return {
    validIdRangeList: validIdRangeList,
    idList,
  };
}

function isIdValid(id: number, validIdRangeList: ValidIdRange[]): boolean {
  for (const range of validIdRangeList) {
    if (id >= range.start && id <= range.end) {
      return true;
    }
  }
  return false;
}

function part1() {
  const { validIdRangeList, idList } = getData("./input.txt");

  const freshIdList = idList.filter((id) => isIdValid(id, validIdRangeList));

  console.log("number of fresh IDs", freshIdList.length);
}

const debug = false;
function part2() {
  const { validIdRangeList } = getData("./input.txt");
  let optimizedRangeList: ValidIdRange[] = [];
  let isOptimized = false;

  if (debug) console.table(validIdRangeList);
  let initialIdRangeList: ValidIdRange[] = JSON.parse(
    JSON.stringify(validIdRangeList),
  );

  do {
    isOptimized = false;
    optimizedRangeList = [];
    initialIdRangeList.forEach((range) => {
      let foundAPlace = false;
      for (const optimizedRange of optimizedRangeList) {
        const isRangeCovered =
          range.start >= optimizedRange.start &&
          range.end <= optimizedRange.end;
        if (isRangeCovered) {
          foundAPlace = true;
        }

        const isOptimizedRangeCovered =
          optimizedRange.start >= range.start &&
          optimizedRange.end <= range.end;
        if (isOptimizedRangeCovered) {
          optimizedRange.start = range.start;
          optimizedRange.end = range.end;
          foundAPlace = true;
        }

        const isStartInRange =
          range.start >= optimizedRange.start &&
          range.start <= optimizedRange.end;
        const isEndInRange =
          range.end >= optimizedRange.start && range.end <= optimizedRange.end;

        if (isStartInRange && !isEndInRange) {
          optimizedRange.end = range.end;
          foundAPlace = true;
        }
        if (!isStartInRange && isEndInRange) {
          optimizedRange.start = range.start;
          foundAPlace = true;
        }

        // otherwise nothing to do
      }
      if (!foundAPlace) {
        optimizedRangeList.push(range);
      }
    });
    isOptimized = initialIdRangeList.length !== optimizedRangeList.length;
    if (debug) console.table(optimizedRangeList);
    initialIdRangeList = JSON.parse(JSON.stringify(optimizedRangeList));
  } while (isOptimized);

  const numberOfValidIds = optimizedRangeList
    .map((range) => range.end - range.start + 1)
    .reduce((a, b) => a + b, 0);
  console.log("number of valid IDs", numberOfValidIds);
}

part2();
