//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require('dotenv').config();

const homeStartingContent = "Welcome to my Blog website! <br><br>You can add a new post by adding '/compose' to the end of the URL!";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const mongoPW = process.env.MONGO_PASS;

// Connect to the mongoDB database
mongoose.connect("mongodb+srv://blog-jonne:" + mongoPW + "@cluster0-wsmev.mongodb.net/blogDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

// Create a schema for the blog posts
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

// Create a model for the post
const Post = mongoose.model("Post", postSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", (req, res) => {

  Post.find({}, (err, foundPosts) => {
    if (!err) {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: foundPosts
      });
    }
  });
});


app.get("/about", (req, res) => {
  res.render("about", {
    aboutContent: aboutContent
  });
});


app.get("/contact", (req, res) => {
  res.render("contact", {
    contactContent: contactContent
  });
});


app.get("/compose", (req, res) => {
  res.render("compose");
});


app.post("/compose", (req, res) => {

  // Create a new post and save it to the Posts collection
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postText
  });
  post.save((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
});


app.get("/posts/:postId", (req, res) => {

  let postId = req.params.postId;

  Post.findById(postId, (err, foundPost) => {
    if (!err) {
      res.render("post", {postTitle: foundPost.title, postContent: foundPost.content});
    }
  })
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started succesfully.");
});
