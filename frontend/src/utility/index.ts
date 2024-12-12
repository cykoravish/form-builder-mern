/* eslint-disable @typescript-eslint/no-explicit-any */
export const hasDuplicates = (arr: any[]): boolean =>
  new Set(arr).size !== arr.length;

export const hasEmptyElement = (arr: any[]): boolean =>
  arr.some((item) => item === "");

export const hasEmptyCategory = (arr: any[]): boolean =>
  arr.some((item) => item.category === "");

export const hasDuplicateText = (arr: any[]): boolean => {
  const texts = arr.map((item) => item.text);
  return new Set(texts).size !== texts.length;
};
export const hasEmptyText = (arr: any[]): boolean =>
  arr.some((item) => item.text === "");
