import axios from 'axios';

export function isPassword(value) {
  const password = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  return password.test(value) ? true : '密碼需至少 8 碼以上，並英數混合';
}

export function isSame(value, [confirmName, confirmValue]) {
  return value === confirmValue ? true : `與 ${confirmName} 欄位不一致`;
}

export async function checkUrlValid(url) {
  try {
    const res = await axios.head(url);
    return res.status >= 200 && res.status < 400;
  } catch (err) {
    return false;
  }
}
