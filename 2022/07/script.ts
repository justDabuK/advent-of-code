import {readFileSync} from "fs";

type File  = {
    name: string;
    size: number;
}

type Directory = {
    name: string;
    subDirectories?: Directory[];
    fileList?: File[]
}

type DirectoryTree = {
    root?: Directory
}

function getData(fileName: string): DirectoryTree {
    const file = readFileSync(fileName, 'utf-8');

    const directoryTree: DirectoryTree = {
        root: {
            name: '/'
        }
    }
    let currentDirectory: Directory|undefined;
    file.split(/r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if(!trimmedLine) {
            console.log("reached the end");
        } else {
            // match command
            if (trimmedLine.includes("$")) {
                if(trimmedLine.includes("cd")) {

                } else if (trimmedLine.includes("ls")) {

                } els

            } else {
                // just write data


                //  or match dir
                // or match file
            }
        }
    })

    return dataStreamList;
}

function part1(){
    // TODO: build up a tree that represents the file structure

}