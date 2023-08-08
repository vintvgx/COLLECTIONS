export interface DataState {
  userId: null;
  filenames: string[];
  collectionsData: ImageCollectionData[] | undefined;
  feedData: ImageCollectionData[] | undefined;
  isLoading: boolean;
  error: string | null;
  collectionCovers: ImageCollectionData[] | undefined;
  needsReset: boolean;
  feedCollectionCovers: ImageCollectionData[] | undefined;
  lastDoc: any;
  userData: UserData | null;
}

export interface ImageData {
  assetId: string;
  id: number;
  title?: string;
  fileName: string;
  fileSizE: number;
  height: number;
  type: string;
  uri: string;
  width: number;
  createdAt: string;
  uid?: string;
}

export interface ImageCollectionData {
  image: ImageData[];
  title: string;
  createdAt?: string;
  userData?: UserData;
}

export interface Collections extends ImageCollectionData {
  collections: ImageCollectionData[];
}

export interface SectionItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  type: string;
  screen?: string;
  value?: boolean;
}

export interface Section {
  header: string;
  items: SectionItem[];
}

export interface Profile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  cover: string;
  sections: Section[];
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  avatar: ImageData;
}

export interface ProfileUser {
  userData: UserData;
  isLoading: boolean;
  error: string | null;
}

export interface UserState extends UserData {
  isLoading: boolean;
  error: string | null;
}
