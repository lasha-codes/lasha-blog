import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import { Toaster } from 'react-hot-toast'

const Layout = () => {
  return (
    <div>
      <Header />
      <div className='outlet-holder'>
        <Outlet />
      </div>
      <Toaster position='bottom-right' />
    </div>
  )
}

export default Layout
