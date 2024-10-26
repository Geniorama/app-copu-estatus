import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Claims } from "@auth0/nextjs-auth0";
import type { User } from "@/app/types";


type UserInitialState = {
    currentUser?: Claims
    userData?: User
}

const initialState: UserInitialState = {
    currentUser: undefined,
    userData: undefined
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        setCurrentUser:(state, action:PayloadAction<Claims>) => {
            state.currentUser = action.payload
        },

        setUserData:(state, action:PayloadAction<User>) => {
            state.userData = action.payload
        },

        resetCurrentUser:(state) => {
            state.currentUser = initialState.currentUser
        },

        resetUserData:(state) => {
            state.userData = initialState.userData
        }
    }
})

export const { setCurrentUser, resetCurrentUser, resetUserData,  setUserData} = userSlice.actions;
export default userSlice.reducer;