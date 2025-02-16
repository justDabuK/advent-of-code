import { describe, expect, test } from "vitest";
import {
  isContainingAtLeastThreeVowels,
  isContainingDoubleLetter,
  isContainingRepeatingLetterWithOneInBetween,
  isContainingRepeatingPair,
  isNice,
  isNiceV2,
  isNotContainingForbiddenStrings,
} from "./script";
import { readFileSync } from "fs";

describe("2015/05", () => {
  test.each([
    ["ugknbfddgicrmopn", true],
    ["aaa", true],
    ["jchzalrnumimnmhp", true],
    ["haegwjzuvuyypxyu", true],
    ["dvszwmarrgswjxmb", false],
    ["yytzxsvwztlcljvb", false],
  ])("isContainingAtLeastThreeVowels: %s -> %s", (input, expected) => {
    expect(isContainingAtLeastThreeVowels(input)).toBe(expected);
  });

  test.each([
    ["ugknbfddgicrmopn", true],
    ["aaa", true],
    ["jchzalrnumimnmhp", false],
    ["haegwjzuvuyypxyu", true],
    ["dvszwmarrgswjxmb", true],
  ])("isContainingDoubleLetters: %s -> %s", (input, expected) => {
    expect(isContainingDoubleLetter(input)).toBe(expected);
  });

  test.each([
    ["ugknbfddgicrmopn", true],
    ["aaa", true],
    ["jchzalrnumimnmhp", true],
    ["haegwjzuvuyypxyu", false],
    ["dvszwmarrgswjxmb", true],
  ])("isNotContainingForbiddenStrings: %s -> %s", (input, expected) => {
    expect(isNotContainingForbiddenStrings(input)).toBe(expected);
  });

  test.each([
    ["ugknbfddgicrmopn", true],
    ["aaa", true],
    ["jchzalrnumimnmhp", false],
    ["haegwjzuvuyypxyu", false],
    ["dvszwmarrgswjxmb", false],
    ["yytzxsvwztlcljvb", false],
  ])("isNice: %s -> %s", (input, expected) => {
    expect(isNice(input)).toBe(expected);
  });

  test("part1: actual input", () => {
    const file = readFileSync("./2015/05/input.txt", "utf-8");

    let niceCounter = 0;

    file.split(/\r?\n/).forEach((line: string) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        console.log("reached the end");
      } else {
        if (isNice(trimmedLine)) {
          niceCounter++;
        }
      }
    });

    expect(niceCounter).toBe(236);
  });

  test.each([
    ["xyxy", true],
    ["aaa", false],
    ["qjhvhtzxzqqjkmpb", true],
    ["xxyxx", true],
    ["uurcxstgmygtbstg", true],
    ["ieodomkazucvgmuy", false],
  ])("isContainingRepeatingPair: %s -> %s", (input, expected) => {
    expect(isContainingRepeatingPair(input)).toBe(expected);
  });

  test.each([
    ["xyx", true],
    ["abcdefeghi", true],
    ["aaa", true],
    ["qjhvhtzxzqqjkmpb", true],
    ["xxyxx", true],
    ["uurcxstgmygtbstg", false],
    ["ieodomkazucvgmuy", true],
  ])(
    "isContainingRepeatingLetterWithOneInBetween: %s -> %s",
    (input, expected) => {
      expect(isContainingRepeatingLetterWithOneInBetween(input)).toBe(expected);
    },
  );

  test.each([
    ["qjhvhtzxzqqjkmpb", true],
    ["xxyxx", true],
    ["uurcxstgmygtbstg", false],
    ["ieodomkazucvgmuy", false],
  ])("isNiceV2: %s -> %s", (input, expected) => {
    expect(isNiceV2(input)).toBe(expected);
  });

  test("part2: actual input", () => {
    const file = readFileSync("./2015/05/input.txt", "utf-8");

    let niceCounter = 0;

    file.split(/\r?\n/).forEach((line: string) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        console.log("reached the end");
      } else {
        if (isNiceV2(trimmedLine)) {
          niceCounter++;
        }
      }
    });

    expect(niceCounter).toBe(51);
  });
});
