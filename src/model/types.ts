export interface LoginProps {
  OnUserLogin: Function;
  OnUserSignup: Function;
}

export interface DataState {
  userId: null;
  filenames: string[];
  collectionsData: ImageCollectionData[] | undefined;
  feedData: ImageCollectionData[] | undefined;
  profileCollection: ImageCollectionData[] | undefined;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | undefined;
  collectionCovers: ImageCollectionData[] | undefined;
  needsReset: boolean;
  feedCollectionCovers: ImageCollectionData[] | undefined;
  lastDoc: any;
  userData: UserData | null;
}

export interface ImageData {
  assetId: string;
  id?: number;
  title?: string;
  fileName: string;
  fileSizE?: number;
  height: number;
  type: string;
  uri: string;
  width: number;
  createdAt?: string;
  uid?: string;
}

export interface ImageCollectionData {
  image: ImageData[];
  title: string;
  createdAt?: string;
  userData?: UserData;
  cover?: ImageData;
  description?: string | undefined;
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
  avatar: ImageData | undefined;
  settings?: ProfileSettings | undefined;
}

export interface ProfileSettings {
  darkMode: boolean;
}

export interface ProfileUser {
  userData: UserData;
  isProfileSet: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UserState extends UserData {
  isLoading: boolean;
  error: string | null;
}

export interface ViewToken {
  item: any; // This will be the data item from your FlatList data prop.
  key: string; // The key for the item.
  index: number | null; // Index of the item in the data array.
  isViewable: boolean; // Whether the item is currently viewable.
  section?: any; // If using sections in FlatList, this will be the section data.
}

export interface UpdateProfilePayload {
  uid: string;
  title: string;
  updatedData: ImageCollectionData[];
  updatedDescription: string;
}
