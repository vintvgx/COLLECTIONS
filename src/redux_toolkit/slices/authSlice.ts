import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { auth } from "../../utils/firebase/f9_config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setError, setLoading } from "./filenameSlice";

interface AuthState {
  isLoggedIn: boolean;
  user: {
    id: string;
    email: string;
    // Add other relevant user information here
  } | null;
  isProfileSet: boolean;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  isProfileSet: false,
  isLoading: false,
  error: undefined,
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
    authLoading: (state, action: PayloadAction<boolean>) => {
      (state.isLoading = action.payload), (state.error = undefined);
    },
    authError: (state, action: PayloadAction<string>) => {
      (state.isLoading = false), (state.error = action.payload);
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
});

export const { setLoggedIn, setUser, authLoading, authError, clearError } =
  authSlice.actions;

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
    // await AsyncStorage.setItem("user", JSON.stringify(user));
    // await AsyncStorage.setItem("isLoggedIn", "true");

    // thunkAPI.dispatch(setUser(user)); // Update user state in Redux
    // thunkAPI.dispatch(setLoggedIn(true)); // Update isLoggedIn state in Redux

    return "Signup Success";
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue("Sign Up Error " + error);
  }
});

// OnUserLogin function
export const OnUserLogin = createAsyncThunk<
  string,
  { email: string; password: string }
>("auth/onUserLogin", async ({ email, password }, thunkAPI) => {
  try {
    thunkAPI.dispatch(authLoading(true));

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      // Save user data to AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("isLoggedIn", "true");

      thunkAPI.dispatch(setUser(user)); // Update user state in Redux
      thunkAPI.dispatch(setLoggedIn(true)); // Update isLoggedIn state in Redux
      thunkAPI.dispatch(authLoading(false));
      return "Login Success";
    } catch (error) {
      console.log(error);
      const errorCode = error?.code;
      const errorMessage = getFirebaseErrorMessage(errorCode);
      thunkAPI.dispatch(authError(errorMessage));
      if (errorCode === "auth/user-not-found") {
        return thunkAPI.rejectWithValue("User Not Found");
      } else {
        return thunkAPI.rejectWithValue("Login Error");
      }
    }
  } catch (error) {
    thunkAPI.dispatch(setError("Login Error"));
    return thunkAPI.rejectWithValue("Login Error");
  }
});

// Utility function to translate Firebase error codes to user-friendly messages
const getFirebaseErrorMessage = (code: string | undefined): string => {
  switch (code) {
    case "auth/invalid-email":
      return "Invalid Email";
    case "auth/user-disabled":
      return "User Disabled";
    case "auth/user-not-found":
      return "User Not Found";
    case "auth/wrong-password":
      return "Wrong Password";
    case "auth/missing-password":
      return "Enter Password";
    case "auth/too-many-requests":
      return "Exceeded Attempts. Try Later!";
    default:
      return "An unknown error occurred";
  }
};

export default authSlice.reducer;
