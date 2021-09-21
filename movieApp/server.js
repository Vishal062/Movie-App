const express = require("express");
const mongoose = require("mongoose");   //Imported mongoose


const app = express();  //Express run
app.use(express.json());    //Its worked as a middleware

const connect = () => {
    return mongoose.connect("mongodb://127.0.0.1:27017/entertainment");
}   //This line will connect database to express>>>
//Mongoose act like a translator

//schema created
const movie = new mongoose.Schema({
    id: {type:Number,required: true },
    movie_name: { type: String, required: true },
    production_year: { type: Number, required: true },
    budget: { type: Number, required: true },
    movie_genre: {type:String, required:false}
})

//step -2
const Movie = mongoose.model("movie", movie);//(collection,schema)
//This code sets the connection between collection to the schema >>

//step -3
app.post("/movies",async (req, res) => {
    const movie = await Movie.create(req.body)  //this line works as a mongo db query>>
    return res.status(201).send({movie});
});

//step -4 get data
app.get("/movies", async (req, res) => {
    const movie = await Movie.find().lean().exec();    //Db query
    return res.status(200).send({ movie });
});
//exec() complete the execution>>
//lean()

//step-5 patch and Update the data>>>>

app.patch("/movies/:id", async (req, res) => {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.status(200).send({ movie });
})

//6 delete a single user

app.delete("/movies/:id", async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    return res.status(200).send({ movie });
});

//For port checking and make a connection>>>
app.listen(3456, async function () {
    await connect();
    console.log("Listening on port 3456");
});