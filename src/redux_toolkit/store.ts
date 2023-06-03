import { Action, configureStore } from "@reduxjs/toolkit";
import filenamesReducer from "./slices/filenameSlice";
import userDataReducer from "./slices/user_data";
import thunkmiddleware, { ThunkAction } from "redux-thunk";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    filenames: filenamesReducer,
    userData: userDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
