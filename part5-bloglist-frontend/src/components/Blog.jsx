import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, handleLikeBlog, splash, removeBlogFromPage, currentUser }) => {

  const [viewDetails, setViewDetails] = useState(false)
  const [blogStateful, setBlog] = useState(blog)

  const toggleViewDetails = () => setViewDetails(!viewDetails)

  const detailsHiddenStyle = { display: viewDetails ? 'none' : 'block' }
  const detailsShownStyle = { display: viewDetails ? 'block' : 'none' }

  const uploadedByCurrentUser = blog.user && currentUser.username === blog.user.username

  const blogItemStyle = {
    border: '1px solid black',
    width: '25rem',
  }

  // should probably exist in App.jsx
  const handleDelete = async () => {
    if (window.confirm(`delete blog with title: "${blog.title}"`)) {
      console.log('deleting blog with id:', blog.id)
      const res = await blogService.remove(blog.id)
      if (res.good) {
        splash.good(`deleted blog with id: ${blog.id}`)
        removeBlogFromPage(blog.id)
      } else {
        console.log(res.status, res.data)
        splash.bad(`failed to delete blog: status=${res.status}: ${JSON.stringify(res.data)}`)
      }
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
        <div>{blog.url}</div>
        <div>
          {blogStateful.likes}
          <button
            onClick={() => handleLikeBlog(blog.id)}
          >like</button>
        </div>
        <div>{blog.user.username}</div>
        {uploadedByCurrentUser && <div><button style={{ background: 'blue' }} onClick={handleDelete} >delete</button></div>}
      </div>

    </div>
  )
}

export default Blog
