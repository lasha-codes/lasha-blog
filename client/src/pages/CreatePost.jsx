import { useState } from 'react'
import toast from 'react-hot-toast'
import { useContext } from 'react'
import { urlContext } from '../components/UrlContext.jsx'

const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [summary, setSummary] = useState('')
  const [file, setFile] = useState('')
  const [inpTypes, setInpTypes] = useState([])
  const { url } = useContext(urlContext)

  const typesArr = [
    'UI/UX',
    'EDUCATION',
    'INFORMATIONAL',
    'POLITICS',
    'GLOBAL',
    'NATURE',
    'SPORTS',
  ]

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

  const handleTypeJoin = (type) => {
    if (!inpTypes.includes(type)) {
      setInpTypes((prev) => [...prev, type])
    }
  }

  const handleTypeDelete = (deleteIdx) => {
    const newInpTypes = inpTypes.filter((types, idx) => {
      return deleteIdx !== idx
    })

    setInpTypes(newInpTypes)
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    const base64 = await convertToBase64(file)
    const response = await fetch(`${url}/create-post`, {
      method: 'POST',
      body: JSON.stringify({
        base64: base64,
        summary: summary,
        title: title,
        types: inpTypes,
        description: description,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    if (response.ok) {
      toast.success('U have successfully uploaded a post')
    } else {
      toast.error('Make sure to fill out required fields')
    }

    setDescription('')
    setInpTypes([])
    setFile('')
    setSummary('')
    setTitle('')

    const data = await response.json()
    console.log(data)
  }

  return (
    <form className='create-post' onSubmit={handleCreatePost}>
      <h1>Create Post</h1>
      <input
        type='text'
        placeholder='Post Title...'
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type='text'
        placeholder='Post description...'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <textarea
        type='text'
        placeholder='Post summary'
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <div className='types-div'>
        <span className='select-span'>select the type:</span>
        <div className='types-parent'>
          {typesArr.map((type, idx) => {
            return (
              <span
                key={idx}
                className='types-span'
                onClick={() => handleTypeJoin(type)}
              >
                {type}
              </span>
            )
          })}
        </div>
      </div>
      <h1 className='types-subhead'>select types :</h1>
      <div className='send-types'>
        {inpTypes.map((type, idx) => {
          return (
            <span key={idx} className='types-span animate-types-span'>
              <span
                className='remove-type'
                onClick={() => handleTypeDelete(idx)}
              >
                x
              </span>
              {type}
            </span>
          )
        })}
      </div>
      <p className='file'>select the image</p>
      <input type='file' onChange={(e) => setFile(e.target.files[0])} />
      <button className='submit-btn'>submit</button>
    </form>
  )
}

export default CreatePost
