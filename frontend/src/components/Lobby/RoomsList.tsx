import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRoomInfo } from '../../app/apiCalls'
import { useRoomContext } from '../../contexts/RoomProvider'
import { useRoomsContext } from '../../contexts/RoomsProvider'
import { useUserContext } from '../../contexts/UserProvider'
import { LoadingState } from './Lobby'

const RoomsList: FC<LoadingState> = ({loading}) => {
  const { user, setUser } = useUserContext()
  const { roomsList } = useRoomsContext()
  const { setRoom } = useRoomContext()
  const [errMsg, setErrMsg] = useState("")
  const navigate = useNavigate()

  const handleGetRoomInfo = async (roomId: String) => {
    const res = await getRoomInfo(roomId, user.name)
    if(res && typeof(res) !== "string" && typeof(res) !== "undefined") {
      setUser({...user, currentRoom: roomId})
      if(errMsg) setErrMsg(() => "")
      const newRoomInfo = { name: res.name, id: res.id, userWhoOpened: res.userWhoOpened, onlineUsers: res.onlineUsers, drawingHistory: res.drawingHistory}
      setRoom(() => newRoomInfo)
      navigate(`/room/${roomId}`)
    }
    else {
      setErrMsg(() => "something went wrong, please refresh")
    }
  }

  return (
    <div className='rooms-list-container'>
        <h1>Rooms:</h1>
        {loading ? <h2>Loading...</h2> : roomsList.length > 0 ? <ul className='rooms-list'>
            {roomsList.map((room, index) => {
              return <li key={`${room.id}${index}`}>
                <span>{room.name}</span>
                <button className='enter-room-btn' onClick={() => handleGetRoomInfo(room.id)}>Enter</button>
              </li>
            })}
        </ul> : <h2>There are no open rooms currently</h2>}
        {errMsg && <div className='form-err-msg'>{errMsg}</div>}
    </div>
  )
}

export default RoomsList