// Login
export function login(user) {
  return {
    type:'LOGIN_USER',
    user
  }
};

// Logout
export function logout(user) {
  return {
    type:'LOGOUT_USER',
    user
  }
};

// Page Change

