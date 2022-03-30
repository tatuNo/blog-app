import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }
    createBlog(blogObject)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:<input
            className="title"
            id="title"
            type="text"
            name="Title"
            data-testid="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}/>
        </div>
        <div>
          author:<input
            className="author"
            id="author"
            type="text"
            name="Author"
            data-testid="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}/>
        </div>
        <div>
          url:<input
            className="url"
            id="url"
            type="text"
            name="Url"
            data-testid="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}/>
        </div>
        <button id="createblog" type="submit" data-testid="createblog">create</button>
      </form>
    </div>
  )
}

export default BlogForm