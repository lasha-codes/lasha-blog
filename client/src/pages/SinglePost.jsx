import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { formatISO9075 } from 'date-fns'
import noImage from '../assets/noProfile.png'
import { useContext } from 'react'
import { urlContext } from '../components/UrlContext.jsx'

const SinglePost = () => {
  const [post, setPost] = useState([])
  const { url } = useContext(urlContext)
  const { id } = useParams()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const response = await fetch(`${url}/posts`)
    const data = await response.json()
    if (response.ok) {
      setPost(
        data.posts.filter((post, idx) => {
          return post._id === id
        })
      )
    } else {
      toast.error(data.errMessage)
    }
  }

  return (
    <div className='cards-container single-cards'>
      {post.map((post) => {
        return (
          <div key={post._id} className='single-card'>
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
                <span>Created At: </span>
                {formatISO9075(new Date(post.createdAt))}
              </p>
              <p className='post-summary'>
                <span>Summary:</span>
                {post.summary}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SinglePost
