const setUserRole = (role) => {
  localStorage.setItem("role", role);
};

const getUserRole = () => {
  return localStorage.getItem("role");
};

export { setUserRole, getUserRole };
