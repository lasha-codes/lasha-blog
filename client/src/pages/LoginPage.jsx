import { MdAttachEmail } from 'react-icons/md'
import { FaKey } from 'react-icons/fa'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const response = await fetch('https://lasha-blog.vercel.app//login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    if (!response.ok) {
      console.log('error')
    } else {
      setRedirect(true)
    }
  }

  if (redirect) {
    navigate(0)
  }

  return (
    <form className='register' onSubmit={handleLogin}>
      <h1>Login</h1>
      <div className='div-label'>
        <label htmlFor='email'>
          <MdAttachEmail />
        </label>
        <input
          type='email'
          id='email'
          placeholder='enter email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='div-label'>
        <label htmlFor='password'>
          <FaKey />
        </label>
        <input
          type='password'
          id='password'
          placeholder='enter password'
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className='submit-btn'>Login</button>
    </form>
  )
}

export default LoginPage
