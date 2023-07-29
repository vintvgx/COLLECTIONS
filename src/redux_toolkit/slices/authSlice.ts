import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { auth } from "../../firebase/f9_config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

interface AuthState {
  isLoggedIn: boolean;
  user: {
    id: string;
    email: string;
    // Add other relevant user information here
  } | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setUser: (state, action: PayloadAction<any>) => {
      const { uid, email } = action.payload;
      state.user = { id: uid, email };
    },
  },
});

export const { setLoggedIn, setUser } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

// Function to save user data in local storage
const saveUserToLocalStorage = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Function to remove user data from local storage
const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
};

export const OnUserSignup = createAsyncThunk<
  string,
  { email: string; username: string; password: string }
>("auth/onUserSignup", async ({ email, username, password }, thunkAPI) => {
  try {
    console.log("SIGNUP");

    const user = await createUserWithEmailAndPassword(auth, email, password);

    console.log(user);

    // Save user data to AsyncStorage
    await AsyncStorage.setItem("user", JSON.stringify(user));
    await AsyncStorage.setItem("isLoggedIn", "true");

    thunkAPI.dispatch(setUser(user)); // Update user state in Redux
    thunkAPI.dispatch(setLoggedIn(true)); // Update isLoggedIn state in Redux

    return "Signup Success";
  } catch (error) {
    return thunkAPI.rejectWithValue("Sign Up Error");
  }
});

export const OnUserLogin = createAsyncThunk<
  string,
  { email: string; password: string }
>("auth/onUserLogin", async ({ email, password }, thunkAPI) => {
  try {
    console.log("LOGIN" + email + password + thunkAPI);
    const user = await signInWithEmailAndPassword(auth, email, password);

    console.log(user);

    // Save user data to AsyncStorage
    await AsyncStorage.setItem("user", JSON.stringify(user));
    await AsyncStorage.setItem("isLoggedIn", "true");

    thunkAPI.dispatch(setUser(user)); // Update user state in Redux
    thunkAPI.dispatch(setLoggedIn(true)); // Update isLoggedIn state in Redux

    return "Login Success";
  } catch (error) {
    return thunkAPI.rejectWithValue("Login Error");
  }
});

export default authSlice.reducer;
