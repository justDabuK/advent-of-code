import { readFileSync } from "fs";

type RaceRecord = {
  raceTime: number;
  recordDistance: number;
};
function getData(fileName: string): RaceRecord[] {
  const file = readFileSync(fileName, "utf-8");

  let raceTimeList: number[] = [];
  let recordDistanceList: number[] = [];

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      if (trimmedLine.includes("Time")) {
        raceTimeList = trimmedLine
          .split(":")[1]
          .match(/\d+/g)!
          .map((numberAsString) => parseInt(numberAsString));
      } else if (trimmedLine.includes("Distance")) {
        recordDistanceList = trimmedLine
          .split(":")[1]
          .match(/\d+/g)!
          .map((numberAsString) => parseInt(numberAsString));
      } else {
        console.log("unknown line: " + trimmedLine);
      }
    }
  });

  const raceRecordList: RaceRecord[] = [];

  for (let i = 0; i < raceTimeList.length; i++) {
    raceRecordList.push({
      raceTime: raceTimeList[i],
      recordDistance: recordDistanceList[i],
    });
  }

  return raceRecordList;
}

type PossibleOutcome = {
  holdTime: number;
  distance: number;
};

function getLongerPossibleOutcomes(raceRecord: RaceRecord): PossibleOutcome[] {
  let possibleOutcomeList: PossibleOutcome[] = [];
  for (let i = 0; i < raceRecord.raceTime; i++) {
    let distance = i * (raceRecord.raceTime - i);
    if (distance > raceRecord.recordDistance) {
      possibleOutcomeList.push({
        holdTime: i,
        distance: distance,
      });
    }
  }
  return possibleOutcomeList;
}

function part1() {
  const raceRecordList = getData("./2023/06/input.txt");
  const multipliedRecordBeatNumbers = raceRecordList
    .map((raceRecord) => getLongerPossibleOutcomes(raceRecord).length)
    .reduce((multiplier, value) => multiplier * value, 1);
  console.log(multipliedRecordBeatNumbers);
}

function getDataPart2(fileName: string): RaceRecord {
  const file = readFileSync(fileName, "utf-8");

  let raceTime: number = 0;
  let recordDistance: number = 0;

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      if (trimmedLine.includes("Time")) {
        const numberSide = trimmedLine.split(":")[1];
        const numberList = numberSide.split(" ").filter((number) => number);
        const singleNumber = numberList.join("");
        raceTime = parseInt(singleNumber);
      } else if (trimmedLine.includes("Distance")) {
        const numberSide = trimmedLine.split(":")[1];
        const numberList = numberSide.split(" ").filter((number) => number);
        const singleNumber = numberList.join("");
        recordDistance = parseInt(singleNumber);
      } else {
        console.log("unknown line: " + trimmedLine);
      }
    }
  });

  return {
    raceTime,
    recordDistance,
  };
}

function part2() {
  const raceRecord = getDataPart2("./2023/06/input.txt");
  console.table(raceRecord);
  const possibleWaysOfWinning = getLongerPossibleOutcomes(raceRecord).length;
  console.log(possibleWaysOfWinning);
}

part2();
