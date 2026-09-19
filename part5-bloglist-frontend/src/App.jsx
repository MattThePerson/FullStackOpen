import { useState, useEffect, useRef } from 'react'

// components
import Togglable from './components/Togglable'
import BlogAdder from './components/BlogAdder'
import Blog from './components/Blog'

// services
import blogService from './services/blogs'
import loginService from './services/login'
import localStore from './services/localStorage'

/* App */
const App = () => {
    const [blogs, setBlogs] = useState([])

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    /* Splash board */
    const [splashMessage, setSplashMessage] = useState(null)
    const [splashGood, setSplashGood] = useState(false)
    let splashTimeout = useRef(null)

    // api and component
    const splash = {
        good: (msg, duration=3000) => {
            setSplashGood(true)
            splash.set(msg, duration)
        },
        bad: (msg, duration=3000) => {
            setSplashGood(false)
            splash.set(msg, duration)
        },
        set: (msg, duration) => {
            setSplashMessage(msg)
            clearTimeout(splashTimeout.current)
            splashTimeout.current = setTimeout(() => setSplashMessage(null), duration)
        },
        component: (
            <div id="splash-board" className={splashGood ? 'good' : 'bad'}>
                <h2>
                    {splashMessage}
                </h2>
            </div>
        ),
    }

    // handle: login
    const handleLogin = async (event) => {
        event.preventDefault()
        const res = await loginService.authenticateUser(username, password)
        if (res.good) {
            setUser(res.data)
            localStore.setJson('loggedInUser', res.data)
            splash.good(`welcome ${username}`)
        } else {
            splash.bad('unable to authenticate user')
        }
    }

    // handle: logout
    const handleLogout = () => {
        setUser(null)
        localStore.remove('loggedInUser')
        splash.good(`goodbye ${username}`)
    }

    const toggleBlogAdderRef = useRef()

    // handle: blog create
    const handleBlogCreate = async (title, author, url, onSuccess) => {
        console.log(title, author, url)
        blogService.setAuthToken(user.token)
        const res = await blogService.create(title, author, url)
        if (res.good) {
            const newBlogs = [ ...blogs, res.data ]
            setBlogs(newBlogs)
            splash.good('created new blog', 2000)
            onSuccess()
            toggleBlogAdderRef.current.toggleVisibility()
        } else {
            splash.bad(`blog creation failed: ${JSON.stringify(res.data)}`, 4000)
        }
    }

    // get blogs
    useEffect(() => {
        blogService.getAll().then(res => setBlogs(res.data))
    }, [])

    // logged in user
    useEffect(() => {
        const user = localStore.getJson('loggedInUser')
        if (user) {
            setUser(user)
            setUsername(user.username)
        }
    }, [])

    // COMPONENT: login form
    const loginForm = (
        <form onSubmit={handleLogin}>
            <h2>Log in</h2>
            <div>
                <label>username
                    <input
                        onChange={({ target }) => setUsername(target.value)}
                    ></input>
                </label>
            </div>
            <div>
                <label>password
                    <input
                        type="password"
                        onChange={({ target }) => setPassword(target.value)}
                    ></input>
                </label>
            </div>
            <button>submit</button>
        </form>
    )

    // COMPONENT: blog list
    const blogList = (
        <div>
            <h2>blogs</h2>
            <p>
                {username} logged in
                <button onClick={handleLogout}>
                    Log out
                </button>
            </p>
            {/* blog adder */}
            <Togglable buttonLabel="create new blog" reff={toggleBlogAdderRef}>
                <BlogAdder onSubmit={handleBlogCreate} />
            </Togglable>
            {/* blog list */}
            <section>
                {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog} />
                )}
            </section>
        </div>
    )

    /* JSX */
    return (
        <>
            {/* not logged in */}
            {!user && loginForm}

            {/* logged in */}
            {user && blogList}

            {/* splash */}
            {splashMessage && splash.component}
        </>
    )
}

export default App
