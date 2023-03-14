import { FC, useRef } from "react"
import { useRoomContext } from "../../../contexts/RoomProvider"
import { Drawing } from "../../../contexts/RoomsProvider"
import { useUserContext } from "../../../contexts/UserProvider"
import { SocketDrawingProps } from "../Room"
import WidthButtons from "./WidthButtons"

const PaintUI: FC<SocketDrawingProps> = ({drawingStats, setDrawingStats, socket, setIsEraser, isEraser}) => {

  const { user } = useUserContext()
  const { room, setRoom } = useRoomContext()

  const colorInputRef = useRef<HTMLInputElement>(null)
  drawingStats.colorRef = colorInputRef

  function handleUndo() {
    if(room.drawingHistory.length === 0) return
    const tempDrawings = room.drawingHistory
    let drawings: Drawing[] = []
    let drawingInd = -1
    for(let i = tempDrawings.length - 1; i > -1; i--) {
      if(tempDrawings[i].userWhoDrew === user.name) {
        drawingInd = i
        break
      }
    }
    if(drawingInd !== -1) {
      for(let j = 0; j < tempDrawings.length; j++) {
        if(j !== drawingInd) {
          drawings.push(tempDrawings[j])
        }
      }
      socket.emit("send-undo", room.id, drawings)
      setRoom(prev => { return {...prev, drawingHistory: drawings} })
    }
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
        <input type="color" id="color" ref={colorInputRef}></input>
        <WidthButtons drawingStats={drawingStats} setDrawingStats={setDrawingStats}/>
        <button onClick={() => setIsEraser(false)} className={!isEraser ? "pen-btn active" : "pen-btn"}>Draw</button>
        <button onClick={() => setIsEraser(true)} className={isEraser ? "eraser-btn active" : "eraser-btn"}>Erase</button>
        <button className="paintui-btn undo-btn" onClick={handleUndo}>Undo</button>
        {room.userWhoOpened === user.name && <button className="paintui-btn clear-btn" onClick={handleClear}>Clear</button>}
      </div>
    </div>
  )
}

export default PaintUI