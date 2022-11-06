import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from 'uuid';
import { createRoom } from "../../app/apiCalls";
import { useRoomContext } from "../../contexts/RoomProvider";
import { useRoomsContext } from "../../contexts/RoomsProvider";
import { useUserContext } from "../../contexts/UserProvider";


function CreateRoomForm() {
    const roomNameRef = useRef<any>()
    const { user, setUser } = useUserContext()
    const navigate = useNavigate()
    const [errMsg, setErrMsg] = useState("")
    const {roomsList, setRooms } = useRoomsContext()
    const { setRoom } = useRoomContext()
    
    const handleSubmit = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const roomName = roomNameRef.current.value
        const roomId = uuidV4()
        
        const res = await createRoom(user.name, roomName, roomId)
        
        if(typeof(res) !== "string") {
            // Create a room
            let newRoomsList = roomsList.filter((room) => room.id !== res.room.id)
            newRoomsList.push(res.room)
            setRooms(() => newRoomsList)
            setRoom(() => res.room)
            setUser({name: user.name, email: user.email, currentRoom: res.room.id})
            navigate(`/room/${roomId}`)
        }
        else {
            // Display an error message
            setErrMsg(() => res)
        }
    }

    return (
        <>
            <form className="create-room-form">
                <label>Room Name: <input type='text' name='roomname' required ref={roomNameRef} /></label>
                <button type="submit" onClick={handleSubmit} className='form-btn'>Create</button>
            </form>
            {errMsg && <span className="form-err-msg">{errMsg}</span>}
        </>
    );
}

export default CreateRoomForm