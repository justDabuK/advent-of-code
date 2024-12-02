import {readFileSync} from "fs";

function getData(fileName: string): number[][] {
    const file = readFileSync(fileName, 'utf-8');

    const numberListList: number[][] = []

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            const extractNumberRegex = /(\d+)/g;
            let regExpMatchArray = trimmedLine.match(extractNumberRegex)
            numberListList.push([])
            if(regExpMatchArray) {
                regExpMatchArray.forEach((number) => {
                    numberListList[numberListList.length - 1].push(parseInt(number));
                });
            }
        }
    });

    return numberListList;
}

function isReportSafe(report: number[]) {
    let isIncreasing = false;
    for(let index = 0; index < report.length; index++) {
        if(index === 0) {
            continue
        }
        if(report[index] === report[index - 1]) {
            return false;
        }
        let difference = report[index] - report[index - 1];
        if(Math.abs(difference) < 1 || Math.abs(difference) > 3) {
            return false;
        }
        if(index === 1) {
            if(difference > 0) {
                isIncreasing = true
            } else {
                isIncreasing = false
            }
            continue;
        }
        let stoppedIncreasing = isIncreasing && difference < 0;
        let stoppedDecreasing = !isIncreasing && difference > 0;
        if(stoppedIncreasing || stoppedDecreasing) {
            return false
        }

    }
    return true;
}

function part1() {
    console.group('part1')
    const dataTable = getData('./input.txt')
    console.table(dataTable)
    const reportResultList = dataTable.map(isReportSafe)
    console.log(reportResultList)
    const numberOfSafeReports = reportResultList.reduce((acc, curr) => (curr ? acc++ : () => {}, acc), 0);
    console.log('number of safe reports', numberOfSafeReports)
    console.groupEnd();
}

function isReportSafeWithDampener(report: number[]) {
    let isIncreasing = false;
    let isDampenerUsed = false;

    for(let index = 0; index < report.length; index++) {
        const failOrDampen = () => {
            if(isDampenerUsed) {
                return true
            } else {
                isDampenerUsed = true;
                report.splice(index, 1);
                index--;
                return false
            }
        }

        if(index === 0) {
            continue
        }
        if(report[index] === report[index - 1]) {
            if(failOrDampen()){
                return false;
            }
        }
        let difference = report[index] - report[index - 1];
        if(Math.abs(difference) < 1 || Math.abs(difference) > 3) {
            if(failOrDampen()){
                return false;
            }
        }
        if(index === 1) {
            if(difference > 0) {
                isIncreasing = true
            } else {
                isIncreasing = false
            }
            continue;
        }
        let stoppedIncreasing = isIncreasing && difference < 0;
        let stoppedDecreasing = !isIncreasing && difference > 0;
        if(stoppedIncreasing || stoppedDecreasing) {
            if(failOrDampen()){
                return false;
            }
        }

    }
    return true;
}

function isReportSafeTryouts(report: number[]) {
    if(isReportSafe(report)) {
        return true
    }

    for(let index = 0; index < report.length; index++) {
        let reportCopy = [...report];
        reportCopy.splice(index, 1);
        if(isReportSafe(reportCopy)) {
            return true
        }
    }
    return false;
}

function part2() {
    console.group('part2')
    const dataTable = getData('./input.txt')
    const reportResultList = dataTable.map((report) => [...report, isReportSafe(report), isReportSafeTryouts(report)])
    console.table(reportResultList)
    const numberOfSafeReports = reportResultList.reduce((acc, curr) => (curr[curr.length - 1] ? acc++ : () => {}, acc), 0);
    console.log('number of safe reports', numberOfSafeReports)
    console.groupEnd();
}

part2()