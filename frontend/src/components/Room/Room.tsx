import { FC, useEffect, useState } from 'react';
import { SocketRef } from '../Lobby/Lobby';
import Chat from './Chat/Chat';
import Header from './Header/Header';
import OnlineUsers from './OnlineUsers/OnlineUsers';
import PaintUI from './PaintUI/PaintUI';
import Whiteboard from './Whiteboard/Whiteboard';

export interface drawingProps {
  // shape: string
  color: string,
  width: number
}

interface isEraser {
  isEraser: boolean,
  setIsEraser: React.Dispatch<React.SetStateAction<boolean>>
}

export interface PaintUIProps {
  drawingStats: drawingProps,
  setDrawingStats: React.Dispatch<React.SetStateAction<drawingProps>>
}

export type SocketDrawingProps = SocketRef & PaintUIProps & isEraser

const Room: FC<SocketRef> = ({socket}) => {
  const [drawingStats, setDrawingStats] = useState<drawingProps>({color: "#000000", width: 5})
  const [isEraser, setIsEraser] = useState<boolean>(false)

  useEffect(() => {
    socket.connect()
  },[socket])

  return (
    <>
    {/*user.currentRoom ?*/ <div className="room">
      <Header />
      <OnlineUsers socket={socket}/>
      <Whiteboard socket={socket} drawingStats={drawingStats} setDrawingStats={setDrawingStats} isEraser={isEraser} setIsEraser={setIsEraser}/>
      <Chat socket={socket}/>
      <PaintUI drawingStats={drawingStats} setDrawingStats={setDrawingStats} socket={socket} isEraser={isEraser} setIsEraser={setIsEraser}/>
    </div>/* : <h1>Redirecting to lobby</h1>*/}
    </>
  )
}

export default Room