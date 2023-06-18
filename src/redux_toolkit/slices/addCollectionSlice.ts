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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

//initial state
const initialState: DataState = {
  userId: null,
  filenames: [],
  collectionsData: [],
  isLoading: false,
  error: null,
  collectionCovers: [],
};

const addCollectionSlice = createSlice({
  name: "addCollection",
  initialState,
  reducers: {
    uploadCollectionData: (state, action: PayloadAction<any[]>) => {
      state.collectionsData = state.collectionsData?.concat(action.payload);
      (state.isLoading = false), (state.error = null);
    },
    setLoading: (state) => {
      (state.isLoading = true), (state.error = null);
    },
    setError: (state, action: PayloadAction<string>) => {
      (state.isLoading = false), (state.error = action.payload);
    },
  },
});

export const { uploadCollectionData, setLoading, setError } =
  addCollectionSlice.actions;

export const addCollectionData =
  (dataState: ImageCollectionData) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const user = auth.currentUser;

    if (user) {
      const { title, images } = dataState;

      // const collectionRef = `collections/${user?.uid}/filenames`
      const collectionRef = doc(
        db,
        `collections/${user?.uid}/filenames`,
        title
      );

      try {
        await setDoc(collectionRef, {
          id: title,
        });

        for (const item of images) {
          const img_firestore_ref = doc(
            db,
            "collections",
            user.uid,
            "files",
            dataState.title,
            "images",
            item.fileName
          );

          const img_storage_ref = ref(
            storage,
            `images/${user.uid}/${title}/${item.fileName}`
          );

          await setDoc(img_firestore_ref, item);
          try {
            const response = await fetch(item.uri);
            if (response.ok) {
              const blob = await response.blob();
              // Rest of the code
              const snapshot = await uploadBytes(img_storage_ref, blob);
              console.log("Image Uploaded: ", snapshot);

              const downloadURL = await getDownloadURL(snapshot.ref);
              console.log("Download link to file", downloadURL);
              item.uri = downloadURL;

              await updateDoc(img_firestore_ref, {
                uri: item.uri,
              });
              const updatedCollectionData = {
                item,
                imgURI: item.uri,
                title,
              };

              dispatch(uploadCollectionData([updatedCollectionData]));
            } else {
              throw new Error("Failed to fetch the image");
            }
          } catch (error) {
            console.log("Error fetching the image:", error);
          }
        }
        //   // const blob = await new Promise((resolve, reject) => {
        //   //   const xhr = new XMLHttpRequest();
        //   //   xhr.onload = function () {
        //   //     resolve(xhr.response);
        //   //   };
        //   //   xhr.onerror = function (e) {
        //   //     console.log(e);
        //   //     reject(new TypeError("Network request failed"));
        //   //   };
        //   //   xhr.responseType = "blob";
        //   //   xhr.open("GET", item.uri, true);
        //   //   xhr.send(null);
        //   // });

        //   const snapshot = await uploadBytes(img_storage_ref, blob);
        //   console.log("Image Uploaded: ", snapshot);

        //   const downloadURL = await getDownloadURL(snapshot.ref);
        //   console.log("Download link to file", downloadURL);
        //   item.uri = downloadURL;

        //   await updateDoc(img_firestore_ref, {
        //     uri: item.uri,
        //   });

        //   blob.close();

        //   const updatedCollectionData = {
        //     item,
        //     imgURI: item.uri,
        //     title,
        //   };

        //   dispatch(uploadCollectionData([updatedCollectionData]));
        // }
      } catch {
        console.log("error");
      }
    }
  };

// export const selectaddCollection = (state: RootState) => state.addCollection;

export default addCollectionSlice.reducer;

// export const blah = createSlice({
//     name: 'collection',
//     initialState: {},
//     reducers: {
//       addCollection: async (state, action) => {
//         const { images, collectionTitle } = action.payload;
//         const user = auth.currentUser;

//         // Create a new collection document in Firestore
//         const collectionRef = `collections/${user?.uid}/filenames`
//         try {
//             await setDoc(collectionRef, )
//         }
//         // const collectionRef = await db.collection('collections').add({
//         //   title: collectionTitle,
//         //   userId: user,
//         //   uploadTime: new Date().toLocaleTimeString(),
//         // });

//         const collectionId = collectionRef.id;

//         // Store the image filenames in Firestore
//         const filenamesRef = db.collection(`collections/${user}/filenames`).doc();
//         await filenamesRef.set({ collectionId });

//         // Upload the images to Firebase Storage and update Firestore with download URLs
//         const storagePromises = images.map(async (image) => {
//           const imageRef = storage.child(`collections/${collectionId}/images/${image.uri}`);
//           await imageRef.put(image.uri);
//           const downloadURL = await imageRef.getDownloadURL();

//           await db
//             .collection(`collections/${user}/files/${collectionId}/images`)
//             .add({ downloadURL });
//         });

//         await Promise.all(storagePromises);
//       },
//     },
//   });

//   export const { addCollection } = collectionSlice.actions;

//   export default collectionSlice.reducer;
