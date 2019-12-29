export const getMinValueIndex = (list: number[]) => {
  let index = 0;
  let minValue = list[index];
  for (let i = 0; i < list.length; i++) {
    if (list[i] < minValue) {
      minValue = list[i];
      index = i;
    }
  }
  return index;
};
