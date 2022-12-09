import { readFileSync } from 'fs';

type Command = {
  direction: string;
  steps: number;
};
function getData(fileName: string): Command[] {
  const file = readFileSync(fileName, 'utf-8');

  const commandList: Command[] = [];

  file.split(/r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log('reached the end');
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

function runCommandList(commandList: Command[]) {
  const headPosition = { x: 0, y: 0 };
  const tailPosition = { x: 0, y: 0 };
  const visitedPlaces = [`${tailPosition.x}|${tailPosition.y}`];
  commandList.forEach((command) =>
    applyCommand(command, visitedPlaces, headPosition, tailPosition)
  );
  return Array.from(new Set(visitedPlaces));
}

function applyCommand(
  command: Command,
  visitedPlaces: string[],
  headPosition: Vector,
  tailPosition: Vector
) {
  for (let i = 0; i < command.steps; i++) {
    switch (command.direction) {
      case 'R':
        headPosition.x++;
        break;
      case 'L':
        headPosition.x--;
        break;
      case 'U':
        headPosition.y++;
        break;
      case 'D':
        headPosition.y--;
        break;
      default:
        throw `Unknown command ${command.direction}`;
    }
    // need to move tail?
    if (headTailDistance(headPosition, tailPosition) >= 2) {
      // move tail one step closer to tail
      const directionVector = getHeadTailVector(headPosition, tailPosition);
      tailPosition.x += directionVector.x;
      tailPosition.y += directionVector.y;
    }
    visitedPlaces.push(`${tailPosition.x}|${tailPosition.y}`);
  }
}

function getHeadTailVector(headPosition: Vector, tailPosition: Vector): Vector {
  const deltaX = headPosition.x - tailPosition.x;
  const deltaY = headPosition.y - tailPosition.y;
  return {
    x: deltaX !== 0 ? deltaX / Math.abs(deltaX) : deltaX,
    y: deltaY !== 0 ? deltaY / Math.abs(deltaY) : deltaY,
  };
}

function headTailDistance(headPosition: Vector, tailPosition: Vector): number {
  return Math.sqrt(
    (tailPosition.y - headPosition.y) ** 2 +
      (tailPosition.x - headPosition.x) ** 2
  );
}

function part1() {
  const commandList = getData('./2022/09/input.txt');
  const visitedPlaces = runCommandList(commandList);
  // console.log(visitedPlaces);
  console.log(`number of visited places ${visitedPlaces.length}`);
}

part1();
