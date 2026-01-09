export const formatDateTime = (value: string) => {
  const date = new Date(value);
  return date.toLocaleString();
};
