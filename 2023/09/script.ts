import {readFileSync} from "fs";

function getData(fileName: string): number[][] {
    const file = readFileSync(fileName, 'utf-8');

    const listOfReadingList: number[][] = [];

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            const splitLine = trimmedLine.split(' ');
            listOfReadingList.push(splitLine.map((numberAsString) => parseInt(numberAsString)));
        }
    });

    return listOfReadingList;
}

function predictNextReading(readingList: number[]): number {
    const predictionLayers: number[][] = [];
    predictionLayers.push(readingList);
    do {
        const currentLayer = predictionLayers[predictionLayers.length - 1];
        const nextLayer: number[] = [];
        currentLayer.forEach((number, index) => {
            if(index !== currentLayer.length - 1) {
                nextLayer.push(currentLayer[index + 1] - number);
            }
        });
        predictionLayers.push(nextLayer);
    } while (!predictionLayers[predictionLayers.length - 1].every((number) => number === 0));
    predictionLayers.reverse().forEach((layer, index) => {
        if(index === 0) {
            layer.push(0);
        } else {
            layer.push(predictionLayers[index - 1][predictionLayers[index - 1].length - 1] + layer[layer.length - 1])
        }
    })
    return predictionLayers[predictionLayers.length - 1][predictionLayers[predictionLayers.length - 1].length - 1];
}

function part1() {
    const readingList = getData('./2023/09/input.txt');
    console.log(readingList.map((reading) => predictNextReading(reading)).reduce((sum, current) => sum + current, 0));
}

function predictPreviousReading(readingList: number[]): number {
    const predictionLayers: number[][] = [];
    predictionLayers.push(readingList);

    do {
        const currentLayer = predictionLayers[predictionLayers.length - 1];
        const nextLayer: number[] = [];
        currentLayer.forEach((number, index) => {
            if(index !== currentLayer.length - 1) {
                nextLayer.push(currentLayer[index + 1] - number);
            }
        });
        predictionLayers.push(nextLayer);
    } while (!predictionLayers[predictionLayers.length - 1].every((number) => number === 0));

    predictionLayers.reverse().forEach((layer, index) => {
        if(index === 0) {
            layer.unshift(0);
        } else {
            layer.unshift(layer[0] - predictionLayers[index - 1][0])
        }
    })
    return predictionLayers[predictionLayers.length - 1][0];
}

function part2() {
    const readingList = getData('./2023/09/input.txt');
    console.log(readingList.map((reading) => predictPreviousReading(reading)).reduce((sum, current) => sum + current, 0));
}

part2();