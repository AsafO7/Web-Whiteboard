import { useCallback, useEffect, useRef } from 'react'
import { useComponentsSizeToSubstractContext } from '../../../Contexts/ComponentsSizeToSubstractProvider'
import { useRoomContext } from '../../../Contexts/RoomProvider'

function Header() {
  const { room } = useRoomContext()
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
    <div className='header' ref={containerRef}>{room.name}</div>
  )
}

export default Header