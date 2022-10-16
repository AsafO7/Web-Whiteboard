// import { useCallback } from 'react'
// import { getRoomInfo } from '../../app/apiCalls';
// import { useRoomContext } from '../../contexts/RoomProvider';
// import { useUserContext } from '../../contexts/UserProvider';
import Chat from './Chat/Chat';
import Header from './Header/Header';
import OnlineUsers from './OnlineUsers/OnlineUsers';
import PaintUI from './PaintUI/PaintUI';
import Whiteboard from './Whiteboard/Whiteboard';


function Room() {

  // const { user } = useUserContext()
  // const { room } = useRoomContext()

  // const getRoom = useCallback(async() => {
    
  //   if(room.onlineUsers.indexOf(user.name) === -1) {
  //     await getRoomInfo(room.id, user.name)
  //     console.log(1);
  //   }
  // },[room, user])
  // getRoom()

  return (
    <div className="room">
      <Header />
      <OnlineUsers />
      <Whiteboard />
      <Chat />
      <PaintUI />
    </div>
  )
}

export default Room