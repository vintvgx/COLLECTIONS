export * from "./store";
export * from "./actions";
export * from "./models";
export * from "./reducers";

// import { Reducer } from 'redux';
// import { UserAction } from '../redux/actions/userActions'

// export interface UserState {
//   userId: string | null;
//   error: string | null;
// }

// const initialState: UserState = {
//   userId: null,
//   error: null,
// };

// export const UserReducer: Reducer<UserState, UserAction> = (
//   state = initialState,
//   action
// ) => {
//   switch (action.type) {
//     case 'ON_USER_LOGIN':
//       return {
//         ...state,
//         userId: action.payload,
//         error: null,
//       };
//     case 'ON_USER_ERROR':
//       return {
//         ...state,
//         error: action.payload,
//       };
//     default:
//       return state;
//   }
// };
