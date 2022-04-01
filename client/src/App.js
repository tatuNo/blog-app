import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogFrom'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const setError = (error) => {
    setNotification({
      color: 'red',
      text: error.response.data.error
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification(
        {
          text:`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
          color: 'green'
        })
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    } catch (error) {
      setError(error)
    }
  }

  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleLogin = async userObject => {

    try {
      const user = await loginService.login(userObject)
      window.localStorage.setItem (
        'loggedUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)

    } catch (error) {
      setError(error)
    }
  }


  const likeBlog = async (event,blog) => {
    event.preventDefault()
    blog.likes += 1
    try {
      const response = await blogService.update(blog)
      setBlogs(blogs.map(blog => blog.id === response.id ? response : blog))
    } catch (error) {
      setError(error)
    }
  }

  const deleteBlog = async (event, blog) => {
    event.preventDefault()
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author} ?`)) {
      try {
        const response = await blogService.remove(blog)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        // eslint-disable-next-line no-console
        console.log(response)
        setNotification(
          {
            text:`a blog ${blog.title} by ${blog.author} removed`,
            color: 'green'
          })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      } catch (error) {
        setError(error)
      }
    }
  }

  const loginForm = () => (
    <LoginForm handleLogin={handleLogin}/>
  )

  const blogForm = () => (
    <Togglable buttonLabel="new post" ref={blogFormRef}>
      <BlogForm createBlog={addBlog}/>
    </Togglable>
  )

  const sortBlogs = blogs => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification}/>
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          {blogForm()}
          <div id="blogdiv">
            { sortBlogs(blogs).map(blog =>
              <Blog key={blog.id} blog={blog} deleteBlog={deleteBlog} likeBlog={likeBlog}/>
            )}
          </div>
        </div>}
    </div>
  )
}

export default App