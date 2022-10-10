// import React, { useState } from 'react'
import FormFields from './FormFields'

function Login(/*{onRegister}: any*/) {
    // const [isLoggedIn, setIsLoggedIn] = useState(false)
    return (
        <>
            <header className='lobby-header'><h1>Whiteboard</h1></header>
            {<FormFields /*onRegister={onRegister}*/ /* setIsLoggedIn={ setIsLoggedIn }*/ />}
        </>
    )
}

export default Login