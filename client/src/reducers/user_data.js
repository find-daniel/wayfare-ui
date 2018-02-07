export default (state=null, action) => {
  switch(action.type) {
      case "GET_USER_DATA":
        return action.payload;
        break;
  }
  return state
}