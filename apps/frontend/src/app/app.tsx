import styled from 'styled-components'

import { Route, Routes, Link } from 'react-router-dom'
import { Login } from '../pages/login'
import { Register } from '../pages/register'

const StyledApp = styled.div`
    // Your style here
`

export function App() {
    return (
        <StyledApp>
            {/* START: routes */}
            {/* These routes and navigation have been generated for you */}
            {/* Feel free to move and update them to fit your needs */}
            <br />
            <hr />
            <br />
            <div role="navigation">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/page-2">Page 2</Link>
                    </li>
                    <li>
                        <Link to="/login">login</Link>
                    </li>
                    <li>
                        <Link to="/register">register</Link>
                    </li>
                </ul>
            </div>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div>
                            This is the generated root route.{' '}
                            <Link to="/page-2">Click here for page 2.</Link>
                        </div>
                    }
                />
                <Route path="/login" element={<Login></Login>} />
                <Route path="/register" element={<Register></Register>} />
            </Routes>
        </StyledApp>
    )
}

export default App
