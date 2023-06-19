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
import { auth, db, storage } from "../../firebase/f9_config";
import {
  UserState,
  UserData,
  Profile,
  Section,
  ProfileUser,
} from "../../utils/types";
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
      time: "null",
      date: "null",
      fileName: "",
      fileSizE: 2,
      height: 2,
      type: "",
      uri: "",
      width: 2,
    },
  },
  isLoading: false,
  error: null,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
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
      const { firstName, lastName, username, bio, avatar } = userData;
      const userRef = doc(db, "users", user.uid);

      console.log("first Name?:" + firstName);

      try {
        await setDoc(userRef, {
          firstName,
          lastName,
          username,
          bio,
        });
        console.log(firstName + lastName + username + bio);
        console.log("is avatar?:" + avatar.assetId);

        // Upload the avatar image to Firebase Storage
        if (avatar) {
          console.log("AVATAR FUNCTION RAN");
          // const storageRef = storage.ref();
          // const avatarRef = storageRef.child(`${user.uid}/avatar.jpg`);

          const avatarRef = ref(storage, `${user.uid}/avatar.jpg`);
          // console.log(avatarRef);

          // Upload the image as a base64 string
          // const snapshot = await avatarRef.putString(avatar.base64, "base64");

          // const _snapshot = new Uint8Array([
          //   0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c,
          //   0x64, 0x21,
          // ]);
          // uploadBytes(avatarRef, _snapshot).then((snapshot) => {
          //   console.log("Uploaded an array!");
          //   console.log(snapshot);
          //   const downloadURL = await _snapshot.ref.getDownloadURL();
          // });

          // const response = await fetch(avatar.uri);
          // const blob = await response.blob();

          const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function (e) {
              console.log(e);
              reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", avatar.uri, true);
            xhr.send(null);
          });

          console.log(blob);
          try {
            await uploadBytes(avatarRef, blob).then((snapshot) => {
              console.log("Uploaded: ", snapshot);
              getDownloadURL(snapshot.ref).then((downloadURL) => {
                console.log("Download link to file", downloadURL);
                avatar.uri = downloadURL;
                updateDoc(userRef, {
                  avatar: avatar,
                });
              });
            });
          } catch (e) {
            console.log("Error uploading image", e);
          }
          blob.close();

          // await uploadBytes(avatarRef, blob);

          // const downloadURL = await getDownloadURL(avatarRef);

          // console.log(`DOWNLOAD URL: ${downloadURL}`);

          // const uploadTask = uploadBytesResumable(avatarRef, avatar);

          // Get the download URL for the uploaded image
          // const downloadURL = await _snapshot.ref.getDownloadURL();

          // Update the userData with the download URL
          const updatedUserData = {
            ...userData,
            avatar: {
              ...avatar,
              uri: downloadURL,
            },
          };

          dispatch(setUserData(updatedUserData));
        }
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
