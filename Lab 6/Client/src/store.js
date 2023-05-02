import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducer";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistParams = {
  key: "root",
  storage,
};
const persistedPage = persistReducer(persistParams, rootReducer);

export const store = configureStore({
  reducer: persistedPage,
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
export const persistor = persistStore(store);
