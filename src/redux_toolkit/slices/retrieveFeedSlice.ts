import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  limit,
  query,
  startAfter,
  QueryDocumentSnapshot,
  getDoc,
} from "firebase/firestore";
import {
  DataState,
  ImageCollectionData,
  ImageData,
  UserData,
} from "../../model/types";
import { db } from "../../utils/firebase/f9_config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logFeedData } from "../../utils/functions";
import { Image } from "react-native/types";

// Initial state of the feed slice
const initialState: DataState = {
  userId: null,
  filenames: [],
  feedData: [],
  collectionsData: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  collectionCovers: [],
  needsReset: false,
  feedCollectionCovers: [],
  lastDoc: null as string | null,
  userData: null,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setFeedData: (state, action: PayloadAction<any[]>) => {
      state.feedData = state.feedData?.concat(action.payload);
      state.isLoading = false;
      state.error = null;
    },
    setFeedCollectionCovers: (state, action: PayloadAction<any[]>) => {
      state.feedCollectionCovers = state.feedCollectionCovers?.concat(
        action.payload
      );
    },
    setLastDoc: (state, action: PayloadAction<string | null>) => {
      state.lastDoc = action.payload;
    },
    resetLastDoc: (state) => {
      state.lastDoc = null;
    },
    addImageToCollection: (state, action: PayloadAction<any>) => {
      state.collectionsData.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.error = null;
    },
    setIsRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeedUserData.fulfilled, (state, action) => {
      state.userData = action.payload;
    });
    builder.addCase(fetchCollectionData.fulfilled, (state, action) => {
      state.collectionsData = action.payload.dataCollection;
      state.userData = action.payload.userData; // Assuming you have a userData field in your state
    });
    builder.addCase(fetchCollectionData.rejected, (state, action) => {
      // Handle the error here, perhaps by setting an error message in your state
      state.error = action.error.message;
    });
  },
});

export const {
  setFeedData,
  setFeedCollectionCovers,
  setLastDoc,
  resetLastDoc,
  addImageToCollection,
  setLoading,
  setIsRefreshing,
  setError,
} = feedSlice.actions;

export const fetchFeedUserData = createAsyncThunk(
  "feed/fetchUserData",
  async (uid: string) => {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data() as UserData;
      return userData;
    }
    throw new Error("User does not exist");
  }
);

