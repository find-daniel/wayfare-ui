export const setActiveUser = (user) => {
  return {
    type: 'ACTIVE_USER',
    payload: user
  }
} 

export const setUserData = (data) => {
  return {
    type: 'GET_USER_DATA',
    payload: data
  }
} 