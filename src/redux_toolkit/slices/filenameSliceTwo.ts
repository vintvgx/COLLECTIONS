import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase/f9_config";
import { ImageCollectionData, DataState, Collections } from "../../utils/types";

//initial state
const initialState: DataState = {
  userId: null,
  filenames: [],
  collectionsData: [],
  isLoading: false,
  error: null,
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
      if (state.collectionsData) {
        state.collectionsData = [...state.collectionsData, action.payload];
      } else {
        (state.collectionsData = state.collectionsData), action.payload;
      }
      state.collectionsData = action.payload;
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

//maps reducers to action that we are about to create
export const { setFilenames, setCollectionData, setLoading, setError } =
  filenameSlice.actions;

export const fetchFilenames = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading());
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
        console.log(collectionRef);
        const userCollections: Collections[] = [];
        const fetchCollections = await getDocs(
          await collection(db, collectionRef)
        );
        const userImageCollection: ImageCollectionData = {
          images: [],
          imgUri: "",
          title: "",
        };
        fetchCollections.forEach((collection) => {
          const collection_images = collection.data().images;
          // console.log(collection_images);
          const uri = collection.data().imgUri;
          // console.log(uri);
          const title = collection.data().title;
          console.log(title);
          userImageCollection.images.push(...collection_images);
          userImageCollection.imgUri = uri;
          userImageCollection.title = title;
          // userImageCollection.push({
          //   images: ...collection_images,
          //   imgUri: uri,
          //   title,
          //   // imgUri: uri,
          //   // title: title,
          // });
          // console.log(userImageCollection);
          userCollections.push({
            images: collection_images,
            imgUri: uri,
            collections: [],
            title: title,
          });
        });
        // userCollections.push({
        //   collections: userImageCollection,
        // });
        // console.log("COLLLLLLLLLLLLECTION:", userCollections);
        // console.log("collectionsData RETURNN:", collectionsData);
        dispatch(setCollectionData(userImageCollection));
        return userImageCollection;
      })
    );
  } catch (error) {
    console.log(error);
    dispatch(setError("Error fetching filenames"));
  }
};

export const selectFilenames = (state: RootState) => state.filenames.filenames;

export const selectCollectionData = (state: RootState) =>
  state.filenames.collectionsData;

export default filenameSlice.reducer;
