import {createSlice} from '@reduxjs/toolkit';
import { user } from '../Chat/UserList';
const initialAuthState:{token:string, usersList:user[]} = {
    token: localStorage.getItem('token') || '',
    usersList:[],
}
const authSlice = createSlice({
    name:'auth',
    initialState:initialAuthState,
    reducers:{
        addToken(state,action){
            state.token = action.payload;
            localStorage.setItem('token',action.payload);
        },
        logout(state){
            state.token='';
            localStorage.removeItem('token');
        },
        setUserList(state,action){
            state.usersList = action.payload;
            // console.log(state.usersList);
        },

    }
})
export default authSlice;