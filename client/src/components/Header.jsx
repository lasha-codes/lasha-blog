/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import noImage from '../assets/noProfile.png'
import toast from 'react-hot-toast'

const Header = () => {
  const [user, setUser] = useState(null)
  const [toggle, setToggle] = useState(false)
  const [file, setFile] = useState('')
  const [image, setImage] = useState('')
  const [menuToggle, setMenuToggle] = useState(false)
  const location = useLocation().pathname.toString()

  const navigate = useNavigate()

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  useEffect(() => {
    fetchUserProfile()
    fetchUserPhoto()
  }, [])

  const fetchUserProfile = () => {
    fetch('http://localhost:4000/profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((userInfo) => {
        setUser(userInfo)
      })
      .catch((error) => console.error('Error fetching profile', error))
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    const base64 = await convertToBase64(file)
    setFile(base64)
  }

  const handleLogout = async () => {
    const response = await fetch('http://localhost:4000/logout', {
      method: 'POST',
      credentials: 'include',
    })
    if (!response.ok) {
      console.error('server error')
    }
    setUser(null)
  }

  if (user?.email) {
    if (location === '/login') {
      return <Navigate to={'/'} />
    }
  }

  const username = user?.email

  const handlePhoto = async () => {
    try {
      const response = await fetch('http://localhost:4000/photo', {
        method: 'POST',
        body: JSON.stringify({
          base64: file,
        }),
        credentials: 'include',
        headers: { 'Content-type': 'application/json' },
      })
      if (!response.ok) {
        toast.error('Internal server error')
        navigate(0)
      } else {
        toast.success('File uploaded successfully')
        navigate(0)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchUserPhoto = async () => {
    const response = await fetch('http://localhost:4000/photo', {
      credentials: 'include',
    })
    const data = await response.json()
    if (response.ok) {
      setImage(data.photo)
    }
  }

  return (
    <header>
      <Link to='/'>
        <h1>Blog Page</h1>
      </Link>
      {!username ? (
        <nav>
          <Link to='login'>Login</Link>
          <Link to='register'>Register</Link>
        </nav>
      ) : (
        <nav>
          <div className='user-profile'>
            <div className='user-photo'>
              <img
                src={image || noImage}
                alt='ProfilePic'
                onClick={() => setToggle(!toggle)}
              />
            </div>
            <div className='online-status'></div>

            <div
              className='dropdown'
              style={{
                height: toggle ? '150px' : '0px',
                visibility: toggle ? 'visible' : 'hidden',
              }}
            >
              <p>username: {user.username}</p>
              <div className='status'>
                status: online
                <div className='online'></div>
              </div>
              <p>email: {user.email}</p>
              <input type='file' onChange={(e) => handleFileUpload(e)} />
              {!file ? '' : <button onClick={handlePhoto}>change photo</button>}
            </div>
          </div>
          <div className='links-div'>
            <Link to='user-posts'>View Ur Posts</Link>
            <Link
              className={`create-post-link ${
                menuToggle ? 'display-links' : 'display-none'
              }`}
              to='/create-post'
            >
              Create Post
            </Link>
            <span
              className={`logout-span ${
                menuToggle ? 'display-links' : 'display-none'
              }`}
              onClick={handleLogout}
            >
              Logout
            </span>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Header
