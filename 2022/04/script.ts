import { readFileSync } from "fs";

type CleaningSection = {
  start: number;
  end: number;
};

type CleanupCrew = {
  firstElf: CleaningSection;
  secondElf: CleaningSection;
};

function getData(fileName: string): CleanupCrew[] {
  const file = readFileSync(fileName, "utf-8");

  const cleanupCrewList: CleanupCrew[] = [];
  file.split(/r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      const extractCleanupSectionRegex = /(\d+)-(\d+),(\d+)-(\d+)/;
      const regexMatches = extractCleanupSectionRegex.exec(trimmedLine)!;
      console.log(regexMatches);
      const cleanupCrew: CleanupCrew = {
        firstElf: {
          start: parseInt(regexMatches[1]),
          end: parseInt(regexMatches[2]),
        },
        secondElf: {
          start: parseInt(regexMatches[3]),
          end: parseInt(regexMatches[4]),
        },
      };
      cleanupCrewList.push(cleanupCrew);
    }
  });

  return cleanupCrewList;
}

function isContaining(crew: CleanupCrew): boolean {
  if (
    crew.firstElf.start <= crew.secondElf.start &&
    crew.firstElf.end >= crew.secondElf.end
  ) {
    return true;
  } else if (
    crew.firstElf.start >= crew.secondElf.start &&
    crew.firstElf.end <= crew.secondElf.end
  ) {
    return true;
  } else {
    return false;
  }
}

function part1() {
  const cleanupCrewList = getData("./2022/04/input.txt");
  const overlappingCrews = cleanupCrewList.filter(isContaining);
  console.log(`Need reassignment for ${overlappingCrews.length} pairs`);
}

function isInsideBoundaries(
  value: number,
  lowerBound: number,
  upperBound: number,
): boolean {
  return value >= lowerBound && value <= upperBound;
}

function isOverlap(crew: CleanupCrew): boolean {
  const firstElfStart = crew.firstElf.start;
  const firstElfEnd = crew.firstElf.end;
  const secondElfStart = crew.secondElf.start;
  const secondElfEnd = crew.secondElf.end;
  return (
    isInsideBoundaries(firstElfStart, secondElfStart, secondElfEnd) ||
    isInsideBoundaries(firstElfEnd, secondElfStart, secondElfEnd) ||
    isInsideBoundaries(secondElfStart, firstElfStart, firstElfEnd) ||
    isInsideBoundaries(secondElfEnd, firstElfStart, firstElfEnd)
  );
}

function part2() {
  const cleanupCrewList = getData("./2022/04/input.txt");
  const overlappingCrew = cleanupCrewList.filter(isOverlap);
  console.log(`Number of overlapping crews is ${overlappingCrew.length}`);
}

part1();
