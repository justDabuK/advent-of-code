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

part1();
