// import React, { useState } from 'react'
import FormFields from './FormFields'

function Login() {
    // const [isLoggedIn, setIsLoggedIn] = useState(false)
    return (
        <>
            <header className='lobby-header'><h1>Whiteboard</h1></header>
            {<FormFields /* setIsLoggedIn={ setIsLoggedIn }*/ />}
        </>
    )
}

export default Login