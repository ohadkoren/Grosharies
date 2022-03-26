const mongoose = require('../db');

const tag = new mongoose.Schema({
  name: { type: String, required: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }]
});

const Tag = mongoose.model('Tag', tag);

module.exports = Tag;