import {readFileSync} from "fs";

type Rule = {
    before: number;
    after: number;
}

type RuleIndex = Map<number, Map<number, Rule>>

type PrinterInstructions = {
    ruleIndex: RuleIndex;
    pagesUpdateList: number[][];
}

function getData(fileName: string): PrinterInstructions {
    const file = readFileSync(fileName, 'utf-8');

    const ruleIndex = new Map<number, Map<number, Rule>>();
    const pagesUpdateList: number[][] = [];
    let isReadingPageUpdates = false;

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            if(!isReadingPageUpdates) {
                isReadingPageUpdates = true;
                console.log('SWITCH to reading page updates')
            } else {
                console.log('reached the end');
            }
        } else {
            if(!isReadingPageUpdates) {
                const [before, after] = trimmedLine.split('|').map(Number);
                const rule = {before, after};

                if(ruleIndex.has(before)) {
                    ruleIndex.get(before).set(after, rule);
                } else {
                    ruleIndex.set(before, new Map<number, Rule>([[after, rule]]));
                }
                if(ruleIndex.has(after)) {
                    ruleIndex.get(after).set(before, rule);
                } else {
                    ruleIndex.set(after, new Map<number, Rule>([[before, rule]]));
                }
            } else {
                const pageUpdate = trimmedLine.split(',');
                pagesUpdateList.push(pageUpdate.map(Number));
            }
        }
    });

    return {ruleIndex, pagesUpdateList};
}

function isUpdateInRightOrder(ruleIndex: RuleIndex, pageUpdate: number[], debug = false): boolean {
    for(let currentUpdateIndex = 0; currentUpdateIndex < pageUpdate.length - 1; currentUpdateIndex++) {
        for(let comparingUpdateIndex = 0; comparingUpdateIndex < pageUpdate.length; comparingUpdateIndex++) {
            if(currentUpdateIndex === comparingUpdateIndex) {
                continue;
            }

            const currentUpdate = pageUpdate[currentUpdateIndex];
            const comparingUpdate = pageUpdate[comparingUpdateIndex];
            const rule = ruleIndex.get(currentUpdate).get(comparingUpdate);
            if(rule) {
                if(currentUpdateIndex < comparingUpdateIndex) {
                    if(!(rule.before === currentUpdate && rule.after === comparingUpdate)) {
                        if(debug) console.log(`FAIL ${currentUpdate}|${comparingUpdate} against ${rule.before}|${rule.after}`);
                        return false;
                    }
                } else {
                    if(!(rule.before === comparingUpdate && rule.after === currentUpdate)) {
                        if(debug) console.log(`FAIL ${currentUpdate}|${comparingUpdate} against ${rule.before}|${rule.after}`);
                        return false;
                    }
                }
                if(debug) console.log(`SUCCESS ${currentUpdate}|${comparingUpdate} against ${rule.before}|${rule.after}`);
            } else {
                if(debug) console.log(`No rule found for ${currentUpdate} and ${comparingUpdate}`);
            }
        }
    }
    return true;
}

function part1() {
    const printerInstructions = getData('./input.txt');
    const sumOfMiddleSuccesses = printerInstructions.pagesUpdateList
        .filter((pageUpdate) => isUpdateInRightOrder(printerInstructions.ruleIndex, pageUpdate))
        .map((pageUpdate) => pageUpdate[Math.floor(pageUpdate.length/2)])
        .reduce((acc, current) => acc + current, 0);
    console.log('Sum of middle numbers of successful updates', sumOfMiddleSuccesses);
}

const fixUpdateOrder = (ruleIndex: RuleIndex, pageUpdate: number[], debug = false): number[] => {
    const fixedPageUpdate = [...pageUpdate];
    for(let currentUpdateIndex = 0; currentUpdateIndex < fixedPageUpdate.length - 1; currentUpdateIndex++) {
        for(let comparingUpdateIndex = 0; comparingUpdateIndex < fixedPageUpdate.length; comparingUpdateIndex++) {
            if(currentUpdateIndex === comparingUpdateIndex) {
                continue;
            }

            const currentUpdate = fixedPageUpdate[currentUpdateIndex];
            const comparingUpdate = fixedPageUpdate[comparingUpdateIndex];
            const rule = ruleIndex.get(currentUpdate).get(comparingUpdate);
            if(rule) {
                if(currentUpdateIndex < comparingUpdateIndex) {
                    if(!(rule.before === currentUpdate && rule.after === comparingUpdate)) {
                        if(debug) console.log(`FAIL ${currentUpdate}|${comparingUpdate} against ${rule.before}|${rule.after}`);
                        const temp = fixedPageUpdate[currentUpdateIndex];
                        fixedPageUpdate[currentUpdateIndex] = fixedPageUpdate[comparingUpdateIndex];
                        fixedPageUpdate[comparingUpdateIndex] = temp;
                    }
                } else {
                    if(!(rule.before === comparingUpdate && rule.after === currentUpdate)) {
                        if(debug) console.log(`FAIL ${currentUpdate}|${comparingUpdate} against ${rule.before}|${rule.after}`);
                        const temp = fixedPageUpdate[currentUpdateIndex];
                        fixedPageUpdate[currentUpdateIndex] = fixedPageUpdate[comparingUpdateIndex];
                        fixedPageUpdate[comparingUpdateIndex] = temp;
                    }
                }
                if(debug) console.log(`SUCCESS ${currentUpdate}|${comparingUpdate} against ${rule.before}|${rule.after}`);
            } else {
                if(debug) console.log(`No rule found for ${currentUpdate} and ${comparingUpdate}`);
            }
        }
    }
    return fixedPageUpdate;
}

function part2() {
    const printerInstructions = getData('./input.txt');
    const sumOfMiddleSuccesses = printerInstructions.pagesUpdateList
        .filter((pageUpdate) => !isUpdateInRightOrder(printerInstructions.ruleIndex, pageUpdate))
        .map((pageUpdate) => {
            let fixedPageUpdate = [...pageUpdate];
            while (!isUpdateInRightOrder(printerInstructions.ruleIndex, fixedPageUpdate)) {
                fixedPageUpdate = fixUpdateOrder(printerInstructions.ruleIndex, fixedPageUpdate);
            }
            return fixedPageUpdate;
        })
        .map((pageUpdate) => pageUpdate[Math.floor(pageUpdate.length/2)])
        .reduce((acc, current) => acc + current, 0);

    console.log('Sum of middle numbers of fixed updates', sumOfMiddleSuccesses);
}

part2();