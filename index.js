const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
// middleware 
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sbsxy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        // console.log("database conneted")

        const database = client.db('VictoryTravel');
        const packages = database.collection('Packages');
        const users = database.collection('Users');

        // get packages api 
        app.get('/packages', async (req, res) => {
            // console.log("pakages hittet");
            const cursor = packages.find({});
            const result = await cursor.toArray();
            res.json(result)
        })
        // post package  api  
        app.post('/packageADD', async (req, res) => {
            const newPackage = req.body;
            const result = await packages.insertOne(newPackage);
            res.json(result);

        })

    }


    finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', async (req, res) => {
    res.send("Victory Travel server running");
})
app.listen(port, () => {
    console.log("Victory Travel server port :", port)
})
