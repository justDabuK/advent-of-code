import { expect, test } from 'vitest';
import { part1 } from './script';
import { readFileSync } from 'fs';

test.each([
    ["(())", 0],
    ["()()", 0],
    ["(((", 3],
    ["(()(()(", 3],
    ["))(((((", 3],
    ["())", -1],
    ["))(", -1],
    [")))", -3],
    [")())())", -3],
])('%s -> %i', (input, expected) => {
    expect(part1(input)).toBe(expected);
});

test('actual input', () => {
    const file = readFileSync('./2015/01/input.txt', 'utf-8');

    let floorInstructions = "";

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            floorInstructions += trimmedLine;
        }
    });

    const resultingFloor = part1(floorInstructions);
    expect(resultingFloor).toBe(232);
})