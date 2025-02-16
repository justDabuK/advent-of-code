export function isContainingAtLeastThreeVowels(testSubject: string) {
  return testSubject.match(/[aeiou]/g)?.length >= 3;
}
const doubleLetterVariants = Array.from(
  { length: 26 },
  (_, i) => String.fromCharCode(97 + i) + String.fromCharCode(97 + i),
);
export function isContainingDoubleLetter(testSubject: string) {
  return doubleLetterVariants.some((doubleLetter) =>
    testSubject.includes(doubleLetter),
  );
}

export function isNotContainingForbiddenStrings(testSubject: string) {
  return !["ab", "cd", "pq", "xy"].some((forbiddenString) =>
    testSubject.includes(forbiddenString),
  );
}

export function isNice(testSubject: string) {
  return (
    isContainingAtLeastThreeVowels(testSubject) &&
    isContainingDoubleLetter(testSubject) &&
    isNotContainingForbiddenStrings(testSubject)
  );
}

export function isContainingRepeatingPair(testSubject: string) {
  return /([a-z]{2}).*\1/.test(testSubject);
}

export function isContainingRepeatingLetterWithOneInBetween(
  testSubject: string,
) {
  return /([a-z]).\1/.test(testSubject);
}

export function isNiceV2(testSubject: string) {
  return (
    isContainingRepeatingPair(testSubject) &&
    isContainingRepeatingLetterWithOneInBetween(testSubject)
  );
}
