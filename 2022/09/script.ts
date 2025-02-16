import { readFileSync } from "fs";

type Command = {
  direction: string;
  steps: number;
};
function getData(fileName: string): Command[] {
  const file = readFileSync(fileName, "utf-8");

  const commandList: Command[] = [];

  file.split(/r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      const commandRegex = /(.) (\d+)/;
      const matchingResult = commandRegex.exec(trimmedLine)!;
      commandList.push({
        direction: matchingResult[1],
        steps: parseInt(matchingResult[2]),
      });
    }
  });

  return commandList;
}

type Vector = {
  x: number;
  y: number;
};

function runCommandList(commandList: Command[], knotCount = 2) {
  const rope: Vector[] = [];

  for (let i = 0; i < knotCount; i++) {
    rope.push({
      x: 0,
      y: 0,
    });
  }

  const visitedPlaces = ["0|0"];
  commandList.forEach((command) => applyCommand(command, visitedPlaces, rope));
  return Array.from(new Set(visitedPlaces));
}

function applyCommand(
  command: Command,
  visitedPlaces: string[],
  rope: Vector[],
) {
  const head = 0;
  const tail = rope.length - 1;
  for (let i = 0; i < command.steps; i++) {
    switch (command.direction) {
      case "R":
        rope[head].x++;
        break;
      case "L":
        rope[head].x--;
        break;
      case "U":
        rope[head].y++;
        break;
      case "D":
        rope[head].y--;
        break;
      default:
        throw `Unknown command ${command.direction}`;
    }
    // need to move tail?
    for (let i = 1; i < rope.length; i++) {
      const formerKnot = rope[i - 1];
      const currentKnot = rope[i];
      if (getDistance(formerKnot, currentKnot) >= 2) {
        // move tail one step closer to tail
        const directionVector = getDirectionalVector(formerKnot, currentKnot);
        currentKnot.x += directionVector.x;
        currentKnot.y += directionVector.y;
      }
    }
    visitedPlaces.push(`${rope[tail].x}|${rope[tail].y}`);
  }
}

function getDirectionalVector(
  headPosition: Vector,
  tailPosition: Vector,
): Vector {
  const deltaX = headPosition.x - tailPosition.x;
  const deltaY = headPosition.y - tailPosition.y;
  return {
    x: deltaX !== 0 ? deltaX / Math.abs(deltaX) : deltaX,
    y: deltaY !== 0 ? deltaY / Math.abs(deltaY) : deltaY,
  };
}

function getDistance(headPosition: Vector, tailPosition: Vector): number {
  return Math.sqrt(
    (tailPosition.y - headPosition.y) ** 2 +
      (tailPosition.x - headPosition.x) ** 2,
  );
}

function part1() {
  const commandList = getData("./2022/09/test-input.txt");
  const visitedPlaces = runCommandList(commandList);
  console.log(`number of visited places ${visitedPlaces.length}`);
}

function part2() {
  const commandList = getData("./2022/09/input.txt");
  const visitedPlaces = runCommandList(commandList, 10);
  console.log(`number of visited places ${visitedPlaces.length}`);
}

part2();
