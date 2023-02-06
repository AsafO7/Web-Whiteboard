import { FC, useRef, useCallback, useEffect, useState} from 'react'
// import { useComponentsSizeToSubstractContext } from '../../../Contexts/ComponentsSizeToSubstractProvider'
import { useOnDraw } from '../../../Hooks/useOnDraw'
import { useRoomContext } from '../../../contexts/RoomProvider'
import { Point } from '../../../contexts/RoomsProvider'
import { SocketDrawingProps } from '../Room'


const Whiteboard: FC<SocketDrawingProps> = ({socket, drawingStats, setDrawingStats, isEraser}) => {
  // const { chatWidth, onlineUsersWidth , headerHeight/*, paintUIHeight*/ } = useComponentsSizeToSubstractContext()
  const containerRef = useRef<HTMLDivElement>(null)

  // const windowWidthRef = useRef<number>(window.innerWidth)
  // const windowHeightRef = useRef<number>(window.innerHeight)

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight)

  const {room, setRoom} = useRoomContext()

  // Sets the ref to the canvas here using the function setCanvasRef in useOnDraw.tsx
  const {setCanvasRef, onMouseDown, getCanvasRef, isDrawingRef} = useOnDraw(onDraw, socket, drawingStats, setDrawingStats, isEraser)

  
  function onDraw(ctx: CanvasRenderingContext2D | null | undefined, point: Point | null, prevPoint: Point | null, isEraser: boolean) {
      drawLine(prevPoint, point, ctx, drawingStats.color, drawingStats.width, isEraser)
  }

  const drawLine = useCallback((
    start: Point | null,
    end: Point | null,
    ctx: CanvasRenderingContext2D | null | undefined,
    color: string,
    width: number,
    isEraser: boolean) => 
    {
      start = start ?? end
      if(ctx && start && end) {
        ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over"
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
        
        if(isDrawingRef.current === true) socket.emit("send-drawing", start, end, drawingStats.color, drawingStats.width, isEraser)
      }
  },[drawingStats.color, drawingStats.width, isDrawingRef, socket])

  // Real time drawing
  useEffect(() => {
    socket.on("receive-drawing", (start: Point, end: Point, color: string, width: number, isEraser) => {
        drawLine(start, end, getCanvasRef()?.getContext("2d"), color, width, isEraser)
    })
    return(() => {
      socket.removeListener("receive-drawing")
    })
},[drawLine, drawingStats.color, getCanvasRef, socket])

 const redraw = useCallback(() => {  
  // if(room.drawingHistory.length === 0) return
  // Clear the canvas to prevent lags
  getCanvasRef()?.getContext("2d")?.clearRect(0,0,windowWidth, windowHeight)
  for(let i = 0; i < room.drawingHistory.length; i++) {
    for(let j = 0; j < room.drawingHistory[i].path.length - 1; j++) {
      drawLine(room.drawingHistory[i].path[j], room.drawingHistory[i].path[j+1], getCanvasRef()?.getContext("2d"), room.drawingHistory[i].color, room.drawingHistory[i].width,
      room.drawingHistory[i].isEraser)
    } 
  }
 },[getCanvasRef, windowWidth, windowHeight, room.drawingHistory, drawLine])

 // Updates the room's drawings through the backend
 useEffect(() => {
  socket.on("update-drawings", (drawings: {path: Point[], color: string, width: number, isEraser: boolean}[]) => {
    setRoom(prev => { return {...prev, drawingHistory: drawings} })
  })

  return () => {
    socket.removeListener("update-drawings")
  }
 },[setRoom, socket])



useEffect(() => {
   // Trying to be responsive
  const handleSizeChange = () => {
    if(windowWidth !== window.innerWidth) setWindowWidth(window.innerWidth)
    if(windowHeight !== window.innerHeight) setWindowHeight(window.innerHeight)
    redraw()
  }

  window.addEventListener("resize", handleSizeChange)
  
  return () => {
    window.removeEventListener("resize", handleSizeChange)
  }
},[getCanvasRef, redraw, windowHeight, windowWidth])

// Receiving the drawing history
  useEffect(() => {
    redraw()
},[redraw])



  return (
    <div className='whiteboard' ref={containerRef}>
        <canvas id='canvas' ref={setCanvasRef} onMouseDown={onMouseDown} 
        width={800}
        height={600}></canvas>
    </div>
  )
}

export default Whiteboard