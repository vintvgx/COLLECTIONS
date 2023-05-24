import { ImageAction } from "../actions/imageActions";
import { Image } from "../models";

// const initialState: Image = {
//   path: {} as string,
//   covers: {} as [],
//   collection: {} as [],
// };

// export interface CollectionState {
//   getImage(filename: string): Image;
//   getImageCollection(): ImageCollection;
// }

// const initialState: CollectionState = {
//   filename: [],
//   covers: [],
//   images: []
// }

const initialState: { [filename: string]: Image[] } = {};

export const ImagesReducer = (state = initialState, action: ImageAction) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_FILENAMES":
      console.log(action.payload);
    default:
      return state;
    // case "ADD_COVER":
    //   return {
    //     ...state,
    //     covers: {
    //       ...state.covers,
    //       [action.id]: action.cover,
    //     },
    //   };
    // case "REMOVE_COVER":
    //   return {
    //     ...state,
    //     covers: {
    //       ...state.covers,
    //       [action.id]: undefined,
    //     },
    //   };
    // case "ADD_IMAGE":
    //   return {
    //     ...state,
    //     collection: {
    //       ...state.collection,
    //       [action.id]: action.image,
    //     },
    //   };
  }
};
