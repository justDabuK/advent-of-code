import md5 from "crypto-js/md5";

export function findHashWithFiveZeroes(
  secretKey: string,
  startsWith = "00000",
): number {
  let hash = "";
  let i = 0;
  while (!hash.startsWith(startsWith)) {
    i++;
    hash = md5(secretKey + i).toString();
  }
  return i;
}
