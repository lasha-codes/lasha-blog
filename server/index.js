const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const routes = require('./routes/route.js')

app.use('/', routes)

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(4000, () => {
      console.log('server is listening on port 4000')
    })
  })
  .catch((error) => {
    console.log(error)
  })
