import React from 'react'
import Chat from './Chat/Chat';
import Header from './Header/Header';
import OnlineUsers from './OnlineUsers/OnlineUsers';
import PaintUI from './PaintUI/PaintUI';
import Whiteboard from './Whiteboard/Whiteboard';


function Room() {
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