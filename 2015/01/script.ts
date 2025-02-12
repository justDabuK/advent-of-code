
export function part1(input: string) {
    const floorInstructions = input.split('');
    let floor = 0;
    floorInstructions.forEach(instruction => instruction === '(' ? floor++ : floor--);
    return floor;
}
