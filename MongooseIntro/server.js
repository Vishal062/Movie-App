const express = require("express");
const mongoose = require("mongoose");   //Imported mongoose


const app = express();  //Express run
app.use(express.json());    //Its worked as a middleware

const connect = () => {
    return mongoose.connect("mongodb://127.0.0.1:27017/web11");
}   //This line will connect database to express>>>
//Mongoose act like a translator

//schema created
const product = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size:{type:Number, required:false}
})

//step -2
const Product = mongoose.model("product", product);//(collection,schema)
//This code sets the connection between collection to the schema >>

//step -3
app.post("/products",async (req, res) => {
    const product = await Product.create(req.body)  //this line works as a mongo db query>>
    return res.status(201).send({product});
});

//step -4 get data
app.get("/products", async (req, res) => {
    const product = await Product.find().lean().exec();    //Db query
    return res.status(200).send({ product });
});
//exec() complete the execution>>
//lean()

//step-5
//patch

app.patch("/products/:id", async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.status(200).send({ product });
})

//6 delete a single user

app.delete("/products/:id", async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    return res.status(200).send({ product });
})
app.listen(2345, async function () {
    await connect();
    console.log("Listening on port 2345");
});