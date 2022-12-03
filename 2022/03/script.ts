import {readFileSync} from "fs";

type Rucksack = string[];

function getData(fileName: string): Rucksack[] {
    const file = readFileSync(fileName, 'utf-8');

    const shapesList: string[][] = []
    file.split(/r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if(!trimmedLine) {
            console.log("reached the end");
        } else {
            shapesList.push(trimmedLine.split(""));
        }
    })

    return shapesList;
}

function splitIntoCompartments(rucksack: Rucksack): string[][] {
    const rucksackHalfIndex = rucksack.length / 2;
    return [rucksack.slice(0, rucksackHalfIndex), rucksack.slice(rucksackHalfIndex)];
}

function findCommonType(firstCompartment: string[], secondCompartment: string[]): string {
    let secondCompartmentString = secondCompartment.join("");
    return firstCompartment.find((itemType) => secondCompartmentString.includes(itemType)) ?? "";


}

function mapToCommonType(rucksackList: Rucksack[]): string[] {
    return rucksackList.map<string>((rucksack) => {
        const compartmentList = splitIntoCompartments(rucksack);
        let firstCompartment = compartmentList[0];
        let secondCompartment = compartmentList[1];
        return findCommonType(firstCompartment, secondCompartment)
    })
}

const priorityList = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
]

function getPriority(itemType: string): number {
    return priorityList.findIndex((type) => type === itemType) + 1;
}

function mapToPriority(commonTypeList: string[]): number[] {
    return commonTypeList.map(getPriority)
}

function part1(rucksackList: Rucksack[]) {
    const commonTypeList = mapToCommonType(rucksackList);
    const commonPriorityList = mapToPriority(commonTypeList);
    const summedUpPriority = commonPriorityList.reduce((sum, currentValue) => sum += currentValue, 0);
    console.log(`summed up priority: ${summedUpPriority}`);
}

function mapToGroups(ruckSackList: Rucksack[]): Rucksack[][] {
    const groupList = []
    let singleGroup = []
    for(let i=0; i < rucksackList.length; i++) {
        const currentRucksack = rucksackList[i];
        singleGroup.push(currentRucksack);
        if(singleGroup.length === 3) {
            groupList.push(singleGroup);
            singleGroup = [];
        }
    }

    return groupList;
}

function mapGroupToCommonType(group: Rucksack[]): string {
    const firstRucksack = group[0];
    const secondRucksack = group[1].join("");
    const thirdRucksack = group[2].join("");

    return firstRucksack.find((itemType) => secondRucksack.includes(itemType) && thirdRucksack.includes(itemType)) ?? "";
}

function part2(rucksackList: Rucksack[]) {
    const groupList = mapToGroups(rucksackList);
    const commonTypeList = groupList.map<string>(mapGroupToCommonType);
    const priorityList = commonTypeList.map(getPriority);
    const summedPriority = priorityList.reduce((sum, currentValue) => sum + currentValue, 0);
    console.log(`part 2 priority: ${summedPriority}`);
}

const rucksackList = getData('./2022/03/test-input.txt')
part1(rucksackList);
part2(rucksackList);
