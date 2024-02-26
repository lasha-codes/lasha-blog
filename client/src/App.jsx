import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout.jsx'
import Home from './pages/Home.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import CreatePost from './pages/CreatePost.jsx'
import SinglePost from './pages/SinglePost.jsx'
import UrPosts from './pages/UrPosts.jsx'
import UpdatePost from './pages/UpdatePost.jsx'

const App = () => {
  return (
    <main className='main-page'>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/post/:id' element={<SinglePost />} />
          <Route path='/user-posts' element={<UrPosts />} />
          <Route path='/update-post/:id' element={<UpdatePost />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App
