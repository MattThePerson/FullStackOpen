import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import localStore from './services/localStorage'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    // get blogs
    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
    }, [])

    // logged in user
    useEffect(() => {
        const user = localStore.getJson('loggedInUser')
        if (user) {
            setUser(user)
            setUsername(user.username)
        }
    }, [])

    // handle login
    const handleLogin = async (event) => {
        event.preventDefault()
        const user = await loginService.authenticateUser(username, password)
        if (user) {
            setUser(user)
            localStore.setJson('loggedInUser', user)
        } else {
            console.log('unable to authenticate user: ', username)
        }
    }

    // handle logout
    const handleLogout = () => {
        setUser(null)
        localStore.remove('loggedInUser')
    }

    // login form
    const loginForm = (
        <form onSubmit={handleLogin}>
            <h2>Log in</h2>
            <div>
                <label>
                    username
                    <input
                        type="text"
                        // value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    ></input>
                </label>
            </div>
            <div>
                <label>
                    password
                    <input
                        type="password"
                        onChange={({ target }) => setPassword(target.value)}
                    ></input>
                </label>
            </div>
            <button>submit</button>
        </form>
    )

    /* RETURN */
    return (
        <>
            {/* not logged in */}
            {!user && loginForm}

            {/* logged in */}
            {user && (
                <div>
                    <h2>blogs</h2>
                    <p>
                        {username} logged in
                        <button onClick={handleLogout}>
                            Log out
                        </button>
                    </p>
                    <div>
                        {blogs.map(blog =>
                            <Blog key={blog.id} blog={blog} />
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default App
