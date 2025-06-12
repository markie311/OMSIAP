
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleinteractionsuserscheme = new Schema({
  name: { type: String },
  phonenumber: { type: String },
  date: { type: String }
});

const articleinteractionsscheme = new Schema({
  like: [articleinteractionsuserscheme],
  unlike: [articleinteractionsuserscheme],
  exited: [articleinteractionsuserscheme],
  wow: [articleinteractionsuserscheme],
  sad: [articleinteractionsuserscheme]
});

const articlecommentreplyscheme = new Schema({
  name: { type: String },
  phonenumber: { type: String },
  date: { type: String },
  reply: { type: String }
});

const articlecommentauthorscheme = new Schema({
  name: { type: String }
});

const articlecommentscheme = new Schema({
  author: articlecommentauthorscheme,
  date: { type: String },
  comment: { type: String },
  replies: [articlecommentreplyscheme],
  interactions: articleinteractionsscheme
});

const articlecontentscheme = new Schema({
  id: { type: Number },
  image: { type: String },
  images: [{ type: String }],
  data: { type: String },
  topic: { type: String },
  date: { type: String },
  title: { type: String },
  readTime: { type: String },
  content: { type: String },
  description: { type: String },
  keytakeaways: [{ type: String }],
  expertopinion: { type: String },
  interactions: articleinteractionsscheme,
  comments: [articlecommentscheme]
});

const ArticleContentModel = mongoose.model("ArticleContent", articlecontentscheme);

module.exports = ArticleContentModel;
