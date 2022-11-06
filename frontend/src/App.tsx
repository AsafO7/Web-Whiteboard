import { useCallback, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import { getlobbyInfo, logoutUser } from './app/apiCalls';
import Lobby from './components/Lobby/Lobby';
import Login from './components/Login/Login';
import Room from './components/Room/Room';
import { useRoomsContext } from './contexts/RoomsProvider';
import { useUserContext } from './contexts/UserProvider';

function App() {
  const { user, setUser } = useUserContext()
  const { setRooms } = useRoomsContext()
  const [loading, setLoading] = useState(true)
  
  const loadInfo = useCallback(async() => {
    if(user.name) {
        const res = await getlobbyInfo(user)
        const userInfo = { name: user.name, email: user.email, currentRoom: ""}
        setUser(() => userInfo)
        setLoading(() => false)
        if(res.rooms.length > 0) {
          setRooms(() => res.rooms)
        }
    }
  },[setRooms, setUser, user])

  useEffect(() => {
    loadInfo()
  },[])


  useEffect(() => {
    const handleTabClose = async (event: { preventDefault: () => void; returnValue: string; }) => {
      event.preventDefault();
      await logoutUser(user)
      setUser({ name: user.name, email: user.email, currentRoom: ""})
      return "beforeunload"
    }

    window.addEventListener('beforeunload', handleTabClose)

    return () => {
      window.removeEventListener('beforeunload', handleTabClose)
    }
  })

  // console.log(1)
  
  
  return (
    <>
      <Routes>
        <Route path='/' element={ user.name ? <Navigate replace to='/lobby' /> : <Login /*onRegister={setUsername}*//>} />
        <Route path='/lobby' element={!user.name ? <Navigate replace to='/' /> : <Lobby loading={loading} />} />
        <Route path='/room/:id' element={user.currentRoom ? <Room /> : <Navigate replace to='/' />} />
      </Routes>
    </>
  );
}

export default App;
