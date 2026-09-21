import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, splash }) => {

    const [viewDetails, setViewDetails] = useState(false)
    const [blogStateful, setBlog] = useState(blog)

    const toggleViewDetails = () => setViewDetails(!viewDetails)

    const detailsHiddenStyle = { display: viewDetails ? 'none' : 'block' }
    const detailsShownStyle =  { display: viewDetails ? 'block' : 'none' }

    const blogItemStyle = {
        border: '1px solid black',
        width: '25rem',
    }

    const addLike = async () => {
        const data = { ...blogStateful }
        data.user = data.user.id
        data.likes += 1
        console.log('sending put with increased like')
        const res = await blogService.update(data)
        if (res.good) {
            splash.good(`updated likes count to: ${data.likes}`)
            res.data.user = blog.user
            setBlog(res.data)
        } else {
            splash.bad(`unable to update likes: status=${res.status}: ${JSON.stringify(res.data)}`)
        }
    }

    if (!blog.user) {
        return <div>Blog missing user: {JSON.stringify(blog)}</div>
    }

    return (
        <div style={blogItemStyle}>
            <b>{blog.title}</b> by <i>{blog.author}</i>
            <button style={detailsHiddenStyle} onClick={toggleViewDetails} >view</button>
            <button style={detailsShownStyle} onClick={toggleViewDetails} >hide</button>

            {/* blog details */}
            <div style={detailsShownStyle}>
                {blog.url}
                <div>
                    {blogStateful.likes}
                    <button
                        onClick={addLike}
                    >like</button>
                </div>
                {blog.user.username}
            </div>

        </div>
    )
}

export default Blog
