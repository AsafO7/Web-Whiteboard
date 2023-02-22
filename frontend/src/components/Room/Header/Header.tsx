import { useRoomContext } from '../../../contexts/RoomProvider'

function Header() {
  const { room } = useRoomContext()

  return (
    <div className='header'>{room.name}</div>
  )
}

export default Header