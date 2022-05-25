const TOKEN = "syw-token";

export function storeToken(value) {
  localStorage.setItem(`${TOKEN}`, value);
}

export function getToken() {
  return localStorage.getItem(`${TOKEN}`);
}

export function removeToken() {
  return localStorage.removeItem(`${TOKEN}`);
}
