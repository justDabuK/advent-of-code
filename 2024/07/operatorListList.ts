
const plus = (a: number, b: number) => a + b;
const mult = (a: number, b: number) => a * b;
const concat = (a: number, b: number) => parseInt(`${a}${b}`);

const allowedMethodList = [plus, mult, concat];

export const getOperatorList = (numberOfOperators: number, entryIndex: number, numberOfAllowedMethods = 2) => {
    const entryInBinaryString = entryIndex.toString(numberOfAllowedMethods)
    const reversedEntryInBinaryCharacterList = entryInBinaryString.split('').reverse()
    const operatorList: ((a: number, b: number) => number)[] = []
    for(let operatorIndex = 0; operatorIndex < numberOfOperators; operatorIndex++) {
        const allowedMethodIndex = parseInt(reversedEntryInBinaryCharacterList[operatorIndex] || '0')
        operatorList.push(allowedMethodList[allowedMethodIndex])
    }
    return operatorList;
}

export const createOperatorListList = (numberOfOperators: number, numberOfAllowedMethods = 2) => {
    const operatorListList: ((a: number, b: number) => number)[][] = [];
    for(let entryIndex = 0; entryIndex < Math.pow(numberOfAllowedMethods, numberOfOperators); entryIndex++) {
        operatorListList.push(getOperatorList(numberOfOperators, entryIndex, numberOfAllowedMethods));
    }
    return operatorListList;
}