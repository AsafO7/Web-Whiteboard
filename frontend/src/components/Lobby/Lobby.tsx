import { useAppSelector } from '../../app/hooks'
import LobbyHeader from '../Login/LobbyHeader'

function Lobby() {
  const usersList = useAppSelector((state) => state.onlineUsers.userList)

  return (
    <>
      <LobbyHeader />
      {usersList.map(({_id, name}) => {
        return <div key={_id}>{name}</div>
      })}
    </>
  )
}

export default Lobby