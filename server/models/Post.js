const mongoose = require('mongoose')

const Post = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String, required: true },
    avatar: String,
    summary: { type: String, required: true },
    photo: { type: String, require: true },
    types: { type: Array },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const PostModel = mongoose.model('Post', Post)

module.exports = PostModel
