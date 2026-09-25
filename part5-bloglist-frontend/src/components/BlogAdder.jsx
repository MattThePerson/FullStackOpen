import { useState } from 'react'

const BlogAdder = ({ onSubmit }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(title, author, url, () => {
      setTitle('')
      setAuthor('')
      setUrl('')
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>title
          <input className="title-input" aria-label="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          ></input>
        </label>
      </div>
      <div>
        <label>author
          <input className="author-input" aria-label="Author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          ></input>
        </label>
      </div>
      <div>
        <label>url
          <input className="url-input" aria-label="URL"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          ></input>
        </label>
      </div>
      <button>create</button>
    </form>
  )
}

export default BlogAdder
