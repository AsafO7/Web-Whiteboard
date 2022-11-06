import axios from 'axios'
import { WritableDraft } from 'immer/dist/internal'

export const loginUser = async (user: WritableDraft<{ name: String, email: String, password: String }>) => {
    try {
        const response = await axios.post("http://localhost:5000/lobby", user)
        return response.data
    }
    catch(err) {
        console.log(err)
    }
}

export const logoutUser = async (userInfo: { name: String, email: String }) => {
    try {
        const response = await axios.post("http://localhost:5000/", userInfo)
        return response.data
    }
    catch(err) {
        console.log(err)
    }
}

export const updateUserRoom = async ( userInfo: { name: String, email: String, currentRoom: String }) => {
    try {
        const response = await axios.put("http://localhost:5000/rooms", userInfo)
        return response.data
    }
    catch(err) {
        console.log(err)
    }
}

export const getlobbyInfo = async (user: { name: String, email: String, currentRoom: String }) => {
    try {
        const response = await axios.get("http://localhost:5000/lobby", { params: user })
        return response.data
    }
    catch(err) {
        console.log(err)
    }
}

export const createRoom = async (userName: String, roomName: String, roomId: String) => {
    try {
        const response = await axios.post("http://localhost:5000/rooms", {userName, roomName, roomId})
        return response.data
    }
    catch(err) {
        console.log(err)
    }
}

export const getRoomInfo = async (roomId: String, username: String) => {
    const params = { roomId, username }
    try {
        const response = await axios.get(`http://localhost:5000/rooms/:${roomId}`, { params: params })
        return response.data
    }
    catch(err) {
        console.log(err)
    }
}