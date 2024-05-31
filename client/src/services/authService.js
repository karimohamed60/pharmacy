import Cookies from "js-cookie";

const setAuthTokenCookie = (token) => {
  Cookies.set("token", token, { expires: 1 / 48 }); // , secure: true option for HTTPS only
};

const getAuthTokenCookie = () => {
  return Cookies.get("token") || null;
};

const clearAuthTokenCookie = () => {
  Cookies.remove("token");
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

const isAuthenticated = () => {
  return getAuthTokenCookie();
};

export {
  setAuthTokenCookie,
  getAuthTokenCookie,
  clearAuthTokenCookie,
  isAuthenticated,
};
