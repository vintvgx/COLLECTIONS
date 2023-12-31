import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  getDocs,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCPCqvRcC8i2_HyImMJ9PewwTpPc7ss3fs",
  authDomain: "collections-75907.firebaseapp.com",
  projectId: "collections-75907",
  storageBucket: "collections-75907.appspot.com",
  messagingSenderId: "13134474216",
  appId: "1:13134474216:web:9249d2c97f3b48afcc525d",
  measurementId: "G-3C9QWYHCXB",
};

//* Initialize Firebase
const app = initializeApp(firebaseConfig);

// //* Enable offline persistence for Realtime Database
// firebase.database().setPersistenceEnabled(true);

// //* Enable offline persistence for Firestore
// firebase.firestore().enablePersistence();

//*  Cloud Firestore Exports
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

//* function uploads image to firebase.storage()
const _uploadImage = async (uri, filename, title, imageRef) => {
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
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const img_path =
    "images/" + auth.currentUser.uid + "/" + title + "/" + filename;
  console.log("Path is: ", img_path);

  const storageRef = ref(storage, img_path);

  try {
    console.log("uploading image ", filename);
    await uploadBytes(storageRef, blob).then((snapshot) => {
      console.log("Uploaded: ", snapshot);
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log("Download link to file", downloadURL);
        updateDoc(imageRef, {
          imgUri: downloadURL,
        });
      });
    });
  } catch (e) {
    console.log("Error uploading image", e);
  }
  blob.close();
};

//* FUNCTION UPLOADS DATA TO FIREBASE AND USES _uploadimage TO UPLOAD
export const _saveData = async (text, item) => {
  let confirmation = true;
  console.log("Saving Data to: ", text);
  console.log(item.length, " images");

  item.map(async (collection) => {
    const coll_data = {
      title: text,
      images: collection,
    };
    const imageRef = doc(
      db,
      "collections",
      auth.currentUser.uid,
      "files",
      coll_data.title,
      "images",
      coll_data.images.fileName
    );

    try {
      const imageRef = doc(
        db,
        "collections",
        auth.currentUser.uid,
        "files",
        coll_data.title,
        "images",
        coll_data.images.fileName
      );
      await setDoc(imageRef, coll_data);
      _uploadImage(
        coll_data.images.uri,
        coll_data.images.fileName,
        coll_data.title,
        imageRef
      );
      confirmation = true;
    } catch (e) {
      console.log("Error adding document", e);
      confirmation = false;
    }
  });

  try {
    const fileName_ref = doc(
      db,
      "collections",
      auth.currentUser.uid,
      "filenames",
      text
    );
    await setDoc(fileName_ref, { id: text });
    confirmation = true;
  } catch (e) {
    console.log("Error adding filename", e);
    confirmation = false;
  }
  return confirmation;
};

//* RETRIEVES FILENAMES TO BE USED IN MAIN.JS
export const _getFilenames = async (collection_return) => {
  const filenames_ref = `collections/${auth.currentUser.uid}/filenames`;

  const querySnapshot = await getDocs(collection(db, filenames_ref));
  querySnapshot.forEach((doc) => {
    const result = doc.id;
    collection_return.push(result);
  });
  console.log("get filenames returned:", collection_return);
};

//* SIGN OUT METHOD USED IN MAIN.JS
export const userSignOut = () => {
  signOut(auth).then(() => {
    console.log("SIGNED OUT");
  });
};

//* UPDATE COLLECTION FROM PROFILE WHEN IN EDIT MODE
export const updateProfileCollection = async (
  uid,
  title,
  updatedImages, // Assume this is an array of updated images with new ids
  updatedEditorial
) => {
  try {
    // First, update the description for the collection
    const collectionEditorialRef = doc(
      db,
      `collections/${uid}/filenames`,
      title
    );
    const feedEditorialRef = doc(db, "feed/allUsers/filenames", title);

    await updateDoc(collectionEditorialRef, {
      editorial: updatedEditorial,
    }).catch((error) => {
      console.error("Error updating collection description:", error);
      throw error;
    });

    await updateDoc(feedEditorialRef, {
      editorial: updatedEditorial,
    }).catch((error) => {
      console.error("Error updating collection description:", error);
      throw error;
    });

    // Loop through each updated image and update only the id field in Firestore
    for (const updatedImage of updatedImages) {
      // user profile reference
      const profileCollectionRef = doc(
        db,
        `collections/${uid}/files/${title}/images/${updatedImage.image.fileName}`
      );

      // feed reference
      const feedCollectionRef = doc(
        db,
        `feed/allUsers/files/${title}/images/${updatedImage.image.fileName}`
      );

      // Update only the 'id' field for this Firestore document
      await updateDoc(profileCollectionRef, {
        id: updatedImage.image.id,
      }).catch((error) => {
        console.error("Error updating image id:", updatedImage.fileName, error);
        throw error;
      });

      // Update only the 'id' field for the specified doc in
      await updateDoc(feedCollectionRef, { id: updatedImage.image.id }).catch(
        (error) => {
          console.error(
            "Error updating image id:",
            updatedImage.fileName,
            error
          );
          throw error;
        }
      );
    }
    console.log("Successfully updated collection");
  } catch (error) {
    console.error("General error updating collection:", error);
  }
};
