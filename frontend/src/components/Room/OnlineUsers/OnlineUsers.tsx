import { FC, useCallback, useEffect } from "react"
import { useRoomContext } from "../../../contexts/RoomProvider"
import { useUserContext } from "../../../contexts/UserProvider"
import { SocketRef } from "../../Lobby/Lobby"

const OnlineUsers: FC<SocketRef> = ({socket}) => {
  const { room, setRoom } = useRoomContext()
  const { user } = useUserContext()

  const connectUser = useCallback(() => {
      socket.emit("user-login", user)
  },[socket, user])

  useEffect(() => {
      connectUser()
  },[connectUser])

  const addToOnlineList = useCallback((newUser: string, newUserRoomId: string) => {
      console.log("addToOnlineList")
      if(room.onlineUsers.indexOf(newUser) !== -1 || room.id !== newUserRoomId) return
      let newUsersList = room.onlineUsers
      newUsersList.push(newUser)
      const newRoomInfo = { name: room.name, id: room.id, userWhoOpened: room.userWhoOpened, onlineUsers: newUsersList, drawingHistory: room.drawingHistory}
      setRoom(() => newRoomInfo)
  },[room.drawingHistory, room.id, room.name, room.onlineUsers, room.userWhoOpened, setRoom])

  useEffect(() => {
    socket.on("add-user-to-list", (newUser, newUserRoomId) => {
      addToOnlineList(newUser, newUserRoomId)
    })
    return(() => {
      socket.removeListener("add-user-to-list")
    })
  },[addToOnlineList, socket])

  const removeFromOnlineList = useCallback((username: string) => {
    console.log("Remove from online list")
    let newUsersList = room.onlineUsers
    if(newUsersList.indexOf(username) === -1) return
    newUsersList = newUsersList.filter((name) => name !== username)
    const newRoomInfo = { name: room.name, id: room.id, userWhoOpened: room.userWhoOpened, onlineUsers: newUsersList, drawingHistory: room.drawingHistory}
    setRoom(() => newRoomInfo)
  },[room.drawingHistory, room.id, room.name, room.onlineUsers, room.userWhoOpened, setRoom])
  
  useEffect(() => {
    socket.on("logout-user", (username) => {
      removeFromOnlineList(username)
    })
    return(() => {
      socket.removeListener("logout-user")
    })
  },[removeFromOnlineList, socket])
  
  
  return (
    <div className='online-users'>
      <u><h3>Online Users</h3></u>
      {room.onlineUsers.map((user, index) => {
        return <div key={`${user}${index}`} className="online-user">{user}</div>
      })}
    </div>
  )
}

export default OnlineUsers