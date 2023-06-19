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
                });
              }
            );
          }

          // const blob = await new Promise((resolve, reject) => {
          //   const xhr = new XMLHttpRequest();
          //   xhr.onload = function () {
          //     resolve(xhr.response);
          //   };
          //   xhr.onerror = function (e) {
          //     console.log(e);
          //     reject(new TypeError("Network request failed"));
          //   };
          //   xhr.responseType = "blob";
          //   xhr.open("GET", avatar.uri, true);
          //   xhr.send(null);
          // });

          // console.log(blob);
          // try {
          //   await uploadBytes(avatarRef, blob).then((snapshot) => {
          //     console.log("Uploaded: ", snapshot);
          //     getDownloadURL(snapshot.ref).then((downloadURL) => {
          //       console.log("Download link to file", downloadURL);
          //       avatar.uri = downloadURL;
          //       updateDoc(userRef, {
          //         avatar: avatar,
          //       });
          //     });
          //   });
          // } catch (e) {
          //   console.log("Error uploading image", e);
          // }
          // blob.close();

          // // await uploadBytes(avatarRef, blob);

          // // const downloadURL = await getDownloadURL(avatarRef);

          // // console.log(`DOWNLOAD URL: ${downloadURL}`);

          // // const uploadTask = uploadBytesResumable(avatarRef, avatar);

          // // Get the download URL for the uploaded image
          // // const downloadURL = await _snapshot.ref.getDownloadURL();

          // // Update the userData with the download URL
          // const updatedUserData = {
          //   ...userData,
          //   avatar: {
          //     ...avatar,
          //     uri: downloadURL,
          //   },
          // };

          // dispatch(setUserData(updatedUserData));
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
