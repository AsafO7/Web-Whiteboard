import { AnyAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Dispatch } from 'react'
import { pendingStart, logError } from './userSlice'
import { WritableDraft } from 'immer/dist/internal'

export const loginUser = async (user: WritableDraft<{ name: String, email: String, password: String }>, dispatch: Dispatch<AnyAction>) => {
    dispatch(pendingStart())
    try {
        const response = await axios.post("/lobby", user)
        return response.data
    }
    catch(err) {
        dispatch(logError())
    }
}

export const logoutUser = async (userInfo: WritableDraft<{ name: String, email: String }>, dispatch: Dispatch<AnyAction>) => {
    try {
        const response = await axios.post("/", userInfo)
        return response.data
    }
    catch(err) {
        dispatch(logError())
    }
}

export const getOnlineUsers = async () => {
    const response = await axios.get("/lobby")
    return response.data
}