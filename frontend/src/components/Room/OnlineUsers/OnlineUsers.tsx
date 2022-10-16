import { FC } from "react"
import { useRoomContext } from "../../../contexts/RoomProvider"
// import { useRoomsContext } from "../../../contexts/RoomsProvider"

// interface roomId {
//   id: String
// }

const OnlineUsers: FC/*<roomId>*/ = (/*{id}*/) => {
  const { room } = useRoomContext()
  // let room = useRef(roomsList.find(room => room.id === id))
  // console.log(room)
  
  return (
    <div className='online-users'>
      {room.onlineUsers.map((user, index) => {
        return <div key={`${user}${index}`}>{user}</div>
      })}
    </div>
  )
}

export default OnlineUsers