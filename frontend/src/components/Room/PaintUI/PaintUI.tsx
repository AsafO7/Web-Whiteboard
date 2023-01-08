import { FC } from "react"
import { useRoomContext } from "../../../contexts/RoomProvider"
import { useUserContext } from "../../../contexts/UserProvider"
import { SocketDrawingProps } from "../Room"
import WidthButtons from "../Whiteboard/WidthButtons"

const PaintUI: FC<SocketDrawingProps> = ({drawingStats, setDrawingStats, socket}) => {

  const { user } = useUserContext()
  const { room, setRoom } = useRoomContext()

  function handleUndo() {
    if(room.drawingHistory.length === 0) return
    const drawings = room.drawingHistory
    drawings.pop()
    socket.emit("send-undo", room.id)
    setRoom(prev => { return {...prev, drawingHistory: drawings} })
  }

  function handleClear() {
    if(user.name !== room.userWhoOpened) return
    if(room.drawingHistory.length === 0) return
    socket.emit("send-clear", room.id)
    setRoom(prev => { return {...prev, drawingHistory: []} })
  }

  return (
    <div className='paint-ui'>
      <div className="paint-ui-grid">
        <label htmlFor="color">Color:</label>
        <input type="color" id="color" onChange={e => setDrawingStats({...drawingStats, color: e.target.value})}></input>
        <WidthButtons drawingStats={drawingStats} setDrawingStats={setDrawingStats}/>
        <button className="paintui-btn undo-btn" onClick={handleUndo}>Undo</button>
        <button className="paintui-btn clear-btn" onClick={handleClear}>Clear</button>
      </div>
    </div>
  )
}

export default PaintUI