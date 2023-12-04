import {readFileSync} from "fs";

type ScratchCard = {
    id: number,
    winningNumberList: number[],
    myNumberList: number[],
    numberOfInstances: number,
}

function getData(fileName: string): ScratchCard[] {
    const file = readFileSync(fileName, 'utf-8');

    const cardList: ScratchCard[] = []

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            const indexAndNumberSplit = trimmedLine.split(':');
            const id = parseInt(indexAndNumberSplit[0].match(/\d+/g)![0]);

            const numberListSplit = indexAndNumberSplit[1].split('|');
            const winningNumberList = numberListSplit[0].match(/\d+/g)!.map((numberAsString) => parseInt(numberAsString));
            const myNumberList = numberListSplit[1].match(/\d+/g)!.map((numberAsString) => parseInt(numberAsString));

            cardList.push({
                id,
                winningNumberList,
                myNumberList,
                numberOfInstances: 1,
            });

        }
    });

    return cardList;
}

function getWinningNumberCount(card: ScratchCard): number {
    return card.myNumberList
        .map((myNumber) => card.winningNumberList.includes(myNumber) ? 1 : 0)
        .reduce((acc: number, value: number) => acc + value, 0);
}

function part1() {
    const cardList = getData('./2023/04/input.txt');
    const pointList = cardList.map((card) => {
        const winningNumberCount = getWinningNumberCount(card);
        return winningNumberCount > 0 ? 2 ** (winningNumberCount - 1) : 0
    });
    const pileWorth = pointList.reduce((sum, value) => sum + value, 0);
    console.log(pileWorth);
}

function part2() {
    const cardList = getData('./2023/04/input.txt');
    cardList.forEach((card, index) => {
        const winningNumberCount = getWinningNumberCount(card);
        for (let i = 1; i < winningNumberCount + 1; i++){
            cardList[index + i].numberOfInstances += card.numberOfInstances;
        }
    });
    const totalNumberOfCards = cardList.reduce((sum, card) => sum + card.numberOfInstances, 0);
    console.log(totalNumberOfCards);
}

part2();

