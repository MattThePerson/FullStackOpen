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

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

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

    // handle: login
    const handleLogin = async (event) => {
        event.preventDefault()
        const res = await loginService.authenticateUser(username, password)
        if (res.good) {
            setUser(res.data)
            localStore.setJson('loggedInUser', res.data)
        } else {
            console.log('unable to authenticate user: ', username)
        }
    }

    // handle: logout
    const handleLogout = () => {
        setUser(null)
        localStore.remove('loggedInUser')
    }

    // handle: blog create
    const handleBlogCreate = async (e) => {
        e.preventDefault()
        blogService.setAuthToken(user.token)
        const res = await blogService.create(title, author, url)
        if (res.good) {
            console.log('GOOD:', res.data)
        } else {
            console.log('BAD:', res.status, res.data)
        }
    }

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
            <section>
                <form onSubmit={handleBlogCreate}>
                    <div>
                        <label>title
                            <input onChange={({ target }) => setTitle(target.value)}
                            ></input>
                        </label>
                    </div>
                    <div>
                        <label>author
                            <input onChange={({ target }) => setAuthor(target.value)}
                            ></input>
                        </label>
                    </div>
                    <div>
                        <label>url
                            <input onChange={({ target }) => setUrl(target.value)}
                            ></input>
                        </label>
                    </div>
                    <button>create</button>
                </form>
            </section>
            {/* blog list */}
            <section>
                {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog} />
                )}
            </section>
        </div>
    )

    /* RETURN */
    return (
        <>
            {/* not logged in */}
            {!user && loginForm}

            {/* logged in */}
            {user && blogList}
        </>
    )
}

export default App
