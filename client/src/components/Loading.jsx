import circle from '../assets/circle.png'

const Loading = () => {
  return (
    <div className='main-loading'>
      <img className='spinning-circle' src={circle}></img>
    </div>
  )
}

export default Loading
