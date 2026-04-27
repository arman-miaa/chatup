import authReducer from "@/redux/features/authSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
});

export default rootReducer;
