import { FC, useCallback, useEffect, useRef } from "react"
import { useComponentsSizeToSubstractContext } from "../../../Contexts/ComponentsSizeToSubstractProvider"
import { useRoomContext } from "../../../Contexts/RoomProvider"
import { useUserContext } from "../../../Contexts/UserProvider"
import { SocketRef } from "../../Lobby/Lobby"

const OnlineUsers: FC<SocketRef> = ({socket}) => {
  const { room, setRoom } = useRoomContext()
  const { user } = useUserContext()
  const { onlineUsersWidth, setOnlineUsersWidth } = useComponentsSizeToSubstractContext()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSizeChange = useCallback(() => {
    if(containerRef.current && onlineUsersWidth !== containerRef.current?.offsetWidth) {
      setOnlineUsersWidth(containerRef.current?.offsetWidth)
    }
  },[onlineUsersWidth, setOnlineUsersWidth])

  useEffect(() => {
    window.addEventListener("resize", handleSizeChange)
    
    return () => {
      window.removeEventListener("resize", handleSizeChange)
    }
  },[containerRef.current?.offsetWidth, handleSizeChange])

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
      // const newRoomInfo = { name: room.name, id: room.id, userWhoOpened: room.userWhoOpened, onlineUsers: newUsersList, drawingHistory: room.drawingHistory}
      setRoom((prev) => { return {...prev, onlineUsers: newUsersList} })
  },[room.id, room.onlineUsers, setRoom])

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
    // const newRoomInfo = { name: room.name, id: room.id, userWhoOpened: room.userWhoOpened, onlineUsers: newUsersList, drawingHistory: room.drawingHistory}
    setRoom((prev) => { return {...prev, onlineUsers: newUsersList} })
  },[room.onlineUsers, setRoom])
  
  useEffect(() => {
    socket.on("logout-user", (username) => {
      removeFromOnlineList(username)
    })
    return(() => {
      socket.removeListener("logout-user")
    })
  },[removeFromOnlineList, socket])

  useEffect(() => {
    socket.on("new-admin", (username) => {
      setRoom((prev) => { return {...prev, userWhoOpened: username} })
    })
    return () => {
      socket.removeListener("new-admin")
    }
  },[setRoom, socket])
  
  
  return (
    <div className='online-users' ref={containerRef}>
      <u><h3>Online Users</h3></u>
      {room.onlineUsers.map((user, index) => {
        return user === room.userWhoOpened ? <div key={`${user}${index}`} className="online-user">{user} - Admin</div>
        : <div key={`${user}${index}`} className="online-user">{user}</div>
      })}
    </div>
  )
}

export default OnlineUsers