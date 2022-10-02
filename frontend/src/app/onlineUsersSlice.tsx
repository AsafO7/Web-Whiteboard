import { createSlice } from "@reduxjs/toolkit";

export const onlineUsersSlice = createSlice({
    name: "onlineUsers",
    initialState: {
        userList: [{_id: "", name: ""}]
    },
    reducers: {
        updateList: (state, action) => {
            state.userList = action.payload
        }
    },
})

export const { updateList } = onlineUsersSlice.actions
export default onlineUsersSlice.reducer