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
        const bookPackages = database.collection('bookPackages');
        const users = database.collection('Users');

        // get packages api 
        app.get('/packages', async (req, res) => {
            // console.log("pakages hittet");
            const cursor = packages.find({});
            const result = await cursor.toArray();
            res.json(result)
        })
        // get selected package api 
        app.get('/selectedPack/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const result = await packages.findOne(query);

            res.json(result)
        })
        // get all booking api 
        app.get('/allBooking', async (req, res) => {
            const cursor = bookPackages.find({});
            const result = await cursor.toArray();
            res.json(result)

        })
        // get  only my booking api 
        app.get('/myBookings', async (req, res) => {
            const search = req.query.search;
            const cursor = bookPackages.find({ email: search });
            const events = await cursor.toArray();

            res.json(events);
        })

        // get all user api 
        app.get('/allUsers', async (req, res) => {
            const cursor = users.find({});
            const result = await cursor.toArray();
            res.json(result)

        })
        // post packages registration api
        app.post('/packageRegister', async (req, res) => {
            const newBooking = req.body;
            const result = await bookPackages.insertOne(newBooking);
            res.json(result);


        })
        // new user add 
        app.post('/AddUser', async (req, res) => {
            const newUser = req.body;
            let emailADD;
            const cursor = users.find({});
            const result = await cursor.toArray();
            const existEmail = result.find(res => res.email == newUser.email)
            if (!existEmail) {
                emailADD = await users.insertOne(newUser);
            }
            res.json(emailADD);
        })
        // new user add 
        app.post('/registerUser', async (req, res) => {
            const newUser = req.body;
            // console.log(newUser)

            const result = await users.insertOne(newUser);
            res.json(result);




        })
        // post package  api  
        app.post('/packageADD', async (req, res) => {
            const newPackage = req.body;
            const result = await packages.insertOne(newPackage);
            res.json(result);

        })
        // put update booking api 
        app.put('/bookingStatusUpdate/:id', async (req, res) => {
            const id = req.params.id;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: "Approve"
                }
            }
            const result = await bookPackages.updateOne(filter, updateDoc, options)

            res.json(result)
        })
        // delete booking package api 
        app.delete('/bookingDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookPackages.deleteOne(query);

            res.json(result)

        })
        // delete admin 
        app.delete('/deleteUser/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await users.deleteOne(query);

            res.json(result)

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
