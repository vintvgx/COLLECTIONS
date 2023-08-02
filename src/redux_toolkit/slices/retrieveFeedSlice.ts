import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { collection, doc, getDocs } from "firebase/firestore";
import { DataState, ImageCollectionData, ImageData } from "../../model/types";
import { db } from "../../utils/firebase/f9_config";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      state.feedCollectionCovers = action.payload;
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

export const fetchFeedData = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    //TODO Update handling cache data / retrieve + delete on refresh
    // const cachedFeedData = await getCachedData("cached_feed_data");

    // if (cachedFeedData) {
    //   console.log("CACHED_DATA CALLED");

    //   // If cached data is available, use it directly from AsyncStorage
    //   dispatch(setFeedData(cachedFeedData));

    //   const feedCollectionCovers = cachedFeedData.map(
    //     (collection: any[]) => collection[0]
    //   );
    //   dispatch(setFeedCollectionCovers(feedCollectionCovers));

    //   dispatch(setLoading(false)); // Set isLoading to false

    //   // console.log(cachedFeedData);
    //   console.log("reached");
    //   return;
    // }
    // dispatch(setFeedData([]));

    const feedFilenamesQuerySnapshot = await getDocs(
      collection(db, "feed", "allUsers", "filenames")
    );

    const filenames = await Promise.all(
      feedFilenamesQuerySnapshot.docs.map((doc) => doc.id)
    );

    const feedCollectionData = await Promise.all(
      filenames.map(async (file) => {
        const feedImageCollection: ImageCollectionData[] = [];

        const imgRef = `feed/allUsers/files/${file}/images`;

        const fetchFeedCollections = await getDocs(
          await collection(db, imgRef)
        );

        fetchFeedCollections.forEach((item) => {
          //   console.log(item.data());
          //! DISPLAYS OBJECT LINE BY LINE !!!//
          //  console.log(JSON.stringify(item.data(), null, 2));
          feedImageCollection.push({
            image: item.data(),
            title: item.data().title,
            date: item.data().date,
          });
        });

        //! DISPLAYS OBJECT LINE BY LINE !!!//
        // console.log(
        //   "ORIG FEED DATA:",
        //   JSON.stringify(feedImageCollection, null, 2)
        // );

        dispatch(setFeedData(feedImageCollection));
        return feedImageCollection;
      })
    );

    const feedCollectionCovers = feedCollectionData.map(
      (collection) => collection[0]
    );
    dispatch(setFeedCollectionCovers(feedCollectionCovers));

    const flattenedFeedCollectionData = feedCollectionData.flat();
    // console.log("FLAT: ", flattenedFeedCollectionData);
    //! DISPLAYS OBJECT LINE BY LINE !!!//
    // console.log(
    //   "FLATTENED:",
    //   JSON.stringify(flattenedFeedCollectionData, null, 2)
    // );

    // Cache the fetched data for future use
    cacheData("cached_feed_data", feedCollectionData);

    console.log("PUT IT IN ELSE!");

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
