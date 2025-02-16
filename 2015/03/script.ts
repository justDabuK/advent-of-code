type Position = {
  x: number;
  y: number;
};

export enum Direction {
  Up = "^",
  Right = ">",
  Down = "v",
  Left = "<",
}

const directionDeltaMap = {
  [Direction.Up]: { x: 0, y: 1 },
  [Direction.Right]: { x: 1, y: 0 },
  [Direction.Down]: { x: 0, y: -1 },
  [Direction.Left]: { x: -1, y: 0 },
};

export function convertToDirectionList(input: string): Direction[] {
  return input.split("").map((char: string) => char as Direction);
}

export function deliverPresents(directionList: Direction[]): number {
  const visitedHouses: Position[] = [];

  let currentPosition: Position = { x: 0, y: 0 };

  visitedHouses.push(currentPosition);

  directionList.forEach((direction: Direction) => {
    const delta = directionDeltaMap[direction];
    currentPosition = {
      x: currentPosition.x + delta.x,
      y: currentPosition.y + delta.y,
    };
    visitedHouses.push(currentPosition);
  });

  const visitedHousesWithoutDuplicates = new Set(
    visitedHouses.map((position: Position) => `${position.x}-${position.y}`),
  );
  return visitedHousesWithoutDuplicates.size;
}

export function deliverPresentsWithRoboSanta(
  directionList: Direction[],
): number {
  const visitedHouses: Position[] = [];

  let santaPosition: Position = { x: 0, y: 0 };
  let roboSantaPosition: Position = { x: 0, y: 0 };

  visitedHouses.push(santaPosition);
  visitedHouses.push(roboSantaPosition);

  let santasTurn = true;

  directionList.forEach((direction: Direction) => {
    const delta = directionDeltaMap[direction];
    if (santasTurn) {
      santaPosition = {
        x: santaPosition.x + delta.x,
        y: santaPosition.y + delta.y,
      };
      visitedHouses.push(santaPosition);
    } else {
      roboSantaPosition = {
        x: roboSantaPosition.x + delta.x,
        y: roboSantaPosition.y + delta.y,
      };
      visitedHouses.push(roboSantaPosition);
    }
    santasTurn = !santasTurn;
  });

  const visitedHousesWithoutDuplicates = new Set(
    visitedHouses.map((position: Position) => `${position.x}-${position.y}`),
  );
  return visitedHousesWithoutDuplicates.size;
}
