import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { collection, doc, getDocs } from "firebase/firestore";
import { DataState, ImageData } from "../../utils/types";
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
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setFeedData: (state, action: PayloadAction<any[]>) => {
      state.feedData = action.payload;
      state.isLoading = false;
      state.error = null;
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

export const { setFeedData, setLoading, setError } = feedSlice.actions;

export const fetchFeedData = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading());

  try {
    const feedFilenamesQuerySnapshot = await getDocs(
      collection(db, "feed", "allUsers", "filenames")
    );

    const filenames = feedFilenamesQuerySnapshot.docs.map((doc) => doc.id);
    const feedData: ImageData[] = [];

    for (const filename of filenames) {
      const imagesQuerySnapshot = await getDocs(
        collection(db, "feed", "filenames", filename, "images")
      );

      imagesQuerySnapshot.docs.forEach((doc) => {
        const imageData: ImageData = doc.data() as ImageData;
        feedData.push(imageData);
      });
    }

    dispatch(setFeedData(feedData));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const selectFeedData = (state: RootState) => state.feed.feedData;
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedError = (state: RootState) => state.feed.error;

export default feedSlice.reducer;
