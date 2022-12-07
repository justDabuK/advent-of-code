import {readFileSync} from "fs";

type File  = {
    name: string;
    size: number;
}

type Directory = {
    name: string;
    parentDirectory: string;
    path: string;
    subDirectories?: Directory[];
    fileList?: File[]
}

type DirectoryTree = {
    root?: Directory
}

function changeDirectoryToParent(tree: DirectoryTree, path: string): Directory {
    if(!tree.root) {
        throw "i am no root";
    }

    if(path === "/" || path === "") {
        return tree.root;
    }

    const dirList = path.split("/");

    dirList.pop(); // pop the current
    dirList.shift();
    return getDirectoryByDirList(tree.root, dirList);
}

function getDirectoryByDirList(directory: Directory, dirList: string[]): Directory {
    if(dirList.length === 0) {
        return directory;
    } else if(dirList.length === 1) {
        if(!directory.subDirectories) {
            throw "there are no subdirectories to got to left";
        }

        const potentialDirectory = directory.subDirectories.find((subDir) => subDir.name === dirList[0])
        if(!potentialDirectory) {
            throw "WHY is there no potentialDirectory"
        }
        return potentialDirectory;
    } else {
        if(!directory.subDirectories) {
            throw "there are no subdirectories to got to left";
        }

        const potentialDirectory = directory.subDirectories.find((subDir) => subDir.name === dirList[0])
        if(!potentialDirectory) {
            throw "WHY is there no potentialDirectory"
        }
        dirList.shift();
        return getDirectoryByDirList(potentialDirectory, dirList);
    }
}



function changeDirectoryToChild(currentDirectory: Directory, wantedDirectoryName: string): Directory {
    if(!currentDirectory.subDirectories) {
        throw "Directory has no children, why do you try to find some";
    }

    const potentialChild = currentDirectory.subDirectories.find((subDir) => subDir.name === wantedDirectoryName);
    if(!potentialChild) {
        throw `No child with name ${wantedDirectoryName} found in ${currentDirectory}`;
    }
    return potentialChild;
}

function appendDirectory(directory: Directory, childDirectoryName: string) {
    const childDirectory: Directory = {
        name: childDirectoryName,
        parentDirectory: directory.name,
        path: `${directory.path}/${childDirectoryName}`
    }
    // does the directory already have children, if not, create a new list with the new directory inside
    if(!directory.subDirectories) {
        directory.subDirectories = [childDirectory];
    } else {
        // check if directory already exists
        const subDirNameList: string[] = directory.subDirectories.map<string>((subDir) => subDir.name);
        if (!subDirNameList.includes(childDirectoryName)) {
            directory.subDirectories.push(childDirectory);
        } else {
            console.log("directory already exists");
        }
    }
}

function appendFile(directory: Directory, file: File) {
    if(!directory.fileList) {
        directory.fileList = [file];
    } else {
        const fileNameList = directory.fileList.map((f) => f.name);
        if(!fileNameList.includes(file.name)) {
            directory.fileList.push(file);
        } else {
            console.log("file already exists")
        }
    }
}

function getData(fileName: string): DirectoryTree {
    const file = readFileSync(fileName, 'utf-8');

    const directoryTree: DirectoryTree = {
        root: {
            name: '/',
            parentDirectory: "",
            path:''
        }
    };

    let currentDirectory: Directory | undefined = directoryTree.root;
    file.split(/r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if(!trimmedLine) {
            console.log("reached the end");
        } else {
            // match command
            if (trimmedLine.includes("$")) {
                if(trimmedLine.includes("cd")) {
                    const changeDirectoryRegex = /\$ cd (.+)/;
                    const wantedDirectory = changeDirectoryRegex.exec(trimmedLine)![1];

                    if(!currentDirectory) {
                        throw "there is not even a current directory yet. How do you wanna cd into anything"
                    }

                    if(wantedDirectory === "..") {
                        currentDirectory = changeDirectoryToParent(directoryTree, currentDirectory.path)
                    } else if(wantedDirectory === "/") {
                        currentDirectory = directoryTree.root;
                    } else {
                        currentDirectory = changeDirectoryToChild(currentDirectory, wantedDirectory);
                    }
                } else if (trimmedLine.includes("ls")) {
                    // do nothing for now
                } else {
                    throw `got a command line I can't pass ${trimmedLine}`
                }

            } else {
                if(!currentDirectory) {
                    throw "there is not even a current directory yet. How is it possible you read its content"
                }

                // just write data
                if(trimmedLine.includes("dir")) {
                    const directoryRegex = /dir (.+)/;
                    const directoryName = directoryRegex.exec(trimmedLine)![1];
                    appendDirectory(currentDirectory, directoryName);
                } else {
                    const fileRegex = /(\d+) (.+)/
                    const matches = fileRegex.exec(trimmedLine)!;
                    const file: File = {
                        name: matches[2],
                        size: parseInt(matches[1]),
                    }
                    appendFile(currentDirectory, file);

                }
            }
        }
    })

    return directoryTree;
}

type SizeMap = { directoryPath: string, size: number }[];

function getDirectorySizes(tree: DirectoryTree): SizeMap {
    if(!tree.root) {
        throw "There is not even a root directory";
    }

    const sizeMap: SizeMap = [];
    calculateSizeRegisterAndReturn(sizeMap, tree.root);
    return sizeMap;
}

function calculateSizeRegisterAndReturn(sizeMap: SizeMap, directory: Directory,): number {
    let size = 0;
    if(directory.subDirectories) {
        directory.subDirectories.forEach((subDir) => size += calculateSizeRegisterAndReturn(sizeMap, subDir));
    }

    if(directory.fileList) {
        directory.fileList.forEach((file) => size += file.size);
    }

    const nameList = sizeMap.map((entry) => entry.directoryPath);
    if (!nameList.includes(directory.path)) {
        sizeMap.push({directoryPath: directory.path, size})
    }

    return size;

}

function part1(){
    const directoryTree = getData('./2022/07/input.txt');
    const sizeMap: SizeMap = getDirectorySizes(directoryTree);
    const filteredMap = sizeMap.filter((entry) => entry.size <= 100000);
    const sum = filteredMap.reduce((sum, entry) => sum + entry.size, 0);
    console.log(`final sum: ${sum}`);
}

function part2() {
    const directoryTree = getData('./2022/07/input.txt');
    const sizeMap: SizeMap = getDirectorySizes(directoryTree);
    const totalSpace = 70000000;
    const necessaryFreeSpace = 30000000;
    const unusedSpace = totalSpace - sizeMap.find((entry) => entry.directoryPath === "")!.size;
    console.log(`unused space ${unusedSpace}`);
    const minimumDeletedSpace = necessaryFreeSpace - unusedSpace;
    console.log(`minimum deleted space ${minimumDeletedSpace}`);
    const filteredMap = sizeMap.filter((entry) => entry.size >= minimumDeletedSpace);
    const toDeleteDirectory = filteredMap.reduce((prev, curr) => prev.size < curr.size ? prev: curr);
    console.log(`would delete ${toDeleteDirectory.directoryPath} with ${toDeleteDirectory.size}`);

}

part2();