import { FC} from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../../app/apiCalls'
import { useUserContext } from '../../Contexts/UserProvider'


const LobbyHeader: FC = () => {
    const { user,setUser } = useUserContext()
    const navigate = useNavigate()
    
    const handleSubmit = async () => {
        const userInfo = user
        const res = await logoutUser(userInfo)
        if(typeof(res) !== "string") {
            setUser({name: "", email:"", currentRoom: ""})
            navigate('/')
        }
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