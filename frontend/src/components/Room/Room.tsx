import { FC, useEffect } from 'react';
// import { useRoomContext } from '../../contexts/RoomProvider';
// import { useRoomsContext } from '../../contexts/RoomsProvider';
// import { useUserContext } from '../../contexts/UserProvider';
import { SocketRef } from '../Lobby/Lobby';
import Chat from './Chat/Chat';
import Header from './Header/Header';
import OnlineUsers from './OnlineUsers/OnlineUsers';
import PaintUI from './PaintUI/PaintUI';
import Whiteboard from './Whiteboard/Whiteboard';


const Room: FC<SocketRef> = ({socket}) => {

  // const { user } = useUserContext()
  // const { roomsList } = useRoomsContext()
  // const { room } = useRoomContext()

  // console.log(room)
  // console.log(roomsList)
  
  useEffect(() => {
    socket.connect()
  },[socket])

  return (
    <>
    {/*user.currentRoom ?*/ <div className="room">
      <Header />
      <OnlineUsers socket={socket}/>
      <Whiteboard />
      <Chat />
      <PaintUI />
    </div>/* : <h1>Redirecting to lobby</h1>*/}
    </>
  )
}

export default Room