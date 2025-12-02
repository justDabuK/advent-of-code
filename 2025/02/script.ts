import { readFileSync } from "fs";

type IdRange = {
  start: number;
  end: number;
};
function getData(fileName: string): IdRange[] {
  const file = readFileSync(fileName, "utf-8");

  const idRangeList: IdRange[] = [];

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      trimmedLine.split(",").forEach((rawRange: string) => {
        const [start, end] = rawRange.split("-").map(Number);
        idRangeList.push({ start, end });
      });
    }
  });

  return idRangeList;
}

function isInvalidId(id: number) {
  const idAsString = id.toString();
  if (idAsString.length <= 1 || idAsString.length % 2 !== 0) {
    return false;
  }
  const firstHalf = idAsString.slice(0, idAsString.length / 2);
  const secondHalf = idAsString.slice(idAsString.length / 2);
  return firstHalf === secondHalf;
}

function part1() {
  console.group("Part 1");
  const idRangeList = getData("./input.txt");
  const invalidIds: number[] = idRangeList.reduce<number[]>(
    (list, currentRange) => {
      const tempList: number[] = [];
      for (let id = currentRange.start; id <= currentRange.end + 1; id++) {
        if (isInvalidId(id)) {
          tempList.push(id);
        }
      }
      return list.concat(tempList);
    },
    [],
  );
  console.log("Invalid IDs:", invalidIds);
  console.log(
    "Invalid ID sum:",
    invalidIds.reduce((a, b) => a + b, 0),
  );
  console.groupEnd();
}

const debug = false;
function isInvalidIdEnhanced(id: number) {
  if (debug) console.group(id);
  const idAsString = id.toString();
  if (idAsString.length <= 1) {
    return false;
  }
  if (debug) console.log("idAsString.length", idAsString.length);
  const substringMaxLength = Math.floor(idAsString.length / 2);
  if (debug) console.log("substringMaxLength", substringMaxLength);
  for (
    let subStringLength = substringMaxLength;
    subStringLength >= 1;
    subStringLength--
  ) {
    const wouldDivideEvenly = idAsString.length % subStringLength === 0;
    if (debug) console.log("wouldDivideEvenly", wouldDivideEvenly);
    if (!wouldDivideEvenly) {
      continue;
    }
    if (debug) console.group("subStringLength: ", subStringLength);
    const subStringList: string[] = [];
    for (
      let sliceStart = 0;
      sliceStart <= idAsString.length - 1;
      sliceStart += subStringLength
    ) {
      if (debug) console.group("sliceStart: ", sliceStart);
      let sliceEnd = Math.min(sliceStart + subStringLength, idAsString.length);
      if (debug) console.log("slice end", sliceEnd);
      let slice = idAsString.slice(sliceStart, sliceEnd);
      if (debug) console.log("slice", slice);
      subStringList.push(slice);
      if (debug) console.groupEnd();
    }
    if (debug) console.log("subStringList", subStringList);
    const allEqualLength = subStringList.every(
      (subStr) => subStr.length === subStringList[0].length,
    );
    if (debug) console.log("allEqualLength", allEqualLength);
    const allEqual = subStringList.every(
      (subStr) => subStr === subStringList[0],
    );
    if (debug) console.groupEnd();
    if (allEqual && allEqualLength && subStringList.length > 1) {
      if (debug) console.groupEnd();
      return true;
    }
  }
  if (debug) console.groupEnd();
  return false;
}

function part2() {
  console.group("Part 2");
  const idRangeList = getData("./input.txt");

  const invalidIds: number[] = idRangeList.reduce<number[]>(
    (list, currentRange) => {
      const tempList: number[] = [];
      for (let id = currentRange.start; id <= currentRange.end; id++) {
        if (isInvalidIdEnhanced(id)) {
          tempList.push(id);
        }
      }
      return list.concat(tempList);
    },
    [],
  );

  console.log("Invalid IDs:", invalidIds);
  console.log("# of Invalid IDs:", invalidIds.length);
  const uniqueInvalidIds = Array.from(new Set(invalidIds));
  console.log("# of unique Invalid IDs:", uniqueInvalidIds.length);
  console.log(
    "unique Invalid ID sum:",
    uniqueInvalidIds.reduce((a, b) => a + b, 0),
  );
  console.groupEnd();
}

part2();
