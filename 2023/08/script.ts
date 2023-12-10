import {readFileSync} from "fs";

type Node = {
    name: string,
    leftChild: string,
    rightChild: string,
}

enum ReadMode {
    instructions,
    nodes,
}
function getData(fileName: string): { instructionList: string[], nodeMap: Record<string, Node> } {
    const file = readFileSync(fileName, 'utf-8');

    let instructionList: string[] = []
    const nodeMap: Record<string, Node> = {}
    let currentReadMode = ReadMode.instructions;

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            currentReadMode++;
            if(currentReadMode === ReadMode.nodes) {
                console.log('reached the end');
            }
        } else {
            if(currentReadMode === ReadMode.instructions){
                instructionList = trimmedLine.split('');
            } else {
                const matches = trimmedLine.match(/(\w+)/g);
                nodeMap[matches![0]] = {
                    name: matches![0],
                    leftChild: matches![1],
                    rightChild: matches![2],
                }
            }
        }
    });

    return { instructionList, nodeMap};
}

function part1() {
    const { instructionList, nodeMap } = getData('./2023/08/input.txt');
    let currentNode = nodeMap["AAA"];
    let numberOfSteps = 0;
    do {
        for(const instruction of instructionList) {
            if (instruction === "L") {
                currentNode = nodeMap[currentNode.leftChild];
            } else {
                currentNode = nodeMap[currentNode.rightChild];
            }
            numberOfSteps++;
            if(currentNode.name === "ZZZ"){
                break;
            }
        }
    } while (currentNode.name !== "ZZZ")
    console.log(numberOfSteps);
}

function part2() {
    const { instructionList, nodeMap } = getData('./2023/08/input.txt');
    let currentNodeList = Object.keys(nodeMap).filter((nodeName) => nodeName.endsWith("A"));
    let numberOfSteps = 0;
    do {
        for(const instruction of instructionList ){

            if(instruction === "L"){
                currentNodeList = currentNodeList.map((nodeName) => nodeMap[nodeName].leftChild);
            } else {
                currentNodeList = currentNodeList.map((nodeName) => nodeMap[nodeName].rightChild);
            }

            numberOfSteps++;

            const allNodesAreInTheGoal = currentNodeList.every((nodeName) => nodeName.endsWith("Z"));
            if(allNodesAreInTheGoal){
                break;
            }
        }
    } while (!currentNodeList.every((nodeName) => nodeName.endsWith("Z")))
    console.log(numberOfSteps);
}

part2();