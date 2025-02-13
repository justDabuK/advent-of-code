import { expect, test } from 'vitest';
import { calculateNecessaryPaper, calculateNecessaryRibbon, extractDimension } from './script';
import { readFileSync } from 'fs';
import { part2 } from '../01/script';

test.each([
    ["2x3x4", { length: 2, width: 3, height: 4}],
    ["1x1x10", { length: 1, width: 1, height: 10}],
])('extractDimension: %s -> %s', (input, expected) => {
    expect(extractDimension(input)).toStrictEqual(expected);
});

test.each([
    ["2x3x4", 58],
    ["1x1x10", 43],
])('necessary paper: %s -> %i', (input, expected) => {
    expect(calculateNecessaryPaper(extractDimension(input))).toBe(expected);
});

test('part1: actual input', () => {
    const file = readFileSync('./2015/02/input.txt', 'utf-8');

    let necessaryPaperSum = 0;

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            necessaryPaperSum += calculateNecessaryPaper(extractDimension(trimmedLine));
        }
    });

    expect(necessaryPaperSum).toBe(1588178);
})

test.each([
    ["2x3x4", 34],
    ["1x1x10", 14],
])('necessary ribbon: %s -> %i', (input, expected) => {
    expect(calculateNecessaryRibbon(extractDimension(input))).toBe(expected);
});

test('part2: actual input', () => {
    const file = readFileSync('./2015/02/input.txt', 'utf-8');

    let necessaryRibbonSum = 0;

    file.split(/\r?\n/).forEach((line: string) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            console.log('reached the end');
        } else {
            necessaryRibbonSum += calculateNecessaryRibbon(extractDimension(trimmedLine));
        }
    });

    expect(necessaryRibbonSum).toBe(3783758);
})