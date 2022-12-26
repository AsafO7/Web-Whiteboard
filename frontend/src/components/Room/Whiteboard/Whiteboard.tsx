import { FC, useRef, useCallback, useEffect} from 'react'
import { useComponentsSizeToSubstractContext } from '../../../contexts/ComponentsSizeToSubstractProvider'
import { useOnDraw } from './useOnDraw'
import { SocketRef } from '../../Lobby/Lobby'

const Whiteboard: FC<SocketRef> = ({socket}) => {
  const { chatWidth, onlineUsersWidth /*, headerHeight, paintUIHeight*/ } = useComponentsSizeToSubstractContext()
  const containerRef = useRef<HTMLDivElement>(null)

  const {setCanvasRef, onMouseDown, getCanvasRef, isDrawingRef} = useOnDraw(onDraw, socket)
  // Sets the ref to the canvas here using the function setCanvasRef in Hooks.tsx
  // const ctx = useMemo(() => getCanvasRef() ? getCanvasRef()?.getContext("2d") : null ,[getCanvasRef])
  
  function onDraw(ctx: CanvasRenderingContext2D | null | undefined, point: { x: number; y: number; } | null, prevPoint: { x: number; y: number; } | null) {
      drawLine(prevPoint, point, ctx, "#43c2ad", 5)
  }

  const drawLine = useCallback((
    start: { x: number; y: number; } | null,
    end: { x: number; y: number; } | null,
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
        
        
        if(isDrawingRef.current === true) socket.emit("send-drawing", start, end)
      }
  },[isDrawingRef, socket])

  useEffect(() => {
    socket.on("receive-drawing", (start: {x: number, y: number}, end: {x: number, y: number}) => {
        drawLine(start, end, getCanvasRef()?.getContext("2d"), "#43c2ad", 5)
    })
    return(() => {
      socket.removeListener("receive-drawing")
    })
},[drawLine, getCanvasRef, socket])

  return (
    <div className='whiteboard' ref={containerRef}>
      <canvas id='canvas' ref={setCanvasRef} onMouseDown={onMouseDown}
        width={window.innerWidth > 1000 ? Math.abs(window.innerWidth - chatWidth - onlineUsersWidth) - 150 : window.innerWidth - 100} 
        height={containerRef.current ? containerRef.current?.clientHeight - 3 : 700}></canvas>
    </div>
  )
}

export default Whiteboard