import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase/f9_config";
import {
  UserState,
  UserData,
  Profile,
  Section,
  ProfileUser,
} from "../../utils/types";

// const initialState: UserState = {
//   firstName: "",
//   lastName: "",
//   username: "",
//   bio: "",
//   isLoading: false,
//   error: null,
// };

const initialState: ProfileUser = {
  userData: {
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
  },
  isLoading: false,
  error: null,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    // setUserData: (state, action: PayloadAction<UserData>) => {
    //   return {
    //     ...state,
    //     ...action.payload,
    //   };
    // },
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setUserData, setLoading, setError } = userDataSlice.actions;

export const saveUserData =
  (userData: UserData) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const user = auth.currentUser;
    if (user) {
      const { firstName, lastName, username, bio, ...otherData } = userData;
      const userRef = doc(db, "users", user.uid);

      try {
        await setDoc(userRef, {
          firstName,
          lastName,
          username,
          bio,
        });
        console.log(firstName + lastName + username + bio);
      } catch (error) {
        dispatch(setError("Error saving user data"));
      }
    }
  };

export const fetchUserData = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading());
  const user = auth.currentUser;
  if (user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userRef);

      console.log(userSnapshot.data());

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as UserData;

        dispatch(setUserData(userData));
        console.log("working" + userData.firstName);
      } else {
        dispatch(setUserData(initialState));
        console.log("not working");
      }
    } catch (error) {
      dispatch(setError("Error fetching user data"));
    }
  }
};

export const selectUserData = (state: RootState) => state.userData.userData;

export default userDataSlice.reducer;
