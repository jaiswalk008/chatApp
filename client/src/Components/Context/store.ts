import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";
import chatSlice from "./chat";
 

export const store = configureStore({
    reducer:{
        auth:authSlice.reducer,
        chat:chatSlice.reducer,
    }
})
export const authActions = authSlice.actions;
export const chatActions = chatSlice.actions;