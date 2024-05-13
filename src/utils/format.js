// eslint-disable-next-line import/prefer-default-export
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${year}/${month < 10 ? `0${month}` : month}/${day < 10 ? `0${day}` : day} ${hours}:${minutes}`;
}
