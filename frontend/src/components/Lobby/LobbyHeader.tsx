import { FC} from 'react'
import { useNavigate } from 'react-router-dom'
// import { useAppDispatch } from '../../app/hooks'
import { logoutUser } from '../../app/apiCalls'
// import { loginSuccess, logoutSuccess } from '../../app/userSlice'
import { useUserContext } from '../../contexts/UserProvider'

// interface emptyRoomFunc {
//     updateToEmptyRoom: () => Promise<void>
// }

const LobbyHeader: FC/*<emptyRoomFunc>*/ = (/*{updateToEmptyRoom}*/) => {
    const { user } = useUserContext()
    const navigate = useNavigate()
    
    
    // const dispatch = useAppDispatch()
    
    // setTimeout(() => {
    //     dispatch(loginSuccess(user))
    // }, 500)
    
    const handleSubmit = async () => {
        const userInfo = user
        const res = await logoutUser(userInfo)
        if(typeof(res) !== "string") {
            // if(user.currentRoom !== "") {
            //     updateToEmptyRoom()
            // }
            // dispatch(logoutSuccess())
            // const emptyUser = {name: "", email: ""}
            // setUser(() => emptyUser)
            navigate('/')
            // dispatch(logError())
        }
        
        // else {
        //     dispatch(logoutSuccess())
        //     const userInfo = {name: "", email: ""}
        //     setUser(() => userInfo)
        //     navigate('/')
        // }
    }

    return (
    <header className='lobby-header'>
        <h1>Whiteboard</h1>
        <span className='logout-section'>
            <h4>Welcome, {user.name ? user.name : "Loading..."}</h4>
            <button className='logout-btn' onClick={handleSubmit}>Logout<i style={{marginLeft: '0.5rem'}} className="fa">&#xf08b;</i></button>
        </span>
    </header>
    )
}

export default LobbyHeader