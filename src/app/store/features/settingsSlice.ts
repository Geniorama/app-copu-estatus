import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SettingsInitialState = {
    sidebarShow: boolean
}

const initialState: SettingsInitialState = {
    sidebarShow: true
}

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers:{
        setSidebarShow:(state, action:PayloadAction<boolean>) => {
            state.sidebarShow = action.payload
        }
    }
})

export const { setSidebarShow } = settingsSlice.actions;
export default settingsSlice.reducer;