import { readFileSync } from "fs";

type BallGame = {
  id: number;
  maxRed: number;
  maxBlue: number;
  maxGreen: number;
  originalLine: string;
};

function getData(fileName: string): BallGame[] {
  const file = readFileSync(fileName, "utf-8");

  const gameList: BallGame[] = [];

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      const splitGameAndBalls = trimmedLine.split(":");
      const gameIdRegExMathArray = splitGameAndBalls[0].trim().match(/(\d+)/g);
      const gameId = parseInt(
        gameIdRegExMathArray ? gameIdRegExMathArray[0] : "0",
      );
      const ballDrawList = splitGameAndBalls[1].trim().split(";");
      let maxRed = 0;
      let maxBlue = 0;
      let maxGreen = 0;
      ballDrawList.forEach((ballDraw: string) => {
        const ballTupleList = ballDraw.trim().split(",");
        ballTupleList.forEach((ballTuple: string) => {
          const numberOfBallsRegExMatchArray = ballTuple.trim().match(/(\d+)/g);
          const numberOfBalls = parseInt(
            numberOfBallsRegExMatchArray
              ? numberOfBallsRegExMatchArray[0]
              : "0",
          );
          if (ballTuple.includes("red")) {
            maxRed = Math.max(maxRed, numberOfBalls);
          } else if (ballTuple.includes("blue")) {
            maxBlue = Math.max(maxBlue, numberOfBalls);
          } else if (ballTuple.includes("green")) {
            maxGreen = Math.max(maxGreen, numberOfBalls);
          }
        });
      });

      gameList.push({
        id: gameId,
        maxRed: maxRed,
        maxBlue: maxBlue,
        maxGreen: maxGreen,
        originalLine: trimmedLine,
      });
    }
  });

  return gameList;
}

function part1() {
  const gameList = getData("2023/02/input.txt");
  const filteredGameList = gameList.filter((game: BallGame) => {
    return game.maxRed <= 12 && game.maxBlue <= 14 && game.maxGreen <= 13;
  });
  const idSum = filteredGameList.reduce(
    (acc: number, game: BallGame) => acc + game.id,
    0,
  );
  console.log(idSum);
}

function toPowerOfSet(game: BallGame): number {
  return game.maxRed * game.maxBlue * game.maxGreen;
}

function part2() {
  const gameList = getData("2023/02/input.txt");
  const powerOfSets = gameList
    .map(toPowerOfSet)
    .reduce((acc: number, value: number) => acc + value, 0);
  console.log(powerOfSets);
}

part2();
