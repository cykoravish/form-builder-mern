
export const hasDuplicates = (arr) =>
  new Set(arr).size !== arr.length;

export const hasEmptyElement = (arr) =>
  arr.some((item) => item === "");

export const hasEmptyCategory = (arr) =>
  arr.some((item) => item.category === "");


export const hasDuplicateText = (arr) => {
  const texts = arr.map((item) => item.text);
  return new Set(texts).size !== texts.length;
};
export const hasEmptyText = (arr) =>
  arr.some((item) => item.text === "");
