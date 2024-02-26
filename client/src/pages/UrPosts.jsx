import { useEffect, useState } from 'react'
import noImage from '../assets/noProfile.png'
import toast from 'react-hot-toast'
import { formatISO9075 } from 'date-fns'
import { useNavigate } from 'react-router'
import { FaRegEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { Link } from 'react-router-dom'

const UrPosts = () => {
  const [posts, setPosts] = useState([])
  const navigate = useNavigate(false)

  const fetchPosts = async () => {
    const response = await fetch('http://localhost:4000/user-posts', {
      credentials: 'include',
    })
    const data = await response.json()
    if (response.ok) {
      setPosts(data.userPosts)
    } else {
      toast.error(data.errMessage)
    }
  }

  const handlePostDelete = async (deleteId) => {
    const response = await fetch('http://localhost:4000/delete-post', {
      method: 'DELETE',
      body: JSON.stringify({
        deleteId: deleteId,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (response.ok) {
      toast.success('U have successfully deleted the post')
      navigate(0)
    } else {
      toast.error('Internal server error')
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])
  return (
    <div className='cards-container'>
      {posts.map((post) => {
        return (
          <div key={post._id} className='card ur-card'>
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
              <div className='post-options'>
                <MdDelete
                  className='delete-post-btn'
                  onClick={() => handlePostDelete(post._id)}
                />
                <Link to={`/update-post/${post._id}`}>
                  <FaRegEdit className='edit-post-btn' />
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default UrPosts
