import React, { useState } from 'react'

const Blog = ({ blog, deleteBlog, likeBlog }) => {
  const [clicked, setClicked] = useState(false)
  const button = clicked ? 'hide' : 'view'
  const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser'))


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showAll = () => (
    <>
      <p>{blog.url}</p>
      <p>likes {blog.likes}<button onClick={(event) => likeBlog(event,blog)}>like</button></p>
      <p>{blog.user[0].name}</p>
      { loggedUser.username === blog.user[0].username ? <button onClick={(event) => deleteBlog(event, blog)}>remove</button> :
        null }
    </>
  )

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setClicked(!clicked)}>{button}</button>
      {clicked ?
        showAll() :
        <>
        </>}
    </div>
  )}

export default Blog
