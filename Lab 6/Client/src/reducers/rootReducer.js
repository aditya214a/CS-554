import { combineReducers } from "redux";
import charReducer from "./charReducer";
import collectorReducer from "./collectorReducer";

const rootReducer = combineReducers({
  collectors: collectorReducer,
  characters: charReducer,
});

export default rootReducer;
