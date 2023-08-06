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

// Initial state of the feed slice
const initialState: DataState = {
  userId: null,
  filenames: [],
  feedData: [],
  collectionsData: [],
  isLoading: false,
  error: null,
  collectionCovers: [],
  needsReset: false,
  feedCollectionCovers: [],
  lastDoc: null,
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
    setLastDoc: (
      state,
      action: PayloadAction<QueryDocumentSnapshot | null>
    ) => {
      state.lastDoc = action.payload;
    },
    resetLastDoc: (state) => {
      state.lastDoc = null;
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
  extraReducers: (builder) => {
    builder.addCase(fetchFeedUserData.fulfilled, (state, action) => {
      state.userData = action.payload;
    });
  },
});

export const {
  setFeedData,
  setFeedCollectionCovers,
  setLastDoc,
  resetLastDoc,
  setLoading,
  setError,
} = feedSlice.actions;

export const fetchFeedUserData = createAsyncThunk(
  "feed/fetchUserData",
  async (uid: string) => {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      return userSnapshot.data() as UserData;
    }
    throw new Error("User does not exist");
  }
);

export const fetchMoreFeedData =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setLoading(true));
    const state = getState();
    let lastDoc = state.feed.lastDoc;

    try {
      let feedFilenamesQuery;

      feedFilenamesQuery = query(
        collection(db, "feed/allUsers/filenames"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(5)
      );

      const feedFilenamesQuerySnapshot = await getDocs(feedFilenamesQuery);

      const filenames = await Promise.all(
        feedFilenamesQuerySnapshot.docs.map((doc) => doc.id)
      );

      lastDoc =
        feedFilenamesQuerySnapshot.docs[
          feedFilenamesQuerySnapshot.docs.length - 1
        ];
      const lastDocData = lastDoc.data();
      dispatch(setLastDoc(lastDocData)); // Update the last document in the Redux state
      console.log("LAST DOC: ", lastDocData);
    } catch (error) {
      console.log(error);
    }
  };

export const fetchFeedData =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setLoading(true));
    const state = getState();
    let lastDoc = state.feed.lastDoc;
    if (state.feed.hasFetchedAll) {
      // If all data has been fetched, return without initiating the fetch
      return;
    }

    try {
      let feedFilenamesQuery;
      console.log("LAST DOC: ", lastDoc);

      // If this is the first batch, we don't need to use startAfter
      if (!lastDoc) {
        feedFilenamesQuery = query(
          collection(db, "feed/allUsers/filenames"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
      } else {
        // If this isn't the first batch, start fetching after the last document of the previous batch
        feedFilenamesQuery = query(
          collection(db, "feed/allUsers/filenames"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(5)
        );
      }

      const feedFilenamesQuerySnapshot = await getDocs(feedFilenamesQuery);

      const filenames = await Promise.all(
        feedFilenamesQuerySnapshot.docs.map((doc) => doc.id)
      );

      // console.log("FEEDFILENAMESQUERY: ", feedFilenamesQuery);
      // console.log("feedFilenamesQuerySnapshot: ", feedFilenamesQuerySnapshot);
      // console.log("FILENAMES:", filenames);

      if (feedFilenamesQuerySnapshot.docs.length > 0) {
        lastDoc =
          feedFilenamesQuerySnapshot.docs[
            feedFilenamesQuerySnapshot.docs.length - 1
          ];
        const lastDocData = lastDoc.data();
        dispatch(setLastDoc(lastDoc)); // Update the last document in the Redux state
        console.log("LAST DOC: ", lastDocData);
      }

      const feedCollectionData = await Promise.all(
        filenames.map(async (file) => {
          const feedImageCollection: ImageCollectionData[] = [];

          const imgRef = `feed/allUsers/files/${file}/images`;

          const fetchFeedCollections = await getDocs(
            await collection(db, imgRef)
          );

          fetchFeedCollections.forEach((item) => {
            feedImageCollection.push({
              image: item.data(),
              title: item.data().title,
              date: item.data().date,
            });
          });

          // logFeedData(feedImageCollection);

          dispatch(setFeedData(feedImageCollection));
          return feedImageCollection;
        })
      );

      const feedCollectionCovers = feedCollectionData.map(
        (collection) => collection[0]
      );
      dispatch(setFeedCollectionCovers(feedCollectionCovers));

      // Cache the fetched data for future use
      cacheData("cached_feed_data", feedCollectionData);

      dispatch(setLoading(false));
      console.log("Fetch data completed"); // Add this line to check if the action is completed
    } catch (error) {
      dispatch(setError("Error"));
      console.log("Error uploading images:", error);
    }
  };

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
