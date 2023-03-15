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
      // console.log("addToOnlineList")
      if(room.onlineUsers.indexOf(newUser) !== -1 || room.id !== newUserRoomId) return
      let newUsersList = room.onlineUsers
      newUsersList.push(newUser)
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
    // console.log("Remove from online list")
    let newUsersList = room.onlineUsers
    if(newUsersList.indexOf(username) === -1) return
    newUsersList = newUsersList.filter((name) => name !== username)
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

  useEffect(() => {
    socket.on("updateDrawingUsers", (user, addUser) => {
      let arr: String[] = []
      arr.concat(room.drawingUsers)
      if(addUser) {
        arr.push(user)
      }
      else {
        arr.filter((name) => name !== user.name)
      }
      setRoom((prev) => { return { ...prev, drawingUsers: arr}})
    })

    return () => {
      socket.removeListener("updateDrawingUsers")
    }
  },[room, setRoom, socket])
  
  
  return (
    <div className='online-users'>
      <u><h3>Online Users</h3></u>
      {room.onlineUsers.map((user, index) => {
        return user === room.userWhoOpened ? <div key={`${user}${index}`} className="online-user">
          {user}<span style={{fontSize: "0.8rem", fontWeight: "bold", color: "red", letterSpacing: "1px"}}> - Admin</span>
          <span style={{fontSize: "1rem", fontWeight: "bold", color: "black", letterSpacing: "1px"}}>
            {room.drawingUsers && room.drawingUsers.indexOf(user) !== -1 ? "\t drawing..." : ""}</span>
        </div>
        : <div key={`${user}${index}`} className="online-user">{user}
        <span style={{fontSize: "1rem", fontWeight: "bold", color: "black", letterSpacing: "1px"}}>
          {room.drawingUsers && room.drawingUsers.indexOf(user) !== -1 ? "\t drawing..." : ""}</span></div>
      })}
    </div>
  )
}

export default OnlineUsers