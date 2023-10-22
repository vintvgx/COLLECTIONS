import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import {
  auth,
  db,
  storage,
  updateProfileCollection,
} from "../../utils/firebase/f9_config";
import {
  ImageCollectionData,
  DataState,
  UpdateProfilePayload,
} from "../../model/types";
import { deleteObject, listAll, ref } from "firebase/storage";

//initial state
const initialState: DataState = {
  userId: null,
  filenames: [],
  feedData: [],
  collectionsData: [],
  profileCollection: [],
  isLoading: false,
  error: undefined,
  collectionCovers: [],
  feedCollectionCovers: [],
  isRefreshing: false,
  needsReset: false,
  lastDoc: undefined,
  userData: null,
};

// slice/reducer
const filenameSlice = createSlice({
  name: "filenames",
  initialState,
  reducers: {
    setFilenames: (state, action: PayloadAction<string[]>) => {
      state.filenames = action.payload;
      (state.isLoading = false), (state.error = undefined);
    },
    setCollectionData: (
      state,
      action: PayloadAction<ImageCollectionData[]>
    ) => {
      state.collectionsData = state.collectionsData?.concat(action.payload);
      state.isLoading = false;
      state.error = undefined;
    },
    setCollectionCovers: (
      state,
      action: PayloadAction<ImageCollectionData[]>
    ) => {
      state.collectionCovers = action.payload;
    },
    setProfileCollection: (
      state,
      action: PayloadAction<ImageCollectionData[]>
    ) => {
      state.profileCollection = action.payload;
    },
    removeDeletedProfileCollection: (state, action: PayloadAction<string>) => {
      const titleToDelete = action.payload;
      if (state.profileCollection)
        state.profileCollection = state.profileCollection.filter(
          (collection) => collection.title !== titleToDelete
        );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      (state.isLoading = action.payload), (state.error = undefined);
    },
    setError: (state, action: PayloadAction<string>) => {
      (state.isLoading = false), (state.error = action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfileCollectionAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfileCollectionAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileCollection = action.payload.updatedData;
        // You can also update the description in the state if needed
      })
      .addCase(updateProfileCollectionAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

//maps reducers to action that we are about to create
export const {
  setFilenames,
  setCollectionData,
  setCollectionCovers,
  setProfileCollection,
  removeDeletedProfileCollection,
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

    const collectionCovers = collectionsData.map((collection) => {
      return collection.find((image) => image.image.id === 0);
    });
    dispatch(setCollectionCovers(collectionCovers));
  } catch (error) {
    console.log(error);
    dispatch(setError("Error fetching filenames"));
  }
  dispatch(setLoading(false));
};

export const deleteProfileCollection =
  (uid: string, title: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      console.log("DELETE CALLED");
      const collectionRef = collection(
        db,
        `collections/${uid}/files/${title}/images`
      );
      const userFilenameRef = doc(db, `collections/${uid}/filenames/${title}`); // Note: Changed to 'doc'
      const feedRef = doc(db, `feed/allUsers/filenames/${title}`); // Note: Changed to 'doc'
      const feedFilenameRef = collection(
        db,
        `feed/allUsers/files/${title}/images`
      );

      // Delete each file in storage
      tryDeleteStorageFiles(uid, title);

      // Delete all documents within the collection
      const querySnapshot = await getDocs(collectionRef);
      const batch = writeBatch(db);
      console.log("🚀 ~ file: filenameSlice.ts:174 ~ batch:", batch);
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      // Delete other references
      await deleteDoc(userFilenameRef);
      await deleteDoc(feedRef);

      const feedSnapshot = await getDocs(feedFilenameRef);
      const feedBatch = writeBatch(db);
      console.log("🚀 ~ file: filenameSlice.ts:186 ~ feedBatch:", feedBatch);
      feedSnapshot.docs.forEach((doc) => {
        feedBatch.delete(doc.ref);
      });
      await feedBatch.commit();

      dispatch(removeDeletedProfileCollection(title));
      console.log(title + ": DELETED!");
    } catch (error) {
      console.log(error);
      dispatch(setError("Error deleting profile collection"));
    }
    dispatch(setLoading(false));
  };

const tryDeleteStorageFiles = async (uid: string, title: string) => {
  try {
    const storageRef = ref(storage, `images/${uid}/${title}`);
    const listResults = await listAll(storageRef);
    console.log(
      "🚀 ~ file: filenameSlice.ts:213 ~ tryDeleteStorageFiles ~ listResults:",
      listResults
    );
    const deleteFiles = listResults.items.map((fileRef) => {
      console.log(
        "🚀 ~ file: filenameSlice.ts:215 ~ deleteFiles ~ fileRef:",
        fileRef
      );
      deleteObject(fileRef);
    });
    await Promise.all(deleteFiles);

    console.log("Successfully deleted all files.");
  } catch (error) {
    console.log("Failed to delete files:", JSON.stringify(error, null, 2));
  }
};

export const fetchProfileCollection =
  (uid: string, title: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const profileCollection: ImageCollectionData[] = [];

      const collectionRef = `collections/${uid}/files/${title}/images`;
      const descriptionRef = doc(db, `collections/${uid}/filenames/${title}`);

      const collectionSnapshot = await getDocs(collection(db, collectionRef));
      const descriptionSnapshot = await getDoc(descriptionRef);

      console.log("Description Snapshot Object:", descriptionSnapshot);

      if (descriptionSnapshot.exists()) {
        console.log("Description Data:", descriptionSnapshot.data());

        collectionSnapshot.forEach((doc) => {
          profileCollection.push({
            image: doc.data(),
            date: doc.data().date,
            title: doc.data().title,
            editorial: descriptionSnapshot.data()?.editorial,
          });
        });
      } else {
        console.warn(`Document with title '${title}' does not exist.`);
        collectionSnapshot.forEach((doc) => {
          profileCollection.push({
            image: doc.data(),
            date: doc.data().date,
            title: doc.data().title,
            editorial: "Set Editorial",
          });
        });
      }

      dispatch(setProfileCollection(profileCollection));
    } catch (error) {
      console.log(error);
      dispatch(setError("Error fetching profile collection"));
    }
    dispatch(setLoading(false));
  };

export const updateProfileCollectionAction = createAsyncThunk(
  "filenames/updateProfileCollection",
  async (payload: UpdateProfilePayload, thunkAPI) => {
    console.log("DISPATCH: updateProfileCollectionAction");
    try {
      await updateProfileCollection(
        payload.uid,
        payload.title,
        payload.updatedData,
        payload.updatedEditorial
      );
      return {
        updatedData: payload.updatedData,
        updatedDescription: payload.updatedEditorial,
      };
    } catch (error) {
      console.log("DISPATCH ERROR: updateProfileCollectionAction");
      return thunkAPI.rejectWithValue("Error updating profile collection");
    }
  }
);

export const selectFilenames = (state: RootState) => state.filenames.filenames;

export const selectCollectionData = (state: RootState) =>
  state.filenames.collectionsData;

export default filenameSlice.reducer;
