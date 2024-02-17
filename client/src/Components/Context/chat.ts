
import { createSlice } from "@reduxjs/toolkit";
import { user } from "../Chat/UserList";
export type Group = {
    groupName: string;
    currentGroupMembers: user[];
  };
  
  interface ChatState {
    groups: Group[];
    currentGroupList: user[];
  }
const initialState:ChatState  = {
    groups:[],
    currentGroupList:[],
}
const chatSlice = createSlice({
    name:'chat',
    initialState,
    reducers:{
        addTogroup(state: ChatState, action){
            console.log(action.payload);
            state.groups.unshift(action.payload);
             
        },
        setGroup(state,action){
            state.groups = action.payload;
        },
        setCurrentGroupList(state, action){
            state.currentGroupList = action.payload;
            console.log(action.payload)
            console.log('hello');
            console.log(state.currentGroupList);
        },
    }
})
export default chatSlice;