export const ContainerHeight = 400;
export const defaultPageSize = 10;

export const joinArrayWithoutDuplicate = (oldArray: any[], newArray: any[]) => {
  const result = [...newArray];
  oldArray.forEach((item) => {
    if (!result.find((i) => i.id === item.id)) {
      result.push(item);
    }
  });
  // sort result by newest createdDate and if equal then compare createdTime
  result.sort((a, b) => {
    return b.id - a.id;
  });

  return result;
};
