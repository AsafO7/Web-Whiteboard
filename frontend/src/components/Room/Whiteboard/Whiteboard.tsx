import { FC, useRef, useCallback, useEffect} from 'react'
import { useOnDraw } from '../../../Hooks/useOnDraw'
// import { useRoomContext } from '../../../contexts/RoomProvider'
import { Point } from '../../../contexts/DrawingsProvider'
import { SocketDrawingProps } from '../Room'
import { useDrawingsContext } from '../../../contexts/DrawingsProvider'

const Whiteboard: FC<SocketDrawingProps> = ({socket, drawingStats, isEraser}) => {

  // const {room, setRoom} = useRoomContext()
  const { drawingHistory, setDrawingHistory } = useDrawingsContext()

  // Sets the ref to the canvas here using the function setCanvasRef in useOnDraw.tsx
  const {setCanvasRef, onMouseDown, getCanvasRef, isDrawingRef} = useOnDraw(onDraw, socket, drawingStats, isEraser)

  // const circle = document.getElementById('circle');
  const circle = useRef<HTMLDivElement>(null)
  const circleStyle = circle.current?.style;

  useEffect(() => {
    function followCursor(e: MouseEvent) {
      window.requestAnimationFrame(() => {
        if(circleStyle) {
          circleStyle.top = `${ e.clientY - circle.current.offsetHeight/2 }px`;
          circleStyle.left = `${ e.clientX - circle.current.offsetWidth/2 }px`;
          circleStyle.width = `${drawingStats.width}px`
          circleStyle.height = `${drawingStats.width}px`
        }
      });
    }

    function hideCursor() {
      if(circleStyle) circleStyle.display = "none"
    }

    function showCursor() {
      if(circleStyle && isEraser) circleStyle.display = "block"
    }

    const cRef = getCanvasRef()
    cRef?.addEventListener("mousemove", followCursor)
    cRef?.addEventListener("mouseenter", showCursor)
    cRef?.addEventListener("mouseleave", hideCursor)

    function removeListeners() {
      cRef?.removeEventListener("mousemove", followCursor)
      cRef?.removeEventListener("mouseenter", showCursor)
      cRef?.removeEventListener("mouseleave", hideCursor)
    }
    
    return () => {
      removeListeners()
    }
  },[circleStyle, drawingStats.width, getCanvasRef, isEraser])

  
  function onDraw(ctx: CanvasRenderingContext2D | null | undefined, point: Point | null, prevPoint: Point | null, isEraser: boolean) {
      drawLine(prevPoint, point, ctx, drawingStats.colorRef?.current?.value, drawingStats.width, isEraser)
  }

  const drawLine = useCallback((
    start: Point | null,
    end: Point | null,
    ctx: CanvasRenderingContext2D | null | undefined,
    color: string | undefined,
    width: number,
    isEraser: boolean) => 
    {
      start = start ?? end
      if(ctx && start && end) {
        ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over"
        ctx.beginPath()
        ctx.lineWidth = width
        ctx.lineCap = 'round'
        if(color) { ctx.strokeStyle = color }
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()

        // to avoid line breaks
        if(color) { ctx.fillStyle = color } // Choose a filling color
        ctx.beginPath() // Begin path to draw
        ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI) // Draw a circle from point
        ctx.fill() // Fill the circle
        
        if(isDrawingRef.current === true) socket.emit("send-drawing", start, end, drawingStats.colorRef?.current?.value, drawingStats.width, isEraser)
      }
  },[drawingStats.colorRef, drawingStats.width, isDrawingRef, socket])

  // Real time drawing
  useEffect(() => {
    socket.on("receive-drawing", (start: Point, end: Point, color: string, width: number, isEraser) => {
        drawLine(start, end, getCanvasRef()?.getContext("2d"), color, width, isEraser)
    })
    return(() => {
      socket.removeListener("receive-drawing")
    })
},[drawLine, getCanvasRef, socket])

 const redraw = useCallback(() => {  
  // if(room.drawingHistory.length === 0) return
  // Clear the canvas to prevent lags
  getCanvasRef()?.getContext("2d")?.clearRect(0,0,window.innerWidth, window.innerHeight)
  for(let i = 0; i < drawingHistory.length; i++) {
    for(let j = 0; j < drawingHistory[i].path.length - 1; j++) {
      drawLine(drawingHistory[i].path[j], drawingHistory[i].path[j+1], getCanvasRef()?.getContext("2d"), drawingHistory[i].color, drawingHistory[i].width,
      drawingHistory[i].isEraser)
    } 
  }
 },[getCanvasRef, drawingHistory, drawLine])

 // Updates the room's drawings through the backend
 useEffect(() => {
  socket.on("update-drawings", (drawings: {path: Point[], color: string, width: number, isEraser: boolean, userWhoDrew: String}[]) => {
    setDrawingHistory(drawings)
  })

  return () => {
    socket.removeListener("update-drawings")
  }
 },[setDrawingHistory, socket])

// Receiving the drawing history
  useEffect(() => {
    redraw()
    setDrawingHistory(drawingHistory)
},[drawingHistory, setDrawingHistory])


  return (
    <div className='whiteboard'>
        <canvas id='canvas' className={isEraser ? "eraser-cursor" : ""} ref={setCanvasRef} onMouseDown={onMouseDown} 
        width={800}
        height={800}></canvas>
        <div id="circle" ref={circle}></div>
    </div>
    
  )
}

export default Whiteboard