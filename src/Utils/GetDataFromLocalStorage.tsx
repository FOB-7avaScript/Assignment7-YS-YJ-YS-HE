const getDataFromLocalStorage = (key: string): string =>
  localStorage.getItem(key) || '';
export default getDataFromLocalStorage;
