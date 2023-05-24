import { auth, db } from "../../firebase/f9_config";
import { getDocs, collection } from "firebase/firestore";
import { Dispatch } from "react";

export interface OnFetchImagesAction {
  readonly type: "FETCH_IMAGES"
  payload: string[]
}

export interface OnFetchImagesErrorAction {
  readonly type: "FETCH_IMAGES_ERROR"
  payload: string
}

export interface OnFetchCollectionsAction {
  readonly type: "FETCH_COLLECTIONS"
  payload: string[]
}

export interface OnFetchCollectionsErorrAction {
  readonly type: "FETCH_COLLECTIONS_ERROR"
  payload: string
}

export type CollectionAction = OnFetchImagesAction | OnFetchImagesErrorAction | OnFetchCollectionsAction | OnFetchCollectionsErorrAction;


export const fetchCollections = () => {

}

export const fetchImages = (filename: string) => {
  return async (dispatch: Dispatch<CollectionAction>) => {
    try {
      const collection_ref = `collections/${auth?.currentUser?.uid}/files/${filename}/images`
      const snapshot = await getDocs(await collection(db, collection_ref))
      await snapshot.forEach((file) => {
        const result = file.data()
        
      })
    }
  }
}