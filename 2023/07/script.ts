import { readFileSync } from "fs";

enum HandType {
  HighCard,
  Pair,
  TwoPair,
  ThreeOfAKind,
  FullHouse,
  FourOfAKind,
  FiveOfAKind,
}

enum Card {
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  T,
  J,
  Q,
  K,
  A,
}

function toCard(cardAsString: string): Card {
  switch (cardAsString) {
    case "2":
      return Card.Two;
    case "3":
      return Card.Three;
    case "4":
      return Card.Four;
    case "5":
      return Card.Five;
    case "6":
      return Card.Six;
    case "7":
      return Card.Seven;
    case "8":
      return Card.Eight;
    case "9":
      return Card.Nine;
    case "T":
      return Card.T;
    case "J":
      return Card.J;
    case "Q":
      return Card.Q;
    case "K":
      return Card.K;
    case "A":
      return Card.A;
    default:
      throw new Error("unknown card: " + cardAsString);
  }
}

type Hand = {
  cardList: Card[];
  bid: number;
  occurrences: Record<string, number>;
  handType: HandType;
};

function getOccurences(cardList: Card[]): Record<string, number> {
  const occurences: Record<string, number> = {};
  cardList.forEach((card) => {
    if (occurences[card]) {
      occurences[card] += 1;
    } else {
      occurences[card] = 1;
    }
  });
  return occurences;
}

function getHandType(occurrences: Record<string, number>): HandType {
  const occurrenceValues = Object.values(occurrences);
  if (occurrenceValues.includes(5)) {
    return HandType.FiveOfAKind;
  } else if (occurrenceValues.includes(4)) {
    return HandType.FourOfAKind;
  } else if (occurrenceValues.includes(3) && occurrenceValues.includes(2)) {
    return HandType.FullHouse;
  } else if (occurrenceValues.includes(3)) {
    return HandType.ThreeOfAKind;
  } else if (occurrenceValues.includes(2) && occurrenceValues.length === 3) {
    return HandType.TwoPair;
  } else if (occurrenceValues.includes(2)) {
    return HandType.Pair;
  } else {
    return HandType.HighCard;
  }
}

function getData(fileName: string): Hand[] {
  const file = readFileSync(fileName, "utf-8");

  let handList: Hand[] = [];

  file.split(/\r?\n/).forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      console.log("reached the end");
    } else {
      const splitLine = trimmedLine.split(" ");
      const cardList = splitLine[0]
        .split("")
        .map((cardAsString) => toCard(cardAsString));
      const occurences = getOccurences(cardList);
      handList.push({
        cardList,
        bid: parseInt(splitLine[1]),
        occurrences: occurences,
        handType: getHandType(occurences),
      });
    }
  });

  return handList;
}

function compareHands(hand1: Hand, hand2: Hand): number {
  if (hand1.handType > hand2.handType) {
    return 1;
  } else if (hand1.handType < hand2.handType) {
    return -1;
  } else {
    for (let i = 0; i < hand1.cardList.length; i++) {
      if (hand1.cardList[i] > hand2.cardList[i]) {
        return 1;
      } else if (hand1.cardList[i] < hand2.cardList[i]) {
        return -1;
      }
    }
    return 0;
  }
}

function part1() {
  const handList = getData("2023/07/input.txt");
  const sortedHandList = handList.sort(compareHands);
  const combinedRank = sortedHandList
    .map((hand, index) => hand.bid * (index + 1))
    .reduce((a, b) => a + b, 0);
  console.log(combinedRank);
}

part1();
