import {readFileSync} from "fs";


function getData(fileName: string): number[] {
    const file = readFileSync(fileName, 'utf-8');

    let diskMap: number[] = [];

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            diskMap = trimmedLine.split('').map(Number);
        }
    });

    return diskMap;
}

function getDiskLayout(diskMap: number[]): (number | '.')[] {
    const diskLayout: (number | '.')[] = [];
    let isFile = true;
    let fileId = 0;
    diskMap.forEach((value: number) => {
        for(let pushIndex = 0; pushIndex < value; pushIndex++) {
            diskLayout.push(isFile ? fileId : '.');
        }
        if(isFile) {
            fileId++;
        }
        isFile = !isFile;
    })
    return diskLayout;
}

function fragmentDiskLayout(diskLayout: (number | '.')[]): (number | '.')[] {
    const optimizedDiskLayout: (number | '.')[] = JSON.parse(JSON.stringify(diskLayout));
    for(let diskIndex = 0; diskIndex < optimizedDiskLayout.length; diskIndex++) {
        if(optimizedDiskLayout[diskIndex] === '.') {
            let potentialNewValue = optimizedDiskLayout.pop();
            while (potentialNewValue === '.') {
                potentialNewValue = optimizedDiskLayout.pop();
            }
            optimizedDiskLayout[diskIndex] = potentialNewValue;
        } else {
            // nothing to do
        }
    }
    return optimizedDiskLayout;
}

function part1() {
    const diskMap = getData('./input.txt');
    const diskLayout = getDiskLayout(diskMap);
    const optimizedDiskLayout = fragmentDiskLayout(diskLayout);
    // console.table([diskMap, diskLayout, optimizedDiskLayout]);
    const checksum = optimizedDiskLayout.reduce((acc: number, value: number | '.', currentIndex) => acc + (value === '.' ? 0 : value * currentIndex), 0);
    console.log('Checksum:', checksum);
}

function optimizeDiskLayout(diskLayout: (number | '.')[]): (number | '.')[] {
    const optimizedDiskLayout: (number | '.')[] = JSON.parse(JSON.stringify(diskLayout));
    // find highest file ID
    let highestFileId: number | undefined = undefined;
    let fileStartIndex = 0;
    let fileLength = 0;
    for(let diskIndex = optimizedDiskLayout.length - 1; diskIndex >= 0; diskIndex--) {
        if(optimizedDiskLayout[diskIndex] !== '.') {
            if(highestFileId === undefined) {
                highestFileId = optimizedDiskLayout[diskIndex] as number;
                fileStartIndex = diskIndex;
                fileLength = 1;
            } else {
                if(optimizedDiskLayout[diskIndex] === highestFileId) {
                    fileStartIndex = diskIndex;
                    fileLength++;
                } else {
                    break;
                }
            }
        } else if(highestFileId !== undefined) {
            break;
        }
    }
    console.log('Highest file ID:', highestFileId, 'start index:', fileStartIndex, 'length:', fileLength);
    return optimizedDiskLayout;
}

function part2() {
    const diskMap = getData('./test-input-2.txt');
    const diskLayout = getDiskLayout(diskMap);
    const optimizedDiskLayout = optimizeDiskLayout(diskLayout);
    // console.table([diskMap, diskLayout, optimizedDiskLayout]);
    // const checksum = optimizedDiskLayout.reduce((acc: number, value: number | '.', currentIndex) => acc + (value === '.' ? 0 : value * currentIndex), 0);
    // console.log('Checksum:', checksum);
}

part2();