// import { useCallback, useEffect, useRef } from 'react'
// import { useComponentsSizeToSubstractContext } from '../../../contexts/ComponentsSizeToSubstractProvider'

import { FC } from "react"
import { drawingProps } from "../Room"
import WidthButtons from "../Whiteboard/WidthButtons"

export interface PaintUIProps {
  drawingStats: drawingProps, setDrawingStats: React.Dispatch<React.SetStateAction<drawingProps>>
}

const PaintUI: FC<PaintUIProps> = ({drawingStats, setDrawingStats}) => {

  // const [color, setColor] = useState<string>("")

  // const { headerHeight, setHeaderHeight } = useComponentsSizeToSubstractContext()
  // const containerRef = useRef<HTMLDivElement>(null)

  // const handleSizeChange = useCallback(() => {
  //   console.log(containerRef.current)
    
  //   if(containerRef.current && headerHeight !== containerRef.current?.offsetHeight) {
  //     setHeaderHeight(containerRef.current?.offsetHeight)
  //   }
  // },[headerHeight, setHeaderHeight])

  // useEffect(() => {
  //   window.addEventListener("resize", handleSizeChange)
    
  //   return () => {
  //     window.removeEventListener("resize", handleSizeChange)
  //   }
  // },[containerRef.current?.offsetHeight, handleSizeChange])


  return (
    <div className='paint-ui'>
      <div className="paint-ui-grid">
        <label htmlFor="color">Color:</label>
        <input type="color" id="color" onChange={e => setDrawingStats({...drawingStats, color: e.target.value})}></input>
        <WidthButtons drawingStats={drawingStats} setDrawingStats={setDrawingStats}/>
      </div>
    </div>
  )
}

export default PaintUI