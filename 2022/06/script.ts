import {readFileSync} from "fs";

function getData(fileName: string): string[][] {
    const file = readFileSync(fileName, 'utf-8');

    const dataStreamList: string[][] = []
    file.split(/r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if(!trimmedLine) {
            console.log("reached the end");
        } else {
            dataStreamList.push(trimmedLine.split(""));
        }
    })

    return dataStreamList;
}

function isStartOfPacket(potentialPacket: string[]): boolean {
    for(let i=0; i < potentialPacket.length; i++) {
        const currentDate = potentialPacket[i];
        if(i !== potentialPacket.length-1) {
            for (let j = i + 1; j < potentialPacket.length; j++) {
                const comparedDate = potentialPacket[j];
                if (currentDate === comparedDate) {
                    return false;
                }
            }
        }
    }
    return true;
}

function findStartOfPacket(dataStream: string[], distinctCharacterCount = 4): number {
    const potentialPacket: string[] = []
    for(let i=0; i < dataStream.length; i++) {
        const date = dataStream[i]
        if (potentialPacket.length < distinctCharacterCount) {
            potentialPacket.push(date);
        } else {
            potentialPacket.shift();
            potentialPacket.push(date);
        }
        if (potentialPacket.length === distinctCharacterCount && isStartOfPacket(potentialPacket)) {
            return i + 1;
        }
    }
    return 0;
}



function part1() {
    const dataStreamList = getData('./2022/06/test-input.txt')
    const startOfPacketList = dataStreamList.map((dataStream) => findStartOfPacket(dataStream));
    console.log(startOfPacketList);
}

function part2() {
    const dataStreamList = getData('./2022/06/input.txt')
    const startOfPacketList = dataStreamList.map((dataStream) => findStartOfPacket(dataStream, 14));
    console.log(startOfPacketList);
}


part2();