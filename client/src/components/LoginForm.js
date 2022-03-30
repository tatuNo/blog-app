import React,{ useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = event => {
    event.preventDefault()
    const userobject = {
      username: username,
      password: password
    }
    handleLogin(userobject)
    setUsername('')
    setPassword('')
  }

  return (
    <>
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={login}>
          <div>
      username <input
              type="text"
              name="Username"
              id="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
      password <input
              type="password"
              name="Password"
              id="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button id="login-button" type="submit">Login</button>
        </form>
      </div>
    </>
  )
}

export default LoginForm