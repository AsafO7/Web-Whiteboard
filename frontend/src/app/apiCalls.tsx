import axios from 'axios'

export const loginUser = async (user: { name: string | undefined, email: string | undefined, password: string | undefined }) => {
    try {
        const response = await axios.post("http://localhost:5000/lobby", user)
        return response.data
    }
    catch(err) {
        console.log(err)
    }
}

// When user refreshes the page or closes the tab
export const logoutUser = async (userInfo: { name: String, email: String, currentRoom: String }) => {    
    try {
        const response = await axios.post("http://localhost:5000/", userInfo)
        return response.data
    }
    catch(err) {
        console.log(err)
    }
}

// When user leaves a room (go back button)
export const updateUserRoom = async ( userInfo: { name: String, email: String, currentRoom: String }) => {
    try {
        const response = await axios.put("http://localhost:5000/room", userInfo)
        return response.data
    }
    catch(err) {
        console.log(err)
    }
}

export const getLobbyInfo = async (user: { name: String, email: String, currentRoom: String }) => {
    try {
        const response = await axios.get("http://localhost:5000/lobby", { params: user })
        return response.data
    }
    catch(err) {
        console.log(err)
    }
}

export const createRoom = async (userName: String, roomName: string | undefined, roomId: String) => {
    try {
        const response = await axios.post("http://localhost:5000/room", {userName, roomName, roomId})
        return response.data
    }
    catch(err) {
        console.log(err)
    }
}

export const getRoomInfo = async (roomId: String, username: String) => {
    const params = { roomId, username }
    try {
        const response = await axios.get(`http://localhost:5000/room/:${roomId}`, { params: params })
        return response.data
    }
    catch(err) {
        console.log(err)
    }
}
