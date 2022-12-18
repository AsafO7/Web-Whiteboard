import { useCallback, useEffect, useRef } from 'react'
import { useComponentsSizeToSubstractContext } from '../../../contexts/ComponentsSizeToSubstractProvider'

function PaintUI() {

  const { headerHeight, setHeaderHeight } = useComponentsSizeToSubstractContext()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSizeChange = useCallback(() => {
    if(containerRef.current && headerHeight !== containerRef.current?.offsetHeight) {
      setHeaderHeight(containerRef.current?.offsetHeight)
    }
  },[headerHeight, setHeaderHeight])

  useEffect(() => {
    window.addEventListener("resize", handleSizeChange)
    
    return () => {
      window.removeEventListener("resize", handleSizeChange)
    }
  },[containerRef.current?.offsetHeight, handleSizeChange])

  return (
    <div className='paint-ui'>PaintUI</div>
  )
}

export default PaintUI