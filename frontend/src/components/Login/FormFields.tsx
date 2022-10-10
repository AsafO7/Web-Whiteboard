import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getOnlineUsers, loginUser } from '../../app/apiCalls'
import { useNavigate } from 'react-router-dom'
import { WritableDraft } from 'immer/dist/internal'
import { logError, loginSuccess } from '../../app/userSlice'
import { updateList } from '../../app/onlineUsersSlice'
import { useUserContext } from '../../contexts/UserProvider'

// interface log {
//     setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
// }

function FormFields/*<log>*/  (/*{onRegister}: any*/) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const { setUser } = useUserContext()
    // console.log(setUsername)
    const { pending } = useAppSelector((state: WritableDraft<{user: { pending: boolean }}>) => state.user)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        
        const res = await loginUser({name, email, password}, dispatch)
        console.log(res)
        
        if(typeof(res) === "undefined") {
            dispatch(logError())
            setErrMsg(() => "Invalid data")
        }

        else if(typeof(res) === "string") {
            dispatch(logError())
            setErrMsg(() => res)
        }
        
        else {
            dispatch(loginSuccess(res))
            const list = await getOnlineUsers()
            dispatch(updateList(list))
            setErrMsg(() => "")
            const userInfo = {name, email}
            setUser(() => userInfo)
            // onRegister(() => name)
            // console.log(onRegister)
            navigate('/lobby')
        }
    }

    return (
    <div className='form-container'>
        <form className='form' /*action='/lobby' method='POST'*/>
            <h1>Login/Register to see the rooms</h1>
                <label>Name: <input type='text' name='name' required className='form-input' onChange={(e) => setName(() => e.target.value)}/></label>
                <label>Email: <input type='email' name='email' required className='form-input' onChange={(e) => setEmail(() => e.target.value)}/></label>
                <label>Password: <input type='password' name='password' required minLength={6} className='form-input' onChange={(e) => setPassword(() => e.target.value)}/></label>
            <button disabled={pending} type="submit" onClick={handleSubmit}>Register\Login</button>
            {errMsg && <div className='form-err-msg'>{errMsg}</div>}
        </form>
    </div>
    )
}

export default FormFields