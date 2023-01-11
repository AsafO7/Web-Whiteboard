import { FC } from "react"
import { PaintUIProps } from "../Room"



const WidthButtons: FC<PaintUIProps> = ({drawingStats ,setDrawingStats}) => {
  return (
    <div className='width-btn-group'>
        <button className="drawing-width w-btn-1" onClick={() => setDrawingStats({...drawingStats, width: 5})}></button>
        <button className="drawing-width w-btn-2" onClick={() => setDrawingStats({...drawingStats, width: 8})}></button>
        <button className="drawing-width w-btn-3" onClick={() => setDrawingStats({...drawingStats, width: 11})}></button>
        <button className="drawing-width w-btn-4" onClick={() => setDrawingStats({...drawingStats, width: 14})}></button>
    </div>
  )
}

export default WidthButtons