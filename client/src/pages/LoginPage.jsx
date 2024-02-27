import { MdAttachEmail } from 'react-icons/md'
import { FaKey } from 'react-icons/fa'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { urlContext } from '../components/UrlContext.jsx'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)
  const navigate = useNavigate()
  const { url } = useContext(urlContext)

  const handleLogin = async (e) => {
    e.preventDefault()
    const response = await fetch(`${url}/login`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    const { errorMsg } = await response.json()
    if (!response.ok) {
      toast.error(errorMsg)
    } else {
      toast.success(`Welcome to the Blog Page!`)
      setRedirect(true)
    }
  }

  if (redirect) {
    navigate(0)
  }

  return (
    <form className='register login' onSubmit={handleLogin}>
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
