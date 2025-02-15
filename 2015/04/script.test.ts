import { expect, test } from 'vitest';
import { findHashWithFiveZeroes } from './script';


test.each([
    ["abcdef", 609043],
    ["pqrstuv", 1048970],
])('convertToDirectionList: %s -> %i', (input, expected) => {
    expect(findHashWithFiveZeroes(input)).toBe(expected);
});

test.each([
    ["iwrupvqb", 346386],
])('part1: %s -> %i', (input, expected) => {
    expect(findHashWithFiveZeroes(input)).toBe(expected);
});

test.each([
    ["iwrupvqb", 9958218],
])('part2: %s -> %i', (input, expected) => {
    expect(findHashWithFiveZeroes(input, '000000')).toBe(expected);
});