import { auth, db } from "../../firebase/f9_config";
import { getDocs, collection } from "firebase/firestore";
import { Dispatch } from "react";
import { Image } from "../models";

const SET_FILENAMES = "SET_FILENAMES";
const SET_COVERS = "SET_COVERS";

export interface SetFilenamesAction {
  readonly type: typeof SET_FILENAMES;
  payload: string[];
}

export interface SetFilenamesErrorAction {
  readonly type: "FILENAME_ERROR";
  payload: any;
}

export interface SetCover {
  readonly type: typeof SET_COVERS;
  payload: string[];
}

// Action creators
export const setFilenames = (filenames: string[]) => ({
  type: SET_FILENAMES,
  payload: filenames,
});

export type ImageAction =
  | SetFilenamesAction
  | SetFilenamesErrorAction
  | SetCover;

export const OnSetFilenames = (filenames: string[] = []) => {
  return async (dispatch: Dispatch<ImageAction>) => {
    try {
      //   const filenames: string[] = [];
      const user = auth?.currentUser?.uid;
      const filenames_ref = `collections/${user}/filenames`;
      const querySnapshot = await getDocs(await collection(db, filenames_ref));
      await querySnapshot.forEach((file_doc) => {
        const result = file_doc.id;
        filenames.push(result);
      });
      //   console.log("REF:", filenames_ref);
      //   console.log("QUERY:", querySnapshot);
      console.log("array:", filenames);

      if (!user) {
        //set error
        dispatch({
          type: "FILENAME_ERROR",
          payload: "Filename Load Error",
        });
      } else {
        dispatch({
          type: SET_FILENAMES,
          payload: filenames,
        });
        return filenames;
      }
    } catch (error) {
      console.log(error);

      // set image error
      dispatch({
        type: "FILENAME_ERROR",
        payload: "Filename Load Error",
      });
    }
  };
};

export const OnSetCovers = (covers: string[] = []) => {
  return async (dispatch: Dispatch<ImageAction>) => {
    try {
      const user = auth?.currentUser?.uid;
      const filenames = await OnSetFilenames();
      console.log("COVERS?", filenames);

      if (!user) {
        //set error
        dispatch({
          type: "FILENAME_ERROR",
          payload: "Filename Load Error",
        });
      } else {
        dispatch({
          type: SET_COVERS,
          payload: covers,
        });
        return filenames;
      }
    } catch (error) {
      console.log(error);

      // set image error
      dispatch({
        type: "FILENAME_ERROR",
        payload: "Filename Load Error",
      });
    }
  };
};
