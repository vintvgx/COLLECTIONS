export interface UserModel {
  userName: string;
  firstName: string;
  lastName: String;
  contactNumber: String;
  verified: boolean;
}

export interface Image {
  path: string;
  covers: string[];
  collection: string[];
}

export interface UserState {
  user: UserModel;
  error: string | undefined;
}