export const fetchFeedData =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setLoading(true));
    const state = getState();
    let lastDocID = state.feed.lastDoc;
    let refreshing = state.feed.isRefreshing;

    try {
      let feedFilenamesQuery;
      // console.log("LAST DOC: ", lastDoc);

      // If this is the first batch, we don't need to use startAfter
      console.log(`Refreshing? ${refreshing}`);
      if (!lastDocID) {
        feedFilenamesQuery = query(
          collection(db, "feed/allUsers/filenames"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
      } else if (refreshing) {
        dispatch(setFeedData([]));
        dispatch(setFeedCollectionCovers([]));
        feedFilenamesQuery = query(
          collection(db, "feed/allUsers/filenames"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
      } else {
        // If this isn't the first batch, start fetching after the last document of the previous batch
        const lastDocRef = doc(db, "feed/allUsers/filenames", lastDocID);
        const lastDoc = await getDoc(lastDocRef);

        if (lastDoc.exists()) {
          feedFilenamesQuery = query(
            collection(db, "feed/allUsers/filenames"),
            orderBy("createdAt", "desc"),
            startAfter(lastDoc),
            limit(5)
          );
        }
      }

      const feedFilenamesQuerySnapshot = await getDocs(feedFilenamesQuery);

      feedFilenamesQuerySnapshot.forEach((doc) => {
        console.log(doc.data());
      });

      const filenames = await Promise.all(
        feedFilenamesQuerySnapshot.docs.map((doc) => doc.id)
      );

      filenames.forEach((doc) => {
        console.log("FILENAMES", doc);
      });

      if (feedFilenamesQuerySnapshot.docs.length > 0) {
        lastDocID =
          feedFilenamesQuerySnapshot.docs[
            feedFilenamesQuerySnapshot.docs.length - 1
          ].id;
        dispatch(setLastDoc(lastDocID));
      }

      const feedCollectionData = await Promise.all(
        filenames.map(async (file) => {
          const feedImageCollection: ImageCollectionData[] = [];

          const imgRef = `feed/allUsers/files/${file}/images`;

          const fetchFeedCollections = await getDocs(
            await collection(db, imgRef)
          );

          fetchFeedCollections.forEach(async (item) => {
            feedImageCollection.push({
              image: item.data(),
              title: item.data().title,
              createdAt: item.data().createdAt,
              // userData: userData,
            });
          });

          // logFeedData(feedImageCollection);

          dispatch(setFeedData(feedImageCollection));
          return feedImageCollection;
        })
      );

      // APPEND USER DATA TO COLLECTION COVER ARRAY
      const feedCollectionCoversPromises = feedCollectionData.map(
        async (collection) => {
          const cover = collection.find((image) => image.image.id === 0);
          if (cover) {
            const userData = await dispatch(
              fetchFeedUserData(cover.image.uid)
            ).unwrap();
            return {
              ...cover,
              userData, // Add userData here
            };
          }
          return null;
        }
      );

      const feedCollectionCovers = await Promise.all(
        feedCollectionCoversPromises
      );
      dispatch(setFeedCollectionCovers(feedCollectionCovers));

      feedCollectionCovers.forEach((doc) => {
        console.log("FEEDCOLLECTIONCOVERS:", doc);
      });

      // Cache the fetched data for future use
      cacheData("cached_feed_data", feedCollectionData);

      dispatch(setLoading(false));
      dispatch(setIsRefreshing(false));
      console.log("Fetch data completed"); // Add this line to check if the action is completed
    } catch (error) {
      dispatch(setError("Error"));
      console.log("Error fetching image data :", error);
    }
  };

export const fetchCollectionData = createAsyncThunk(
  "feed/fetchCollectionData",
  async (params: { title: string; uid: string }, thunkAPI) => {
    // Here, use params.title and params.uid to create the necessary query to fetch the collection from Firebase
    // Example:
    const dispatch = thunkAPI.dispatch;
    try {
      console.log;
      const pathRef = `feed/allUsers/files/${params.title}/images`;
      const collectionRef = collection(db, pathRef);
      const collectionSnapshot = await getDocs(collectionRef);
      const userData = await dispatch(fetchFeedUserData(params.uid)).unwrap();
      console.log(`PARAM TITLE: ${params.title}`);

      const dataCollection: ImageCollectionData[] = [];

      collectionSnapshot.docs.map(async (doc) => {
        dataCollection.push({
          image: doc.data(),
          title: doc.data().title,
          createdAt: doc.data().createdAt,
          userData: userData,
        });
      });

      console.log(dataCollection);

      return { dataCollection, userData };
    } catch (error) {
      console.error("fetchCollectionData ERROR:", error);
      return Promise.reject(error);
    }
  }
);

export const fetchCollectionImage = createAsyncThunk(
  "feed/fetchCollectionData",
  async (params: { title: string; uid: string }, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      const pathRef = `feed/allUsers/files/${params.title}/images`;
      const collectionRef = collection(db, pathRef);
      const collectionSnapshot = await getDocs(collectionRef);
      const userData = await dispatch(fetchFeedUserData(params.uid)).unwrap();

      collectionSnapshot.docs.map(async (doc) => {
        const imageCollectionData = {
          image: doc.data(),
          title: doc.data().title,
          createdAt: doc.data().createdAt,
          userData: userData,
        };

        // Dispatch individual image to the collection
        dispatch(addImageToCollection(imageCollectionData));
      });

      return { userData };
    } catch (error) {
      console.error("fetchCollectionImage ERROR:", error);
    }
  }
);

//TODO Create file for cacheData and move methods

// Helper function to cache data in AsyncStorage
const cacheData = async (key: string, data: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // Handle AsyncStorage error
    console.log("Error caching data:", e);
  }
};

// Helper function to retrieve cached data from AsyncStorage
const getCachedData = async (key: string) => {
  try {
    const cachedData = await AsyncStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (e) {
    // Handle AsyncStorage error
    console.log("Error getting cached data:", e);
    return null;
  }
};

export const deleteCachedData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Cached data with key '${key}' has been deleted.`);
  } catch (e) {
    // Handle AsyncStorage error
    console.log("Error deleting cached data:", e);
  }
};

export const selectFeedData = (state: RootState) => state.feed.feedData;
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedError = (state: RootState) => state.feed.error;

export default feedSlice.reducer;
