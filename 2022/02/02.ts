import {readFileSync} from "fs";

const ROCK = "A";
const PAPER = "B";
const SCISSOR = "C";
const MY_ROCK = "X";
const MY_PAPER = "Y";
const MY_SCISSOR = "Z";
const LOOSE = "X";
const DRAW = "Y";
const WIN = "Z";


function getData(fileName: string): string[][] {
    const file = readFileSync(fileName, 'utf-8');

    const shapesList: string[][] = []
    file.split(/r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if(!trimmedLine) {
            console.log("reached the end");
        } else {
            shapesList.push(trimmedLine.split(" "));
        }
    })

    return shapesList;
}

function getEncounterScore(opponentsShape: string, myShape: string): number {
    switch(myShape) {
        case MY_ROCK:
            switch (opponentsShape) {
                case ROCK:
                    return 3;
                    break;
                case PAPER:
                    return 0
                    break;
                case SCISSOR:
                    return 6;
                    break;
                default:
                    console.error(`Invalid opponentsShape ${opponentsShape}`);
                    return 0;
            }
            break;
        case MY_PAPER:
            switch (opponentsShape) {
                case ROCK:
                    return 6;
                    break;
                case PAPER:
                    return 3;
                    break;
                case SCISSOR:
                    return 0;
                    break;
                default:
                    console.error(`Invalid opponentsShape ${opponentsShape}`);
                    return 0;
            }
            break;
        case MY_SCISSOR:
            switch (opponentsShape) {
                case ROCK:
                    return 0;
                    break;
                case PAPER:
                    return 6;
                    break;
                case SCISSOR:
                    return 3;
                    break;
                default:
                    console.error(`Invalid opponentsShape ${opponentsShape}`);
                    return 0;
            }
            break;
        default:
            console.error(`Invalid myShape ${myShape}`);
            return 0;
    }
}

function getShapeScore(myShape: string): number {
    switch (myShape) {
        case MY_ROCK:
            return 1;
            break;
        case MY_PAPER:
            return 2;
            break;
        case MY_SCISSOR:
            return 3;
            break;
        default:
            console.error(`Invalid myShape ${myShape}`);
            return 0;
    }
}

function calculateScorePart1(shapeList: string[][]) {
    // first calculate the score for each round
    const scoreList = shapeList.map<number>((shapeEncounter: string[]) => {
        let opponentsShape = shapeEncounter[0];
        let myShape = shapeEncounter[1];

        let score = getEncounterScore(opponentsShape, myShape);
        score += getShapeScore(myShape)

        // console.log(`${opponentsShape} vs. ${myShape} => ${score}`);

        return score;
    })

    // then sum up all scores
    return scoreList.reduce((sum, currentValue) => sum + currentValue, 0);
}

function getMyShape(opponentShape: string, expectedOutcome: string): string {
    switch (opponentShape) {
        case ROCK:
            switch (expectedOutcome) {
                case LOOSE:
                    return SCISSOR;
                case DRAW:
                    return ROCK;
                case WIN:
                    return PAPER;
                default:
                    console.error(`Invalid expectedOutcome ${expectedOutcome}`);
                    return "";
            }
            break;
        case PAPER:
            switch (expectedOutcome) {
                case LOOSE:
                    return ROCK;
                case DRAW:
                    return PAPER;
                case WIN:
                    return SCISSOR;
                default:
                    console.error(`Invalid expectedOutcome ${expectedOutcome}`);
                    return "";
            }
            break;
        case SCISSOR:
            switch (expectedOutcome) {
                case LOOSE:
                    return PAPER;
                case DRAW:
                    return SCISSOR;
                case WIN:
                    return ROCK;
                default:
                    console.error(`Invalid expectedOutcome ${expectedOutcome}`);
                    return "";
            }
            break;
        default:
            console.error(`Invalid opponentShape ${opponentShape}`);
            return "";
    }
}

function getActualShapeScore(myShape: string): number {
    switch (myShape) {
        case ROCK:
            return 1;
            break;
        case PAPER:
            return 2;
            break;
        case SCISSOR:
            return 3;
            break;
        default:
            console.error(`Invalid myShape ${myShape}`);
            return 0;
    }
}

function getOutcomeScore(outcome: string): number {
    switch (outcome) {
        case LOOSE:
            return 0;
            break;
        case DRAW:
            return 3;
            break;
        case WIN:
            return 6;
            break;
        default:
            console.error(`Invalid outcome ${outcome}`);
            return 0;
    }
}

function calculateScorePart2(shapeList: string[][]) {
    const scoreList = shapeList.map<number>((shapeEncounter: string[]) => {
        const opponentShape = shapeEncounter[0];
        const outcome = shapeEncounter[1];
        const myShape = getMyShape(opponentShape, outcome);

        const score = getActualShapeScore(myShape) + getOutcomeScore(outcome);

        // console.log(`${opponentShape} - ${outcome} -> ${myShape} => ${score}`);

        return score;
    })

    return scoreList.reduce((sum, currentValue) => sum + currentValue, 0);
}

const shapeList = getData('./2022/02/input.txt');
// console.log(shapeList);
// const finalScore = calculateScorePart1(shapeList);
// console.log(`final score part 1: ${finalScore}`);
const finalScorePart2 = calculateScorePart2(shapeList);
console.log(`final score part 2: ${finalScorePart2}`);
