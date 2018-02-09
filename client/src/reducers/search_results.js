export default (state=null, action) => {
  switch (action.type) {
    case 'SET_SEARCH_RESULTS':
      return action.payload;
      break;
  }
  return state;
}