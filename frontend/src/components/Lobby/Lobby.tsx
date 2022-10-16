import { FC, useCallback, useEffect, useState } from 'react'
import LobbyHeader from './LobbyHeader'
import CreateRoomForm from './CreateRoomForm'
import RoomsList from './RoomsList'
import { useUserContext } from '../../contexts/UserProvider'
import { updateUserRoom } from '../../app/apiCalls'

export interface loadingState {
  loading: boolean
}

const Lobby: FC<loadingState> = ({loading}) => {
  const [openForm, setOpenForm] = useState(false)
  const { user, setUser } = useUserContext()

  const updateToEmptyRoom = useCallback(async () => {
    const userInfo = { name: user.name, email: user.email, currentRoom: "" }
    const res = await updateUserRoom(userInfo)
    if(typeof(res) === "string") {
        console.log(res)
    }
    else {
        setUser(() => userInfo)
    }
  },[])

  useEffect(() => {
    if(user.currentRoom !== "") updateToEmptyRoom()
  },[])

  return (
    <>
      <LobbyHeader /*updateToEmptyRoom={updateToEmptyRoom}*//>
      <div className='lobby-main'>
        {<RoomsList loading={loading}/>}
        <button onClick={() => setOpenForm((prev) => !prev)} className='create-room-btn'>Create Room</button>
        {openForm && <CreateRoomForm />}
      </div>
    </>
  )
}

export default Lobby