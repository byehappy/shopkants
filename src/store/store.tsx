import {createStore} from "redux";
import MainReducer from "../reducer/MainReducer";
import {composeWithDevTools} from "redux-devtools-extension";

export const store = createStore(MainReducer, composeWithDevTools())



