import { MdAttachEmail } from 'react-icons/md'
import { FaRegUser } from 'react-icons/fa'
import { FaKey } from 'react-icons/fa'
import { useState } from 'react'
import { Navigate } from 'react-router'
import toast from 'react-hot-toast'
import { useContext } from 'react'
import { urlContext } from '../components/UrlContext.jsx'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState('')
  const { url } = useContext(urlContext)

  const handleRegister = async (e) => {
    e.preventDefault()
    const response = await fetch(`${url}/register`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        username,
        password,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) {
      toast.error('This user already exists')
    } else {
      setRedirect(true)
    }
  }

  if (redirect) {
    return <Navigate to={'/login'} />
  }

  return (
    <form className='register' onSubmit={handleRegister}>
      <h1>Register</h1>
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
        <label htmlFor='username'>
          <FaRegUser />
        </label>
        <input
          type='text'
          id='username'
          placeholder='create username'
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className='div-label'>
        <label htmlFor='password'>
          <FaKey />
        </label>
        <input
          type='password'
          id='password'
          placeholder='create password'
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className='submit-btn'>Register</button>
    </form>
  )
}

export default RegisterPage
