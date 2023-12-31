const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())

// console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6rkaped.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // client.connect();
        // Send a ping to confirm a successful connection

        const toyCollection = client.db("toyTruck").collection("toys")

        // app.get("/alltoys", async (req, res) => {
        //     const cursor = toyCollection.find();
        //     const result = await cursor.toArray()
        //     res.send(result);
        // })

        app.get("/alltoys/:id", async(req, res)=> {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await toyCollection.findOne(query);
            res.send(result);
        })

        app.get("/alltoyss", async(req, res)=> {
            let query = {};
            if(req.query?.email){
                query = { sellerEmail: req.query?.email}
            }
            const result = await toyCollection.find(query).toArray()
            res.send(result);

        })

        app.post("/addatoy", async(req, res)=>{
            const body = req.body;
            const result = await toyCollection.insertOne(body)
            console.log(result);
            res.send(result)
        })

        app.delete('/alltoyss/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await toyCollection.deleteOne(query);
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Toy server is running");
})

app.listen(port, (req, res) => {
    console.log(`Toy server is running on port: ${port}`);
})