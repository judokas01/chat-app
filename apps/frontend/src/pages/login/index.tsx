export const Login = () => {
    const handleLogin = async (args: { email: string; password: string }) => {
        console.log('Login', args)
    }
    return (
        <div>
            <form method="post">
                <label>
                    Email:
                    <input type="email" name="email" />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <button onClick={handleLogin}>Login</button>
            </form>
            <h1>Welcome to Login!</h1>
        </div>
    )
}
