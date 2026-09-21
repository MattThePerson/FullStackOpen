import { useState } from 'react'

const Blog = ({ blog }) => {

    const [viewDetails, setViewDetails] = useState(false)

    const toggleViewDetails = () => setViewDetails(!viewDetails)

    const detailsHiddenStyle = { display: viewDetails ? 'none' : 'block' }
    const detailsShownStyle =  { display: viewDetails ? 'block' : 'none' }

    const blogItemStyle = {
        border: '1px solid black',
        width: '25rem',
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
                    {blog.likes}
                    <button
                        onClick={() => console.log('me like')}
                    >like</button>
                </div>
                {blog.user.username}
            </div>

        </div>
    )
}

export default Blog
