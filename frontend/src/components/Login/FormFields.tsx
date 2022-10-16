import React, { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { /*getOnlineUsers,*/ loginUser } from '../../app/apiCalls'
import { useNavigate } from 'react-router-dom'
import { WritableDraft } from 'immer/dist/internal'
import { logError, loginSuccess } from '../../app/userSlice'
// import { updateList } from '../../app/onlineUsersSlice'
import { useUserContext } from '../../contexts/UserProvider'

// interface log {
//     setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
// }

function FormFields/*<log>*/  (/*{onRegister}: any*/) {
    const nameRef = useRef<any>()
    const emailRef = useRef<any>()
    const passwordRef = useRef<any>()
    const [errMsg, setErrMsg] = useState("")
    const { setUser } = useUserContext()
    const { pending } = useAppSelector((state: WritableDraft<{user: { pending: boolean }}>) => state.user)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const name = nameRef.current.value
        const email = emailRef.current.value
        const password = passwordRef.current.value
        
        const res = await loginUser({name, email, password})
        
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
            // const list = await getOnlineUsers()
            // dispatch(updateList(list))
            setErrMsg(() => "")
            const userInfo = {name, email, currentRoom: ""}
            setUser(() => userInfo)
            navigate('/lobby')
        }
    }

    return (
    <div className='form-container'>
        <form className='form' /*action='/lobby' method='POST'*/>
            <h1>Login/Register to see the rooms</h1>
            <label>Name: <input type='text' name='name' required className='form-input' ref={nameRef} /></label>
            <label>Email: <input type='email' name='email' required className='form-input' ref={emailRef} /></label>
            <label>Password: <input type='password' name='password' required minLength={6} className='form-input' ref={passwordRef} /></label>
            <button disabled={pending} type="submit" onClick={handleSubmit} className='form-btn'>Register\Login</button>
            {errMsg && <div className='form-err-msg'>{errMsg}</div>}
        </form>
    </div>
    )
}

export default FormFields