export default (state=null, action) => {
  switch(action.type) {
    case "ACTIVE_USER":
      return action.payload;
      break;
    }
    return state
}