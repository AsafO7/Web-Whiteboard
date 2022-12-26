import { FC, useEffect } from 'react';
import { SocketRef } from '../Lobby/Lobby';
import Chat from './Chat/Chat';
import Header from './Header/Header';
import OnlineUsers from './OnlineUsers/OnlineUsers';
import PaintUI from './PaintUI/PaintUI';
import Whiteboard from './Whiteboard/Whiteboard';


const Room: FC<SocketRef> = ({socket}) => {
  
  useEffect(() => {
    socket.connect()
  },[socket])

  return (
    <>
    {/*user.currentRoom ?*/ <div className="room">
      <Header />
      <OnlineUsers socket={socket}/>
      <Whiteboard socket={socket}/>
      <Chat socket={socket}/>
      <PaintUI />
    </div>/* : <h1>Redirecting to lobby</h1>*/}
    </>
  )
}

export default Room