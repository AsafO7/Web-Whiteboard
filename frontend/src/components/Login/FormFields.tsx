import React, { useRef, useState } from 'react'
import { loginUser } from '../../app/apiCalls'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../../contexts/UserProvider'


function FormFields () {
    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const [errMsg, setErrMsg] = useState("")
    const { setUser } = useUserContext()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const name = nameRef.current?.value
        const email = emailRef.current?.value
        const password = passwordRef.current?.value
        
        const res = await loginUser({name, email, password})
        
        if(typeof(res) === "undefined") {
            setErrMsg(() => "Invalid data")
        }

        else if(typeof(res) === "string") {
            setErrMsg(() => res)
        }
        
        else {
            setErrMsg(() => "")
            const userInfo = {name, email, currentRoom: ""}
            setUser(() => userInfo)
            navigate('/lobby')
        }
    }

    return (
    <div className='form-container'>
        <form className='form'>
            <h1>Login/Register to see the rooms</h1>
            <label>Name: <input type='text' name='name' required className='form-input' ref={nameRef} /></label>
            <label>Email: <input type='email' name='email' required className='form-input' ref={emailRef} /></label>
            <label>Password: <input type='password' name='password' required minLength={6} className='form-input' ref={passwordRef} /></label>
            <button type="submit" onClick={handleSubmit} className='form-btn'>Register\Login</button>
            {errMsg && <div className='form-err-msg'>{errMsg}</div>}
        </form>
    </div>
    )
}

export default FormFields