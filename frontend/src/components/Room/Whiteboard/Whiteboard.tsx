import { FC, useRef, useCallback, useEffect} from 'react'
import { useComponentsSizeToSubstractContext } from '../../../contexts/ComponentsSizeToSubstractProvider'
import { useOnDraw } from './useOnDraw'
import { SocketRef } from '../../Lobby/Lobby'
import { useRoomContext } from '../../../contexts/RoomProvider'
import { Point } from '../../../contexts/RoomsProvider'
import { PaintUIProps } from '../PaintUI/PaintUI'
// import { Point } from '../../../contexts/RoomsProvider'

type WhiteboardProps = SocketRef & PaintUIProps

const Whiteboard: FC<WhiteboardProps> = ({socket, drawingStats, setDrawingStats}) => {
  const { chatWidth, onlineUsersWidth , headerHeight/*, paintUIHeight*/ } = useComponentsSizeToSubstractContext()
  const containerRef = useRef<HTMLDivElement>(null)

  const windowWidthRef = useRef<number>(window.innerWidth)
  const windowHeightRef = useRef<number>(window.innerHeight)

  const {room, setRoom} = useRoomContext()

  const {setCanvasRef, onMouseDown, getCanvasRef, isDrawingRef} = useOnDraw(onDraw, socket, drawingStats, setDrawingStats)
  // Sets the ref to the canvas here using the function setCanvasRef in Hooks.tsx
  // const ctx = useMemo(() => getCanvasRef() ? getCanvasRef()?.getContext("2d") : null ,[getCanvasRef])

  // const roomDrawings = useRef<(Point[])[]>(room.drawingHistory)
  
  function onDraw(ctx: CanvasRenderingContext2D | null | undefined, point: Point | null, prevPoint: Point | null) {
      drawLine(prevPoint, point, ctx, drawingStats.color, 5)
  }

  const drawLine = useCallback((
    start: Point | null,
    end: Point | null,
    ctx: CanvasRenderingContext2D | null | undefined,
    color: string,
    width: number) => 
    {
      start = start ?? end
      if(ctx && start && end) {
        ctx.beginPath()
        ctx.lineWidth = width
        ctx.strokeStyle = color
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()

        // to avoid line breaks
        ctx.fillStyle = color // Choose a filling color
        ctx.beginPath() // Begin path to draw
        ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI) // Draw a circle from point
        ctx.fill() // Fill the circle
        
        
        if(isDrawingRef.current === true) socket.emit("send-drawing", start, end, drawingStats.color)
      }
  },[drawingStats.color, isDrawingRef, socket])

  // Real time drawing
  useEffect(() => {
    socket.on("receive-drawing", (start: Point, end: Point, color: string) => {
        drawLine(start, end, getCanvasRef()?.getContext("2d"), color, 5)
    })
    return(() => {
      socket.removeListener("receive-drawing")
    })
},[drawLine, drawingStats.color, getCanvasRef, socket])

 const redraw = useCallback(() => {  
  if(room.drawingHistory.length === 0) return
    // Clear the canvas to prevent lags
    getCanvasRef()?.getContext("2d")?.clearRect(0,0,windowWidthRef.current, windowHeightRef.current)
    for(let i = 0; i < room.drawingHistory.length; i++) {
      for(let j = 0; j < room.drawingHistory[i].path.length - 1; j++) {
        drawLine(room.drawingHistory[i].path[j], room.drawingHistory[i].path[j+1], getCanvasRef()?.getContext("2d"), room.drawingHistory[i].color, 5)
      } 
    }
 },[room.drawingHistory, getCanvasRef, drawLine])

 // Updates the room's drawings through the backend
 useEffect(() => {
  socket.on("update-drawings", (drawings: {path: Point[], color: string}[]) => {
    setRoom(prev => { return {...prev, drawingHistory: drawings} })
  })

  return () => {
    socket.removeListener("update-drawings")
  }
 })

 // Trying to be responsive
 const handleSizeChange = useCallback(() => {
  if(windowWidthRef.current !== window.innerWidth) windowWidthRef.current = window.innerWidth
  if(windowHeightRef.current !== window.innerHeight) windowHeightRef.current = window.innerHeight
  redraw()
},[redraw])

useEffect(() => {
  window.addEventListener("resize", handleSizeChange)
  
  return () => {
    window.removeEventListener("resize", handleSizeChange)
  }
},[handleSizeChange, redraw])

  // Receiving the drawing history
  useEffect(() => {
    redraw()
},[redraw])



  return (
    <div className='whiteboard' ref={containerRef}>
      {/* <canvas id='canvas' ref={setCanvasRef} onMouseDown={onMouseDown}
        width={window.innerWidth > 1000 ? Math.abs(window.innerWidth - chatWidth - onlineUsersWidth) - 150 : window.innerWidth - 100} 
        height={containerRef.current ? containerRef.current?.clientHeight - 3 : 700}></canvas> */}
        <canvas id='canvas' ref={setCanvasRef} onMouseDown={onMouseDown} 
        width={window.innerWidth > 1000 ? windowWidthRef.current - chatWidth - onlineUsersWidth - 150 : window.innerWidth - 100}
        height={windowHeightRef.current - headerHeight - 150}></canvas>
    </div>
  )
}

export default Whiteboard