export function isPassword(value) {
  const password = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  return password.test(value) ? true : '密碼需至少 8 碼以上，並英數混合';
}

export function isSame(value, [confirmName, confirmValue]) {
  return value === confirmValue ? true : `與 ${confirmName} 欄位不一致`;
}
