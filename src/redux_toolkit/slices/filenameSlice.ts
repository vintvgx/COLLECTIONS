import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../utils/firebase/f9_config";
import { ImageCollectionData, DataState, Collections } from "../../model/types";

//initial state
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

// slice/reducer
const filenameSlice = createSlice({
  name: "filenames",
  initialState,
  reducers: {
    setFilenames: (state, action: PayloadAction<string[]>) => {
      state.filenames = action.payload;
      (state.isLoading = false), (state.error = null);
    },
    setCollectionData: (state, action: PayloadAction<any[]>) => {
      state.collectionsData = state.collectionsData?.concat(action.payload);
      (state.isLoading = false), (state.error = null);
    },
    setCollectionCovers: (state, action: PayloadAction<any[]>) => {
      state.collectionCovers = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      (state.isLoading = action.payload), (state.error = null);
    },
    setError: (state, action: PayloadAction<string>) => {
      (state.isLoading = false), (state.error = action.payload);
    },
  },
});

//maps reducers to action that we are about to create
export const {
  setFilenames,
  setCollectionData,
  setCollectionCovers,
  setLoading,
  setError,
} = filenameSlice.actions;

export const fetchFilenames = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const user = auth?.currentUser?.uid;
    const filenamesRef = collection(db, `collections/${user}/filenames`);
    const querySnapshot = await getDocs(filenamesRef);

    const filenames = await Promise.all(
      querySnapshot.docs.map((doc) => doc.id)
    );
    dispatch(setFilenames(filenames));

    const collectionsData = await Promise.all(
      filenames.map(async (file) => {
        const collectionRef = `collections/${user}/files/${file}/images`;
        // console.log(collectionRef);

        const fetchCollections = await getDocs(
          await collection(db, collectionRef)
        );
        const userImageCollection: ImageCollectionData[] = [];

        fetchCollections.forEach((collection) => {
          // console.log(collection.data());
          const collection_images = collection.data().images;
          // console.log(collection_images);
          const uri = collection.data().imgUri;
          // console.log(uri);
          const title = collection.data().title;
          // console.log(title);
          userImageCollection.push({
            image: collection.data(),
            date: collection.data().date,
            title: collection.data().title,
          });
        });
        dispatch(setCollectionData(userImageCollection));
        return userImageCollection;
      })
    );

    const collectionCovers = collectionsData.map((collection) => collection[0]);
    dispatch(setCollectionCovers(collectionCovers));
  } catch (error) {
    console.log(error);
    dispatch(setError("Error fetching filenames"));
  }
  dispatch(setLoading(false));
};

export const selectFilenames = (state: RootState) => state.filenames.filenames;

export const selectCollectionData = (state: RootState) =>
  state.filenames.collectionsData;

export default filenameSlice.reducer;
