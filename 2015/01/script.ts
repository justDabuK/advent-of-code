import { readFileSync } from 'fs';

function getData(fileName: string): number[][] {
    const file = readFileSync(fileName, 'utf-8');

    const numberListList: number[][] = [[],[]]

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            const extractNumberRegex = /(\d+)/g;
            let regExpMatchArray = trimmedLine.match(extractNumberRegex)
            if(regExpMatchArray) {
                regExpMatchArray.forEach((number, index) => {
                    numberListList[index].push(parseInt(number));
                });
            }
        }
    });

    return numberListList;
}

function part1() {

}
