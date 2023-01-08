import { FC, useEffect, useState } from 'react';
import { SocketRef } from '../Lobby/Lobby';
import Chat from './Chat/Chat';
import Header from './Header/Header';
import OnlineUsers from './OnlineUsers/OnlineUsers';
import PaintUI from './PaintUI/PaintUI';
import Whiteboard from './Whiteboard/Whiteboard';

export interface drawingProps {
  shape: string
  color: string,
  width: number
}

export interface PaintUIProps {
  drawingStats: drawingProps, setDrawingStats: React.Dispatch<React.SetStateAction<drawingProps>>
}

export type SocketDrawingProps = SocketRef & PaintUIProps

const Room: FC<SocketRef> = ({socket}) => {
  const [drawingStats, setDrawingStats] = useState<drawingProps>({ shape: "pen", color: "#000000", width: 5})

  useEffect(() => {
    socket.connect()
  },[socket])

  return (
    <>
    {/*user.currentRoom ?*/ <div className="room">
      <Header />
      <OnlineUsers socket={socket}/>
      <Whiteboard socket={socket} drawingStats={drawingStats} setDrawingStats={setDrawingStats}/>
      <Chat socket={socket}/>
      <PaintUI drawingStats={drawingStats} setDrawingStats={setDrawingStats} socket={socket}/>
    </div>/* : <h1>Redirecting to lobby</h1>*/}
    </>
  )
}

export default Room