// src/components/Login.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react'

// Define the types for the state
interface LoginState {
    email: string
    password: string
}

export const Login = () => {
    const [loginState, setLoginState] = useState<LoginState>({ email: '', password: '' })

    // Handle form submission
    const handleLogin = (e: FormEvent) => {
        e.preventDefault()
        // Log email and password (for now)
        console.log('Email:', loginState.email)
        console.log('Password:', loginState.password)

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
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={loginState.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
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
