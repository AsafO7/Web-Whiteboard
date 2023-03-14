import { FC, useRef } from "react"
import { PaintUIProps } from "../Room"


const WidthButtons: FC<PaintUIProps> = ({drawingStats ,setDrawingStats}) => {

  let currentWidthRef = useRef<number>(5)

  function handleChangeWidth(width: number) {
    if(currentWidthRef.current === width) return
    currentWidthRef.current = width
    setDrawingStats({...drawingStats, width: width})
  }

  return (
    <div className='width-btn-group'>
        <button className={currentWidthRef.current === 5 ? "drawing-width w-btn-1 activeWidthBtn" : "drawing-width w-btn-1"} onClick={() => handleChangeWidth(5)}></button>
        <button className={currentWidthRef.current === 8 ? "drawing-width w-btn-2 activeWidthBtn" : "drawing-width w-btn-2"} onClick={() => handleChangeWidth(8)}></button>
        <button className={currentWidthRef.current === 11 ? "drawing-width w-btn-3 activeWidthBtn" : "drawing-width w-btn-3"} onClick={() => handleChangeWidth(11)}></button>
        <button className={currentWidthRef.current === 14 ? "drawing-width w-btn-4 activeWidthBtn" : "drawing-width w-btn-4"} onClick={() => handleChangeWidth(14)}></button>
    </div>
  )
}

export default WidthButtons