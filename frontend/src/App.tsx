import { useCallback, useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import { getlobbyInfo, getRoomInfo, logoutUser } from './app/apiCalls';
// import { useAppDispatch } from './app/hooks';
import Lobby from './components/Lobby/Lobby';
import Login from './components/Login/Login';
import Room from './components/Room/Room';
import { useRoomContext } from './contexts/RoomProvider';
import { useRoomsContext } from './contexts/RoomsProvider';
import { useUserContext } from './contexts/UserProvider';

function App() {
  const { user } = useUserContext()
  const { setRooms } = useRoomsContext()
  const { setRoom } = useRoomContext()
  const loading = useRef(true)
  // const dispatch = useAppDispatch()

  // console.log(2);
  
  const loadInfo = useCallback(async() => {
    if(user.name) {
      // let res: any
      // while(true) {
        // res = await getlobbyInfo(user)
        // if(typeof(res) !== "string" && typeof(res) !== "undefined") break
      // }
      // if(typeof(res) !== "string") {
        // const userInfo = { name: user.name, email: user.email, currentRoom: user.currentRoom }
        // setUser(() => user)
      // }
      if(user.currentRoom !== "") {
        const res = await getRoomInfo(user.currentRoom, user.name)
        // console.log(res)
        const newRoomInfo = { name: res.name, id: res.id, userWhoOpened: res.userWhoOpened, onlineUsers: res.onlineUsers, drawingHistory: res.drawingHistory}
        setRoom(() => newRoomInfo)
      }
      // else {
        const res = await getlobbyInfo(user)
        
        if(res.rooms.length > 0) {
          loading.current = false
          setRooms(() => res.rooms)
        }
      // }
    }
  },[setRoom, setRooms, user])

  useEffect(() => {
    loadInfo()
  },[loadInfo])


  useEffect(() => {
    const handleTabClose = async (event: { preventDefault: () => void; returnValue: string; }) => {
      event.preventDefault();
      await logoutUser(user)
      // const userInfo = {currRoom: "", user}
      // await updateUserRoom(user)
      // if(typeof(res2) === "string") {
      //   console.log(res2)
      // }
      // else {
      //     currentRoom.current = res2.currRoom
      // }
      return "beforeunload"
    }

    window.addEventListener('beforeunload', handleTabClose)

    return () => {
      window.removeEventListener('beforeunload', handleTabClose)
    }
  })
  
  return (
    <>
      <Routes>
        <Route path='/' element={ user.name ? <Navigate replace to='/lobby' /> : <Login /*onRegister={setUsername}*//>} />
        <Route path='/lobby' element={!user.name ? <Navigate replace to='/' /> : <Lobby loading={loading.current} />} />
        <Route path='/room/:id' element={user.currentRoom ? <Room /> : <Navigate replace to='/' />} />
      </Routes>
    </>
  );
}

export default App;
