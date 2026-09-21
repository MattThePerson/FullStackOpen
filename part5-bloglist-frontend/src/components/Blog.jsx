import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {

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
        const data = { ...blog }
        data.user = data.user.id
        data.likes += 1
        console.log('sending put with increased like')
        const res = await blogService.update(data)
        if (res.good) {
            console.log('gucci!')
            setBlog(res.data)
        } else {
            console.log('oh fuck')
        }
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
