
export function part1(input: string) {
    const floorInstructions = input.split('');
    let floor = 0;
    floorInstructions.forEach(instruction => instruction === '(' ? floor++ : floor--);
    return floor;
}

export function part2(input: string) {
    const floorInstructions = input.split('');
    let floor = 0;
    for(let index = 0; index < floorInstructions.length; index++) {
        const instruction = floorInstructions[index];
        floor += instruction === '(' ? 1 : -1;
        if (floor === -1) {
            return index + 1;
        }
    }
    throw "Santa never enters the basement";
}


