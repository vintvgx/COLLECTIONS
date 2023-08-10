import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../utils/firebase/f9_config";

export const fetchCollectionData = createAsyncThunk(
  "feed/fetchCollectionData",
  async (params: { title: string; uid: string }) => {
    // Here, use params.title and params.uid to create the necessary query to fetch the collection from Firebase
    // Example:
    const pathRef = `feed/allUsers/files/${params.title}/images`;
    const collectionRef = collection(db, pathRef);
    //   const collectionQuery = query(collectionRef, where("title", "==", params.title));
    const collectionSnapshot = await getDocs(collectionRef);

    // Transform the data into the desired format and return it
    const collectionData = collectionSnapshot.docs.map((doc) => doc.data());
    return collectionData;
  }
);
