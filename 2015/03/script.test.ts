import { expect, test } from 'vitest';
import { convertToDirectionList, deliverPresents, deliverPresentsWithRoboSanta, Direction } from './script';
import { readFileSync } from 'fs';


test.each([
    [">", [Direction.Right]],
    ["^>v<", [Direction.Up, Direction.Right, Direction.Down, Direction.Left]],
    ["^v^v^v^v^v", [Direction.Up, Direction.Down, Direction.Up, Direction.Down, Direction.Up, Direction.Down, Direction.Up, Direction.Down, Direction.Up, Direction.Down]],
])('convertToDirectionList: %s -> %s', (input, expected) => {
    expect(convertToDirectionList(input)).toStrictEqual(expected);
});

test.each([
    [">", 2],
    ["^>v<", 4],
    ["^>v<", 4],
    ["^v^v^v^v^v", 2],
])('deliverPresents: %s -> %i', (input, expected) => {
    expect(deliverPresents(convertToDirectionList(input))).toBe(expected);
});

test('part1: actual input', () => {
    const file = readFileSync('./2015/03/input.txt', 'utf-8');

    let instructionString: string = '';

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            instructionString += trimmedLine;
        }
    });

    expect(deliverPresents(convertToDirectionList(instructionString))).toBe(2081);
})

test.each([
    ["^v", 3],
    ["^>v<", 3],
    ["^v^v^v^v^v", 11],
])('deliverPresentsWithRoboSanta: %s -> %i', (input, expected) => {
    expect(deliverPresentsWithRoboSanta(convertToDirectionList(input))).toBe(expected);
});

test('part2: actual input', () => {
    const file = readFileSync('./2015/03/input.txt', 'utf-8');

    let instructionString: string = '';

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            instructionString += trimmedLine;
        }
    });

    expect(deliverPresentsWithRoboSanta(convertToDirectionList(instructionString))).toBe(2341);
})