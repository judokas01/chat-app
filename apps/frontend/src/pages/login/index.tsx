import React, { useState, ChangeEvent, FormEvent } from 'react'
import { loginQuery } from '../../utilties/gql/queries'
import { client } from '../../utilties/gql/apollo'

// Define the types for the state
interface LoginState {
    userName: string
    password: string
}

export const Login = () => {
    const [loginState, setLoginState] = useState<LoginState>({ password: '', userName: '' })

    // Handle form submission
    const handleLogin = (e: FormEvent) => {
        e.preventDefault()
        // Log email and password (for now)
        console.log('userName:', loginState.userName)
        console.log('Password:', loginState.password)

        loginQuery({ password: loginState.password, userName: loginState.userName }, client).then()

        // TODO: Add actual login logic
    }

    // Handle input change (for both email and password)
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setLoginState((prevState) => ({
            ...prevState,
            [id]: value, // Dynamically set email or password based on the id
        }))
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label htmlFor="userName">Username</label>
                    <input
                        type="username"
                        id="userName"
                        value={loginState.userName}
                        onChange={handleInputChange}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={loginState.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login
