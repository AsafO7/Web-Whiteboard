import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRoomInfo } from '../../app/apiCalls'
import { useRoomContext } from '../../contexts/RoomProvider'
import { useRoomsContext } from '../../contexts/RoomsProvider'
import { useUserContext } from '../../contexts/UserProvider'
import { loadingState } from './Lobby'

const RoomsList: FC<loadingState> = ({loading}) => {
  const { user, setUser } = useUserContext()
  const { roomsList } = useRoomsContext()
  const { setRoom } = useRoomContext()
  const navigate = useNavigate()

  const handleGetRoomInfo = async (roomId: String) => {
    const res = await getRoomInfo(roomId, user.name)
    if(res && typeof(res) !== "string" && typeof(res) !== "undefined") {
      // const userInfo = {...user, currentRoom: roomId}
      // const res2 = await updateUserRoom(userInfo)
      // if(typeof(res2) === "string") {
      //   console.log(res2)
      // }
      // else {
          const userInfo = { name: user.name, email: user.email, currentRoom: res.id }
          setUser(() => userInfo)
      // }
      const newRoomInfo = { name: res.name, id: res.id, userWhoOpened: res.userWhoOpened, onlineUsers: res.onlineUsers, drawingHistory: res.drawingHistory}
      setRoom(() => newRoomInfo)
      setTimeout(() => {
        navigate(`/room/${roomId}`)
      }, 500)
    }
    else {
      console.log("something went wrong")
    }
  }

  return (
    <div className='rooms-list-container'>
        <h1>Rooms:</h1>
        {loading? <h2>Loading...</h2> : <ul className='rooms-list'>
            {roomsList.map((room, index) => {
              return <li key={`${room.id}${index}`}>
                <span>{room.name}</span>
                <button onClick={() => handleGetRoomInfo(room.id)}>Enter</button>
              </li>
            })}
        </ul>}
    </div>
  )
}

export default RoomsList