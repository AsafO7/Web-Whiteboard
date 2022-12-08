import { useCallback, useEffect, useRef, useState } from 'react'

function Whiteboard() {
  // const divRef = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const ctx = useRef<CanvasRenderingContext2D | null | undefined>(null)/*useMemo(() => { return canvas.current?.getContext("2d") }, [])*/
  // const [canvasWidth, setCanvasWidth] = useState<number>(1000)
  // const [canvasHeight, setCanvasHeight] = useState<number>(1000)
  const [isPainting, setIsPainting] = useState(false)
  
  useEffect(() => {
    ctx.current = canvas?.current?.getContext("2d")
  },[])

  // window.addEventListener("load", () => {
  //   ctx.current = canvas?.current?.getContext("2d")
  // })

  const draw = useCallback((e: MouseEvent) => {
    if(!isPainting) return
    if(ctx && ctx.current) {
      ctx.current.lineWidth = 10
      ctx.current.lineCap = "round"

      ctx.current.lineTo(e.clientX, e.clientY)
      ctx.current.stroke()
      ctx.current.beginPath()
      ctx.current.moveTo(e.clientX, e.clientY)
    }

  },[ctx, isPainting])

  const startPosition = useCallback((e: MouseEvent) => {
    setIsPainting(true)
    draw(e)
  },[draw])

  const finishPosition = useCallback(() => {
    setIsPainting(false)
    ctx?.current?.beginPath()
  },[ctx])

  useEffect(() => {
    canvas.current?.addEventListener("mousedown", startPosition)
    const c = canvas.current
    return (() => {
      c?.removeEventListener("mousedown", startPosition)
    })
  },[startPosition])

  useEffect(() => {
    canvas.current?.addEventListener("mouseup", finishPosition)
    const c = canvas.current
    return (() => {
      c?.removeEventListener("mouseup", finishPosition)
    })
  },[finishPosition])

  useEffect(() => {
    canvas.current?.addEventListener("mousemove", draw)
    const c = canvas.current
    return (() => {
      c?.removeEventListener("mousemove", draw)
    })
  },[draw])

  console.log("4")
  

  return (
    <div className='whiteboard'>
      <canvas id="canvas" width={1000} height={800} ref={canvas}></canvas>
    </div>
  )
}

export default Whiteboard