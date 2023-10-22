import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../utils/firebase/f9_config";
import { ImageCollectionData, DataState } from "../../model/types";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

//initial state state of slice
const initialState: DataState = {
  userId: null,
  filenames: [],
  feedData: [],
  collectionsData: [],
  isLoading: false,
  error: undefined,
  feedCollectionCovers: [],
  collectionCovers: [],
  isRefreshing: false,
  needsReset: false,
  lastDoc: undefined,
  userData: null,
};

/**
 * Slice Navigation
 *
 * uploadCollectionData - takes actions and dispatches the the data be concatted
 *
 */
const addCollectionSlice = createSlice({
  name: "addCollection",
  initialState,
  reducers: {
    uploadCollectionData: (state, action: PayloadAction<any[]>) => {
      state.collectionsData = state.collectionsData?.concat(action.payload);
      (state.isLoading = false), (state.error = undefined);
    },
    uploadCollectionToFeed: (state, action: PayloadAction<any[]>) => {
      state.collectionsData = state.collectionsData?.concat(action.payload);
    },
    setLoading: (state) => {
      (state.isLoading = true), (state.error = undefined);
    },
    setError: (state, action: PayloadAction<string>) => {
      (state.isLoading = false), (state.error = action.payload);
    },
  },
});

export const {
  uploadCollectionData,
  setLoading,
  setError,
  uploadCollectionToFeed,
} = addCollectionSlice.actions;

export const addCollectionData =
  (dataState: ImageCollectionData) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const user = auth.currentUser;

    if (user) {
      const { title, image, createdAt, editorial } = dataState;

      // const collectionRef = `collections/${user?.uid}/filenames`
      const collectionRef = doc(
        db,
        `collections/${user?.uid}/filenames`,
        title
      );
      const FEED_FILENAMES_REF = doc(db, `feed/allUsers/filenames`, title);

      try {
        console.log("SET COLLECTIONREF TO FEED");
        await setDoc(collectionRef, {
          id: title,
          createdAt: createdAt,
          user: user.uid,
          editorial: editorial,
        });
        console.log("SET FEED_FILENAMES_REF TO FEED");
        await setDoc(FEED_FILENAMES_REF, {
          id: title,
          createdAt: createdAt,
          user: user.uid,
          editorial: editorial,
        });
        console.log("FILENAME ADDED");

        // const FEED_FILENAMES_REF = doc(db, `feed/allUsers/filenames` )

        for (const item of image) {
          const img_firestore_ref = doc(
            db,
            "collections",
            user.uid,
            "files",
            dataState.title,
            "images",
            item.fileName
          );

          const FEED_IMAGES_REF = doc(
            db,
            `feed/allUsers/files/${dataState.title}/images/${item.fileName}`
          );

          const img_storage_ref = ref(
            storage,
            `images/${user.uid}/${title}/${item.fileName}`
          );

          await setDoc(img_firestore_ref, item);
          await setDoc(FEED_IMAGES_REF, item);
          console.log("REACHED IMAGE REF ADD:", item.fileName);
          try {
            const response = await fetch(item.uri);
            console.log("Reached response: ", response);
            if (response.ok) {
              const blob = await response.blob();
              console.log("Reached blob: ", blob);

              //* CODE FOR uploadBytesResumable
              const uploadTask = uploadBytesResumable(img_storage_ref, blob);

              // Listen for state changes, errors, and completion of the upload.
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
                  getDownloadURL(uploadTask.snapshot.ref).then(
                    (downloadURL) => {
                      console.log("File available at", downloadURL);
                      //perform your task
                      item.uri = downloadURL;

                      updateDoc(img_firestore_ref, {
                        uri: item.uri,
                        uid: user.uid,
                      });

                      updateDoc(FEED_IMAGES_REF, {
                        uri: item.uri,
                        uid: user.uid,
                      });

                      dispatch(uploadCollectionData([item]));
                      console.log("\n\nDISPATCHED:", item.fileName);
                    }
                  );
                }
              );
            } else {
              throw new Error("Failed to fetch the image uri");
            }
          } catch (error) {
            console.log("Error uploading images:", error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

export default addCollectionSlice.reducer;
