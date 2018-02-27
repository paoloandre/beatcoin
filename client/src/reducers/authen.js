// import isEmpty from "lodash/isEmpty";
//
// const initialState = {
//   isAuthenticated: false,
//   user: {}
// };
//
// export default (state = initialState, action = {}) => {
//   switch (action.type) {
//     case "SET_CURRENT_USER":
//       return {
//         isAuthenticated: !isEmpty(action.user),
//         username: action.user.username,
//         email: action.user.email,
//         name: action.user.name,
//         card: action.user.creditCard,
//         id: action.user._id
//       };
//
//     default:
//       return state;
//   }
// };
