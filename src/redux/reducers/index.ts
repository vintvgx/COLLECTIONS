import { combineReducers } from "redux";
import { UserReducer } from "./userReducer";
import { ImagesReducer } from "./imagesReducer";

const rootReducer = combineReducers({
  userReducer: UserReducer,
  imagesReducer: ImagesReducer,
});

export type ApplicationState = ReturnType<typeof rootReducer>;

export { rootReducer };
