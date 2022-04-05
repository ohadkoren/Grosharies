const mongoose = require('../db');
const status = require('../enums/postStatus');
const Grocery = require('../grocery/grocery.model');
const reply = require('../enums/postReply');

const post = new mongoose.Schema({
  headline: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  address: { type: String, required: true },
  publishingDate: { type: Date, default: Date.now },
  pickUpDates: [{
    from: Date,
    until: Date
}],
  status: { type: String, enum: status, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }], //TAG IS ALSO A MODEL, FUNCTIONS SIMILAR TO A CATEGORY
  content: [{ type: Grocery.schema, required: true , default: []}],
  description: String,
  images: [{ type: String, default: [] }],
  videos: [{ type: String, default: [] }],
  observers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], //USER ARRAY
  repliers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reply: { type: String, enum: reply, required: false }
}]
});

const Post = mongoose.model('Post', post, 'Post');

module.exports = Post;