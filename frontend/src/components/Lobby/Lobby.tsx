// import { useEffect, useState } from 'react'
// import { getOnlineUsers } from '../../app/apiCalls'
import { /*useAppDispatch,*/ useAppSelector } from '../../app/hooks'
// import { updateList } from '../../app/onlineUsersSlice'
import LobbyHeader from '../Login/LobbyHeader'

function Lobby() {
  const usersList = useAppSelector((state) => state.onlineUsers.userList)
  // const dispatch = useAppDispatch()
  // const [onlineUsers, setOnlineUsers] = useState(usersList)

  // async function refreshList() {
  //   const list = await getOnlineUsers()
  //   dispatch(updateList(list))
  // }

  // useEffect(() => {
  //   setOnlineUsers(() => usersList)
  // },[usersList])

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