import { UserAction } from "../actions/userActions";
import { UserModel, UserState } from "../models";

const initialState: UserState = {
  user: {} as UserModel,
  error: undefined,
};

export const UserReducer = (
  state: UserState = initialState,
  action: UserAction
) => {
  const { type, payload } = action;

  switch (type) {
    case "ON_USER_LOGIN":
      console.log("User Token" + action.payload);

    default:
      return state;
  }
};
