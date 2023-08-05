import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
} from "firebase/firestore";
import { DataState, ImageCollectionData, ImageData } from "../../model/types";
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
  feedCollectionCovers: [],
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.error = null;
      console.log("STATE OF LOADING: ", state.isLoading);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setFeedData, setFeedCollectionCovers, setLoading, setError } =
  feedSlice.actions;

let lastDoc: QueryDocumentSnapshot | null = null;

export const fetchFeedData = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    let feedFilenamesQuery;

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

    if (feedFilenamesQuerySnapshot.docs.length > 0) {
      lastDoc =
        feedFilenamesQuerySnapshot.docs[
          feedFilenamesQuerySnapshot.docs.length - 1
        ];
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
