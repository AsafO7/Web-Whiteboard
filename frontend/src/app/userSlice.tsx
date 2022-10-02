import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: {
            name: "",
            email: "",
        },
        pending: false,
        error: false,
        // message: "",
    },
    reducers: {
        pendingStart: (state) => {
            state.pending = true
        },
        loginSuccess: (state, action) => {
            state.pending = false
            state.error = false
            state.userInfo = action.payload
        },
        logError: (state) => {
            state.pending = false
            state.error = true
        },
        logoutSuccess: (state) => {
            state.pending = false
            state.userInfo.name = ""
            state.userInfo.email = ""
        }
    },
})

export const { pendingStart, loginSuccess, logError, logoutSuccess } = userSlice.actions
export default userSlice.reducer