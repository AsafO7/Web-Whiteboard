import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { WritableDraft } from 'immer/dist/internal'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import { logoutUser } from '../../app/apiCalls'
import { logError, logoutSuccess } from '../../app/userSlice'


const LobbyHeader: FC = () => {
    const userInfo = useSelector((state: WritableDraft<{user: { userInfo: { name: String, email: String } }}>) => state.user.userInfo)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const handleSubmit = async () => {
        const res = await logoutUser(userInfo, dispatch)
        if(typeof(res) === "string") {
            dispatch(logError())
            // setErrMsg(() => res)
        }
        
        else {
            dispatch(logoutSuccess())
            // setErrMsg(() => "")
            navigate('/')
        }
    }

    return (
    <header className='lobby-header'>
        <h1>Whiteboard</h1>
        <span className='logout-section'>
            <h4>Welcome, {userInfo.name ? userInfo.name : "bug++"}</h4>
            <button className='logout-btn' onClick={handleSubmit}>Logout<i style={{marginLeft: '0.5rem'}} className="fa">&#xf08b;</i></button>
        </span>
    </header>
    )
}

export default LobbyHeader