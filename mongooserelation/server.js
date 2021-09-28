const express = require("express");
const mongoose = require("mongoose"); //Imported mongoose

const app = express(); //Express run
app.use(express.json()); //Its worked as a middleware

const connect = () => {
  return mongoose.connect("mongodb+srv://vishal:internshala_4@cluster0.rgzha.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
}; //This line will connect database to express>>>
//Mongoose act like a translator

//schema created
const userSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  gender: {type:String,required:true}
});

//step -2
const User = new mongoose.model("user", userSchema); //(collection,schema)
//This code sets the connection between collection to the schema >>


//create a schema for a post

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: {         //This is key can be anything
      type: mongoose.Schema.Types.ObjectId, //Inside a post get a parent ref>>>
      ref: "user",  //Which collection it is refering to
      required: true,
    },
    tags: [{    //Tag is also refering here>>>
      type: mongoose.Schema.Types.ObjectId, ///I am creating a post and also updating a tag
      ref: "tag",
      required: true,
    }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
//step -2 connect the Schema to the post collection>>
const Post = mongoose.model("post", postSchema);


//step 3.1 create a schema for comment section>>

const commentSchema = new mongoose.Schema({
    body: { type: String, required: true },
    postAuthor: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true }
},
    {
        versionKey: false,
        timestamps: true
    });

const Comment = mongoose.model("comments", commentSchema);

//4.1 Create a tagSchema
const tagSchema = new mongoose.Schema({
    name: { type: String, required: true }},
    {
        versionKey: false,
        timestamps: true
    });

const Tag = mongoose.model("tag", tagSchema);

///////////////////////////////////////////////////////////////////////


//step -3 crup api for all
app.post("/users", async (req, res) => {
  const users = await User.create(req.body); //this line works as a mongo db query>>
  return res.status(201).send({ users });
});

//step -4 get data
app.get("/getusers", async (req, res) => {
  const getuser = await User.find().lean().exec(); //Db query
  return res.status(200).send({ getuser });
});
//exec() complete the execution>>
//lean()

//get a single user>>>>
app.get("/getusers/:id", async (req, res) => {
  const getuser = await User.findById(req.params.id).lean().exec(); //Db query
  return res.status(200).send({ getuser });
});
//step-5 patch using Update
app.patch("/users/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).lean().exec();
  return res.status(200).send({ user });
});

//6 delete a single user

app.delete("/users/:id", async (req, res) => {
  const deluser = await User.findByIdAndDelete(req.params.id).lean().exec();
  return res.status(200).send({ deluser });
});

//get all post of a user>>>>
app.get("/users/:id/posts", async (req, res) => {
  const post = await Post.find({ author: req.params.id }).lean().exec();
  const author = await User.findById(req.params.id).lean().exec();
  return res.status(200).send({ post, author });
});

//Now write crud apis for POST
//Create a post>>>
app.post("/posts", async (req, res) => {
  const post = await Post.create(req.body);
  return res.status(200).send({post})
});
//get all the post
app.get("/posts", async (req, res) => {
  const posts = await Post.find().populate("author").populate("tags").lean().exec();
  return res.status(200).send({ posts });
});

//In the populate section if you use mongoose object id name then it will give you full
//Object details>>>
//if we use populate({path:"author",select:"first_name"});
//this give you only firstname details>>>

//get a single post>>>
app.get("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).lean().exec();
  return res.status(200).send({ post });
});

//Update a single post>>>>>

app.patch("/posts/:id", async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean().exec();
  return res.status(200).send({ post });
});

//delete a single post>>>>

app.delete("/posts/:id", async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id).lean().exec();
  return res.status(200).send({ post });
});

//Crud apis for comments/////////////
//create a single comment>>>>
app.post("/comments", async (req, res) => {
  const comment = await Comment.create(req.body);
  return res.status(200).send({ comment });
});

//get all comments>>>
app.get("/comments", async (req, res) => {
  const getcomments = await Comment.find(req.body);
  return res.status(200).send({ getcomments });
});

//get a single comment>>
app.get("/comments/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id).lean().exec();
  return res.status(200).send({ comment });
});

//Update a single comment>>>
app.patch("/comments/:id", async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean().exec();
  return res.status(200).send({ comment });
});

//delete a Single comment>>>
app.delete("/comments/:id", async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.id).lean().exec();
  return res.status(200).send({ comment });
});
//Get all comments for a post>>>>
app.get("/posts/:id/comments", async (req, res) => {
  const comment = await Comment.find({ post: req.params.id }).lean().exec();
  const post = await Post.findById(req.params.id).lean().exec();
  return res.status(200).send({ post, comment });
});



///Crud apii for tags
//Post a tag>>>>
app.post("/tags", async (req, res) => {
  const tag = await Tag.create(req.body);
  return res.status(201).send({ tag });
});

//get all tags>>>
app.get("/tags", async (req, res) => {
  const gettags = await Tag.find(req.body);
  return res.status(200).send({ gettags });
});

//get a single tag>>
app.get("/tags/:id", async (req, res) => {
  const stag = await Tag.findById(req.params.id).lean().exec();
  return res.status(200).send({ stag });
});

//Update a single Tag>>>
app.patch("/tags/:id", async (req, res) => {
  const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .lean()
    .exec();
  return res.status(200).send({ tag });
});

//delete a Single Tag>>>
app.delete("/tags/:id", async (req, res) => {
  const tag = await Tag.findByIdAndDelete(req.params.id).lean().exec();
  return res.status(200).send({ tag });
});

//Now the crush of relation is if you use populate
//and the author id then this thing give you whole details>>

//Connection work >>
app.listen(2567, async function () {
  await connect();
  console.log("Listening on port 2567");
});
