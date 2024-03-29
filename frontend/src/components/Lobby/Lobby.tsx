import { FC, useCallback, useEffect, useState } from 'react'
import LobbyHeader from './LobbyHeader'
import CreateRoomForm from './CreateRoomForm'
import RoomsList from './RoomsList'
import { useUserContext } from '../../contexts/UserProvider'
import { getLobbyInfo, updateUserRoom } from '../../app/apiCalls'
import { useRoomsContext } from '../../contexts/RoomsProvider'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { Socket } from 'socket.io-client'
import { useRoomContext } from '../../contexts/RoomProvider'

export interface LoadingState {
  loading: boolean,
}

export interface SocketRef {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
}

const Lobby: FC<SocketRef> = ({socket}) => {
  const [openForm, setOpenForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user, setUser } = useUserContext()
  const { setRooms } = useRoomsContext()
  const { setRoom } = useRoomContext()

  const updateToEmptyRoom = useCallback(async () => {
    socket.disconnect()
    if(user.currentRoom === "") return
    const res = await updateUserRoom(user)
    if(typeof(res) === "string") console.log(res)
    else {
      setUser((prev) => { return {...prev, currentRoom: ""}})
      setRoom((prev) => { return { ...prev, name: "",
      id: "",
      userWhoOpened: "",
      onlineUsers: [],
      drawingHistory: []}})
    }
  },[setRoom, setUser, socket, user])

  const getRooms = useCallback(async () => {
    if(user.currentRoom !== "") return
    const res = await getLobbyInfo(user)
    setRooms(() => res.rooms)
    setLoading(() => false)
  },[setRooms, user])

  // Clears user's room info when they leave it without closing the app
  useEffect(() => {
    updateToEmptyRoom()
  },[updateToEmptyRoom])
  
  useEffect(() => {
    getRooms()
  },[getRooms])

  return (
    <>
      <LobbyHeader/>
      <div className='lobby-main'>
        {<RoomsList loading={loading}/>}
        <button onClick={() => setOpenForm((prev) => !prev)} className='create-room-btn'>Create Room</button>
        {openForm && <CreateRoomForm />}
      </div>
    </>
  )
}

export default Lobby