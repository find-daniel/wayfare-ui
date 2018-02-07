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

export const activeUser = (user) => {

  return {
    type: 'ACTIVE_USER',
    payload: user
  }
} 


export const userData = (data) => {
  return {
    type: 'GET_USER_DATA',
    payload: data
  }
} 