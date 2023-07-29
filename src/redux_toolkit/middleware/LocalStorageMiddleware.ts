// LocalStorageMiddleware.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Middleware } from "@reduxjs/toolkit";
import { setUser, setLoggedIn } from "../slices/authSlice";

const LocalStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type === setUser.type || action.type === setLoggedIn.type) {
    const state = store.getState();
    AsyncStorage.setItem("user", JSON.stringify(state.auth.user));
    AsyncStorage.setItem("isLoggedIn", state.auth.isLoggedIn.toString());
  }

  return result;
};

export default LocalStorageMiddleware;
