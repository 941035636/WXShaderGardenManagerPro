export const setTime = (date) => {
  if (date) {
    return date.split(' ')[0] || ''
  }
  return ''
}
export const setIdCard = (str) => {
  let len = str.length - 6 - 4;
  let xing = '';
  for (var i = 0; i < len; i++) {
    xing += '*';
  }
  return str.substring(0, 6) + xing + str.substring(str.length - 4);
}
export const setPhone = (str) => {
  let len = str.length - 3 - 2;
  let xing = '';
  for (var i = 0; i < len; i++) {
    xing += '*';
  }
  return str.substring(0, 3) + xing + str.substring(str.length - 2);
}

