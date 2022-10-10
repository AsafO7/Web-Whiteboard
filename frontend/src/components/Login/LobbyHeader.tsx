import { FC } from 'react'
import { WritableDraft } from 'immer/dist/internal'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logoutUser } from '../../app/apiCalls'
import { logError, loginSuccess, logoutSuccess } from '../../app/userSlice'
import { useUserContext } from '../../contexts/UserProvider'


const LobbyHeader: FC = () => {
    const { name, email } = useAppSelector((state: WritableDraft<{user: { userInfo: { name: String, email: String } }}>) => state.user.userInfo)
    const { user, setUser } = useUserContext()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    
    setTimeout(() => {
        dispatch(loginSuccess(user))
        console.log(name, email)
    }, 500)
    
    const handleSubmit = async () => {
        const res = await logoutUser({name, email}, dispatch)
        if(typeof(res) === "string") {
            dispatch(logError())
        }
        
        else {
            dispatch(logoutSuccess())
            const userInfo = {name: "", email: ""}
            setUser(() => userInfo)
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