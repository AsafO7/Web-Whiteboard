// import { useCallback, useEffect, useRef } from 'react'
// import { useComponentsSizeToSubstractContext } from '../../../contexts/ComponentsSizeToSubstractProvider'

import { FC } from "react"
import { drawingProps } from "../Room"

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
    <div className='paint-ui'>PaintUI
      <label htmlFor="color">Color: {drawingStats.color}</label>
      <input type="color" id="color" onChange={e => setDrawingStats({...drawingStats, color: e.target.value})}></input>
    </div>
  )
}

export default PaintUI