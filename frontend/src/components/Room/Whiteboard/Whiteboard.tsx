import { useCallback, useEffect, useRef, useState } from 'react'
import { useComponentsSizeToSubstractContext } from '../../../contexts/ComponentsSizeToSubstractProvider'
import { useOnDraw } from './Hooks'

function Whiteboard() {
  const { chatWidth, onlineUsersWidth /*, headerHeight, paintUIHeight*/ } = useComponentsSizeToSubstractContext()
  const containerRef = useRef<HTMLDivElement>(null)
  const setCanvasRef = useOnDraw(onDraw)
  // const [boardWidth, setBoardWidth] = useState<number>(10)

  // const handleResize = useCallback(() => {
  //   console.log(window.innerWidth)
    
  //   if(containerRef.current) setBoardWidth(window.innerWidth)
  // },[])

  // useEffect(() => {
  //   // const currRef = containerRef.current
  //   // if(currRef) {
  //     window.addEventListener("resize", handleResize)
  //   // }

  //   return () => window.removeEventListener("resize", handleResize)
  // },[handleResize])
  
  function onDraw(ctx: CanvasRenderingContext2D | null | undefined, point: { x: number; y: number; } | null) {
    if(ctx && point) {
      ctx.fillStyle = "#3a46fe" // Choose a filling color
      ctx?.beginPath() // Begin path to draw
      ctx?.arc(point?.x, point?.y, 2, 0, 2 * Math.PI) // Draw a circle from point
      ctx.fill() // Fill the circle
    }
    
  }

  return (
    <div className='whiteboard' ref={containerRef}>
      <canvas id='canvas' ref={setCanvasRef}
        width={800} 
        height={containerRef.current ? containerRef.current?.clientHeight - 3 : 700}></canvas>
    </div>
  )
}

export default Whiteboard