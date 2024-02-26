import { useEffect, useState } from 'react'
import noImage from '../assets/noProfile.png'
import toast from 'react-hot-toast'
import { formatISO9075 } from 'date-fns'
import { FaEye } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { IoSearch } from 'react-icons/io5'
import Loading from '../components/Loading'
import { useContext } from 'react'
import { urlContext } from '../components/UrlContext.jsx'

const Home = () => {
  const [posts, setPosts] = useState()
  const [search, setSearch] = useState('')
  const [searchToggle, setSearchToggle] = useState(false)
  const [originalPosts, setOriginalPosts] = useState([])
  const { url } = useContext(urlContext)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const response = await fetch(`${url}/posts`)
    const data = await response.json()
    if (response.ok) {
      setPosts(data.posts)
      setOriginalPosts(data.posts)
    } else {
      toast.error(data.errMessage)
    }
  }

  const handleSearch = () => {
    const newPosts = originalPosts.filter((post) => {
      return (
        post.description.toLowerCase().includes(search.toLowerCase().trim()) ||
        post.title.toLowerCase().includes(search.toLowerCase().trim())
      )
    })
    if (!newPosts) {
      setPosts(originalPosts)
    }
    setPosts(newPosts)
  }

  return posts ? (
    <>
      <div className='search-container'>
        <label htmlFor='search' onClick={() => setSearchToggle(!searchToggle)}>
          <IoSearch />
        </label>
        <input
          type='text'
          id='search'
          value={search}
          style={{
            width: searchToggle ? '100%' : '0',
            visibility: searchToggle ? 'visible' : 'hidden',
            opacity: searchToggle ? 1 : 0,
          }}
          onChange={(e) => {
            setSearch(e.target.value)
            handleSearch()
          }}
        />
      </div>
      <div className='cards-container'>
        {posts.map((post) => {
          return (
            <div key={post._id} className='card'>
              <div className='image'>
                <img src={post.photo} />
              </div>
              <div className='types'>
                {post?.types.map((type, idx) => {
                  return (
                    <span key={idx} className='post-types-span'>
                      {type}
                    </span>
                  )
                })}
              </div>
              <div className='texts'>
                <h2>{post.title}</h2>
                <div className='by-div'>
                  <div className='by-text'>
                    <p>By @{post.username} </p>
                    <div className='image-container'>
                      <img
                        src={post.avatar || noImage}
                        className='by-post'
                        alt='by this user photo'
                      />
                    </div>
                  </div>
                </div>
                <p className='post-description'>
                  <span>description :</span> {post.description}
                </p>
                <p className='created-at'>
                  <span>
                    {new Date(post.updatedAt) > new Date(post.createdAt)
                      ? 'Updated At: '
                      : 'Created At: '}
                  </span>
                  <span>
                    {new Date(post.updatedAt) > new Date(post.createdAt)
                      ? formatISO9075(new Date(post.updatedAt))
                      : formatISO9075(new Date(post.createdAt))}
                  </span>
                </p>
                <Link to={`post/${post._id}`}>
                  <FaEye className='edit-icon' />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </>
  ) : (
    <Loading />
  )
}

export default Home
