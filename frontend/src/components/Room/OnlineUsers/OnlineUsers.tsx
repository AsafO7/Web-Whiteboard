import { FC } from "react"
import { useRoomContext } from "../../../contexts/RoomProvider"

const OnlineUsers: FC = () => {
  const { room } = useRoomContext()
  
  return (
    <div className='online-users'>
      {room.onlineUsers.map((user, index) => {
        return <div key={`${user}${index}`}>{user}</div>
      })}
    </div>
  )
}

export default OnlineUsers