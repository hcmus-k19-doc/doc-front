export const mapPathToKeyDocIn = (path: string) => {
  console.log('mapPathToKeyDocIn', path);
  return 'in' + path.charAt(0).toUpperCase() + path.slice(1);
};

export const mapPathToKeyDocOut = (path: string) => {
  return 'out' + path.charAt(0).toUpperCase() + path.slice(1);
};
