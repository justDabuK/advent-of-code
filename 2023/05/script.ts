import { readFileSync } from "fs";

enum DataMode {
  seeds,
  seedToSoilMap,
  soilToFertilizerMap,
  fertilizterToWaterMap,
  waterToLightMap,
  lightToTemperatureMap,
  temperatureToHumidityMap,
  humidityToLocationMap,
}

type RangeMap = {
  sourceRangeStart: bigint;
  destinationRangeStart: bigint;
  rangeLength: bigint;
};

function toRangeMap(line: string): RangeMap {
  const numberList = line.match(/\d+/g)!.map((number) => BigInt(number));
  return {
    destinationRangeStart: numberList[0],
    sourceRangeStart: numberList[1],
    rangeLength: numberList[2],
  };
}

let seedList: bigint[] = [];
let seedToSoilMap: RangeMap[] = [];
let soilToFertilizerMap: RangeMap[] = [];
let fertilizterToWaterMap: RangeMap[] = [];
let waterToLightMap: RangeMap[] = [];
let lightToTemperatureMap: RangeMap[] = [];
let temperatureToHumidityMap: RangeMap[] = [];
let humidityToLocationMap: RangeMap[] = [];

function loadDataPart1(fileName: string): void {
  const file = readFileSync(fileName, "utf-8");

  let currentMode = DataMode.seeds;

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      if (currentMode === DataMode.humidityToLocationMap) {
        console.log("reached the end");
      } else {
        currentMode++;
      }
    } else {
      if (trimmedLine.includes("map")) {
        return;
      }

      switch (currentMode) {
        case DataMode.seeds:
          seedList = trimmedLine
            .split(":")[1]
            .match(/\d+/g)!
            .map((seed) => BigInt(seed));
          break;
        case DataMode.seedToSoilMap:
          seedToSoilMap.push(toRangeMap(trimmedLine));
          break;
        case DataMode.soilToFertilizerMap:
          soilToFertilizerMap.push(toRangeMap(trimmedLine));
          break;
        case DataMode.fertilizterToWaterMap:
          fertilizterToWaterMap.push(toRangeMap(trimmedLine));
          break;
        case DataMode.waterToLightMap:
          waterToLightMap.push(toRangeMap(trimmedLine));
          break;
        case DataMode.lightToTemperatureMap:
          lightToTemperatureMap.push(toRangeMap(trimmedLine));
          break;
        case DataMode.temperatureToHumidityMap:
          temperatureToHumidityMap.push(toRangeMap(trimmedLine));
          break;
        case DataMode.humidityToLocationMap:
          humidityToLocationMap.push(toRangeMap(trimmedLine));
          break;
      }
    }
  });
}

function mapValueToRange(value: bigint, rangeMap: RangeMap[]): bigint {
  let result = value;
  rangeMap.forEach((range) => {
    if (
      value >= range.sourceRangeStart &&
      value < range.sourceRangeStart + range.rangeLength
    ) {
      result = range.destinationRangeStart + (value - range.sourceRangeStart);
    }
  });
  return result;
}

function toLoacationList(seedList: bigint[]): bigint[] {
  return seedList
    .map((seed) => mapValueToRange(seed, seedToSoilMap))
    .map((soil) => mapValueToRange(soil, soilToFertilizerMap))
    .map((fertilizer) => mapValueToRange(fertilizer, fertilizterToWaterMap))
    .map((water) => mapValueToRange(water, waterToLightMap))
    .map((light) => mapValueToRange(light, lightToTemperatureMap))
    .map((temperature) =>
      mapValueToRange(temperature, temperatureToHumidityMap),
    )
    .map((humidity) => mapValueToRange(humidity, humidityToLocationMap));
}

function part1() {
  loadDataPart1("2023/05/input.txt");
  const locationList = toLoacationList(seedList);
  const minLocation = locationList.reduce(
    (min, location) => (location > min ? min : location),
    locationList[0],
  );
  console.log(`minLocation: ${minLocation}`);
}

type SeedPair = {
  start: bigint;
  rangeLength: bigint;
};

let seedPairList: SeedPair[] = [];

function loadDataPart2(fileName: string): void {
  const file = readFileSync(fileName, "utf-8");

  let currentMode = DataMode.seeds;

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      if (currentMode === DataMode.humidityToLocationMap) {
        console.log("reached the end");
      } else {
        currentMode++;
      }
    } else {
      if (trimmedLine.includes("map")) {
        return;
      }

      switch (currentMode) {
        case DataMode.seeds:
          seedPairList = trimmedLine
            .split(":")[1]
            .match(/\d+ \d+/g)!
            .map((pair) => {
              const numberList = pair
                .split(" ")
                .map((number) => BigInt(number));
              return {
                start: numberList[0],
                rangeLength: numberList[1],
              };
            });
          break;
        case DataMode.seedToSoilMap:
          seedToSoilMap.push(toRangeMap(trimmedLine));
          break;
        case DataMode.soilToFertilizerMap:
          soilToFertilizerMap.push(toRangeMap(trimmedLine));
          break;
        case DataMode.fertilizterToWaterMap:
          fertilizterToWaterMap.push(toRangeMap(trimmedLine));
          break;
        case DataMode.waterToLightMap:
          waterToLightMap.push(toRangeMap(trimmedLine));
          break;
        case DataMode.lightToTemperatureMap:
          lightToTemperatureMap.push(toRangeMap(trimmedLine));
          break;
        case DataMode.temperatureToHumidityMap:
          temperatureToHumidityMap.push(toRangeMap(trimmedLine));
          break;
        case DataMode.humidityToLocationMap:
          humidityToLocationMap.push(toRangeMap(trimmedLine));
          break;
      }
    }
  });
}

function part2() {
  loadDataPart2("2023/05/input.txt");
  seedList = seedPairList.flatMap((seedPair) => {
    const result: bigint[] = [];
    for (let i = BigInt(0); i < seedPair.rangeLength; i++) {
      result.push(seedPair.start + i);
    }
    return result;
  });

  const locationList = toLoacationList(seedList);
  const minLocation = locationList.reduce(
    (min, location) => (location > min ? min : location),
    locationList[0],
  );
  console.log(`minLocation: ${minLocation}`);
}

part2();
