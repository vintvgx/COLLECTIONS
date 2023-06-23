import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { collection, doc, getDocs } from "firebase/firestore";
import { DataState, ImageCollectionData, ImageData } from "../../utils/types";
import { db } from "../../firebase/f9_config";

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

export const { setFeedData, setFeedCollectionCovers, setLoading, setError } =
  feedSlice.actions;

export const fetchFeedData = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading());
  try {
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
          console.log(item.data());
          feedImageCollection.push({
            image: item.data(),
            title: item.data().title,
            date: item.data().date,
          });
        });

        dispatch(setFeedData(feedImageCollection));
        return feedImageCollection;
      })
    );

    const feedCollectionCovers = feedCollectionData.map(
      (collection) => collection[0]
    );
    dispatch(setFeedCollectionCovers(feedCollectionCovers));
  } catch (error) {
    dispatch(setError("Error"));
    console.log("Error uploading images:", error);
  }
};

export const selectFeedData = (state: RootState) => state.feed.feedData;
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedError = (state: RootState) => state.feed.error;

export default feedSlice.reducer;
