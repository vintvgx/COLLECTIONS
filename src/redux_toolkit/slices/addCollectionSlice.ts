import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase/f9_config";
import { ImageCollectionData, DataState, Collections } from "../../utils/types";
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
  collectionsData: [],
  isLoading: false,
  error: null,
  collectionCovers: [],
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
      (state.isLoading = false), (state.error = null);
    },
    uploadCollectionToFeed: (state, action: PayloadAction<any[]>) => {
      state.collectionsData = state.collectionsData?.concat(action.payload);
    },
    setLoading: (state) => {
      (state.isLoading = true), (state.error = null);
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
      const { title, image } = dataState;

      // const collectionRef = `collections/${user?.uid}/filenames`
      const collectionRef = doc(
        db,
        `collections/${user?.uid}/filenames`,
        title
      );
      const FEED_FILENAMES_REF = doc(db, `feed/allUsers/filenames`, title);

      try {
        //TODO: REMOVE COMMENTS / uploadResumableBytes fixed app crash
        console.log("TOP");
        await setDoc(collectionRef, {
          id: title,
        });
        await setDoc(FEED_FILENAMES_REF, {
          id: title,
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
            `feed/filenames/${dataState.title}/images`
          );

          const img_storage_ref = ref(
            storage,
            `images/${user.uid}/${title}/${item.fileName}`
          );

          await setDoc(img_firestore_ref, item);
          // await setDoc(FEED_IMAGES_REF, item);
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

                      setDoc(FEED_IMAGES_REF, {
                        ...item,
                        uid: user.uid,
                      });

                      // const updatedCollectionData = {
                      //   item,
                      //   title,
                      //   date
                      // };

                      dispatch(uploadCollectionData([item]));
                      console.log("\n\nDISPATCHED:", item.fileName);
                    }
                  );
                }
              );

              //* CODE FOR uploadBytes
              // Rest of the code
              // const snapshot = await uploadBytes(img_storage_ref, blob);
              // console.log("Reached SNAPSHOT -> Image Uploaded: ", snapshot);

              // const downloadURL = await getDownloadURL(snapshot.ref);
              // console.log("Download link to file", downloadURL);
              // item.uri = downloadURL;

              // await updateDoc(img_firestore_ref, {
              //   uri: item.uri,
              // });
              // const updatedCollectionData = {
              //   item,
              //   imgURI: item.uri,
              //   title,
              // };

              // dispatch(uploadCollectionData([updatedCollectionData]));
              // console.log("\n\nDISPATCHED:", item.fileName);
            } else {
              throw new Error("Failed to fetch the image uri");
            }
          } catch (error) {
            console.log("Error uploading images:", error);
          }
        }
      } catch {
        console.log("error");
      }
    }
  };

export default addCollectionSlice.reducer;
