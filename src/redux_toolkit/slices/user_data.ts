import {
  Action,
  createSlice,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../utils/firebase/f9_config";
import {
  UserState,
  UserData,
  Profile,
  Section,
  ProfileUser,
} from "../../model/types";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

const initialState: ProfileUser = {
  userData: {
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    avatar: {
      assetId: "",
      title: "",
      id: 0,
      createdAt: "",
      fileName: "",
      fileSizE: 2,
      height: 2,
      type: "",
      uri: "",
      width: 2,
    },
    settings: {
      darkMode: false,
    },
  },
  isProfileSet: false,
  isLoading: false,
  error: null,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<ProfileUser>) => {
      state.userData = action.payload;
    },
    setIsProfileSet: (state, action: PayloadAction<boolean>) => {
      state.isProfileSet = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      if (state.userData.settings?.darkMode)
        state.userData.settings.darkMode = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setUserData,
  setIsProfileSet,
  setLoading,
  setError,
  setDarkMode,
} = userDataSlice.actions;

export const saveUserData =
  (userData: UserData) => async (dispatch: AppDispatch) => {
    const user = auth.currentUser;
    if (user) {
      const { firstName, lastName, username, bio, avatar } = userData;
      const userRef = doc(db, "users", user.uid);

      try {
        await setDoc(userRef, {
          firstName,
          lastName,
          username,
          bio,
        });

        // Upload the avatar image to Firebase Storage
        if (avatar) {
          console.log("UPLOADING AVATAR");

          const avatarRef = ref(storage, `${user.uid}/avatar.jpg`);

          const response = await fetch(avatar.uri);

          if (response.ok) {
            const blob = await response.blob();
            const uploadTask = uploadBytesResumable(avatarRef, blob);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                  case "paused":
                    console.log("Upload is paused");
                    break;
                  case "running":
                    console.log("Upload is running");
                    break;
                }
              },
              (error) => {
                // this.setState({ isLoading: false })
                // dispatch(setLoading())
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                  case "storage/unauthorized":
                    console.log(
                      "User doesn't have permission to access the object"
                    );
                    break;
                  case "storage/canceled":
                    console.log("User canceled the upload");
                    break;
                  case "storage/unknown":
                    console.log(
                      "Unknown error occurred, inspect error.serverResponse"
                    );
                    break;
                }
              },
              () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  console.log("File available at", downloadURL);

                  //perform your task
                  avatar.uri = downloadURL;

                  updateDoc(userRef, {
                    avatar: avatar,
                  });

                  const updatedUserData = {
                    ...userData,
                    avatar: {
                      ...avatar,
                      uri: downloadURL,
                    },
                  };

                  dispatch(setUserData(updatedUserData));
                  dispatch(setIsProfileSet(true));
                });
              }
            );
          }
        }
      } catch (error) {
        dispatch(setError("Error saving user data"));
      }
    }
  };

export const fetchUserData =
  (): ThunkAction<Promise<ProfileUser>, RootState, undefined, Action<string>> =>
  async (dispatch: AppDispatch): Promise<ProfileUser> => {
    dispatch(setLoading(true));
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        console.log(userSnapshot.data());

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data() as ProfileUser;

          dispatch(setUserData(userData));
          return {
            userData: userData.userData as UserData,
            isProfileSet: true,
            isLoading: false,
            error: null,
          };
        } else {
          dispatch(setUserData(initialState));
          console.log("not working");
        }
      } catch (error) {
        dispatch(setError("Error fetching user data"));
      }
      dispatch(setLoading(false));
    }
    return initialState;
  };

export const setDarkModeInFirebase =
  (darkMode: boolean) => async (dispatch: AppDispatch) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          "settings.darkMode": darkMode,
        });
        dispatch(setDarkMode(darkMode)); // Update local Redux store
      } catch (error) {
        dispatch(setError("Error setting dark mode"));
      }
    }
  };

export const fetchDarkModeFromFirebase =
  () => async (dispatch: AppDispatch) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data() as UserData;
          const darkMode = userData.settings?.darkMode ?? false;
          dispatch(setDarkMode(darkMode)); // Update local Redux store
        }
      } catch (error) {
        dispatch(setError("Error fetching dark mode"));
      }
    }
  };

export const selectUserData = (state: RootState) => state.userData.userData;
export const selectIsProfileSet = (state: RootState) =>
  state.userData.isProfileSet;

export default userDataSlice.reducer;
