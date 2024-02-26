const express = require('express')
const cors = require('cors')
const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv').config()
const router = express.Router()
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const Post = require('../models/Post.js')

router.use(
  cors({
    credentials: true,
    origin: 'https://deploy-mern-frontend-rust.vercel.app',
  })
)
router.use(express.json({ limit: '10mb' }))
router.use(cookieParser())
router.use('../uploads', express.static('../uploads'))

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body

  const bcryptSalt = 10

  const hashedPassword = bcrypt.hashSync(password, bcryptSalt)

  const userDupCheck = await User.findOne({ username })
  if (userDupCheck) {
    return res.status(400).json({
      errorMsg: 'this user already exists',
    })
  }
  const emailDupCheck = await User.findOne({ email })
  if (emailDupCheck) {
    return res.status(400).json({
      errorMsg: 'this user already exists',
    })
  }

  const client = await User.create({
    username: username,
    email: email,
    password: hashedPassword,
  })

  res.status(200).json({ client })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    return res
      .status(401)
      .json({ errorMsg: 'user with this email does not exist' })
  }

  const match = await bcrypt.compare(password, user.password)
  if (match) {
    jwt.sign({ email, password }, process.env.JWT_SECRET, {}, (err, token) => {
      if (err) throw err
      res.cookie('token', token).json({ user })
    })
  } else {
    return res.status(401).json({ errorMsg: 'password u entered in incorrect' })
  }
})

router.get('/profile', (req, res) => {
  const { token } = req.cookies
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' })
  }
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    const { email } = info
    const user = await User.findOne({ email })
    if (!user) {
      res.status(500).json({ message: 'Internal server error' })
    }
    res.json({
      password: user.password,
      id: user._id,
      email: user.email,
      username: user.username,
    })
  })
})

router.post('/logout', (req, res) => {
  res.cookie('token', '').json({
    message: 'User has logged out',
  })
})

router.post('/photo', async (req, res) => {
  const { token } = req.cookies
  const { base64 } = req.body
  try {
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err
      const { email } = info
      const loggedInUser = await User.findOne({ email })
      loggedInUser.avatar = base64
      await loggedInUser.save()
      if (!loggedInUser) {
        return res.status(500).json({ message: 'Internal server error' })
      } else {
        res.status(200).json({ message: 'we have verified the user' })
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.get('/photo', async (req, res) => {
  const { token } = req.cookies
  try {
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err
      const { email } = info
      const loggedInUser = await User.findOne({ email })
      if (!loggedInUser) {
        return res.status(500).json({ message: 'Internal server error' })
      }

      return res.status(200).json({
        photo: loggedInUser.avatar,
        message: 'we have verified the token',
      })
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Something went wrong' })
  }
})

router.post('/create-post', async (req, res) => {
  const { token } = req.cookies
  const { base64, summary, title, types, description } = req.body
  try {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized request' })
      }
      const { email } = info
      const getId = await User.findOne({ email })
      const postDoc = await Post.create({
        postId: getId._id,
        username: getId.username,
        avatar: getId.avatar,
        photo: base64,
        summary: summary,
        title: title,
        types: types,
        description: description,
      })
      if (postDoc) {
        res.status(200).json(postDoc)
      } else {
        return res
          .status(400)
          .json({ message: 'Some of the fields are required' })
      }
    })
  } catch (err) {
    console.log(err)
  }
})

router.get('/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 })
  if (posts) {
    return res
      .status(200)
      .json({ posts: posts, message: 'Welcome to the Blog Page' })
  }
  return res.status(404).json({ errMessage: 'No posts found' })
})

router.get('/user-posts', (req, res) => {
  const { token } = req.cookies
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) {
      return res.status(500).json({ errMessage: 'Internal server error' })
    }
    const { email } = info
    const userDoc = await User.findOne({ email })
    const postId = userDoc._id
    const postsDoc = await Post.find({ postId })
    res.status(200).json({ userPosts: postsDoc })
  })
})

router.delete('/delete-post', async (req, res) => {
  const { deleteId } = req.body
  try {
    await Post.findByIdAndDelete(deleteId)
    return res
      .status(200)
      .json({ message: 'U have successfully deleted the post' })
  } catch (error) {
    console.error(error)
  }
})

router.put('/update-post/:id', async (req, res) => {
  const { updateId, summary, title, types, description, base64 } = req.body
  try {
    const updatedPost = await Post.findByIdAndUpdate(updateId, {
      photo: base64,
      summary: summary,
      title: title,
      types: types,
      description: description,
    })
    if (updatedPost) {
      return res.status(200).json(updatedPost)
    }
  } catch (error) {
    console.error(error)
  }
})

router.post('/update-post/:id', async (req, res) => {
  const { updateId } = req.body
  try {
    const postDoc = await Post.findById(updateId)
    if (postDoc) {
      res.status(200).json(postDoc)
    }
  } catch (error) {
    res.json({ message: error.message })
  }
})

module.exports = router
