export interface User {}

export interface DataState {
  userId: null;
  filenames: string[];
  collectionsData: ImageCollectionData[] | undefined;
  isLoading: boolean;
  error: string | null;
  collectionCovers: ImageCollectionData[] | undefined;
}

export interface ImageData {
  assetId: string;
  base64: null;
  duration: null;
  exif: null;
  fileName: string;
  fileSizE: number;
  height: number;
  type: string;
  uri: string;
  width: number;
  //   imgUri: string; //?
  //   title: string; //?
}

export interface ImageCollectionData {
  images: ImageData[];
  imgUri: string;
  title: string;
}

// create instance of user.id + collection of images
export interface Collections extends ImageCollectionData {
  collections: ImageCollectionData[];
}
