import { auth } from "../../firebase/f9_config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Dispatch } from "react";

export interface UserLoginAction {
  readonly type: "ON_USER_LOGIN";
  payload: string;
}

export interface UserSignUpAction {
  readonly type: "ON_SIGNUP_USER";
  payload: string;
}

export interface UserErrorAction {
  readonly type: "ON_USER_ERROR";
  payload: any;
}

export type UserAction = UserLoginAction | UserErrorAction | UserSignUpAction;

export const OnUserSignup = (
  email: string,
  username: string,
  password: string
) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log(response);

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "Sign Up Error",
        });
      } else {
        dispatch({
          type: "ON_SIGNUP_USER",
          payload: response.user.uid,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ON_USER_ERROR",
        payload: "Sign Up Error",
      });
    }
  };
};

export const OnUserLogin = (email: string, password: string) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      console.log(response);

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "Login Error",
        });
      } else {
        dispatch({
          type: "ON_USER_LOGIN",
          payload: response.user.uid,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ON_USER_ERROR",
        payload: "Login Error",
      });
    }
  };
};
