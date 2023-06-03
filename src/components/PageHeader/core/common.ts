export const ContainerHeight = 400;
export const defaultPageSize = 10;

export const joinArrayWithoutDuplicate = (oldArray: any[], newArray: any[]) => {
  const result = [...oldArray];
  newArray.forEach((item) => {
    if (!result.find((i) => i.id === item.id)) {
      result.push(item);
    }
    // if (!result.includes(item)) {
    //   result.push(item);
    // }
  });
  return result;
};
