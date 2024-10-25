import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Claims } from "@auth0/nextjs-auth0";


type UserInitialState = {
    currentUser?: Claims
}

const initialState: UserInitialState = {
    currentUser: undefined
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        setCurrentUser:(state, action:PayloadAction<Claims>) => {
            state.currentUser = action.payload
        },

        resetCurrentUser:(state) => {
            state.currentUser = initialState.currentUser
        }
    }
})

export const { setCurrentUser, resetCurrentUser } = userSlice.actions;
export default userSlice.reducer;