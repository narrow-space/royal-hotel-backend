const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()




const port = process.env.PORT || 7000
//middele ware
app.use(cors())
app.use(express.json())

/// username:
///password:

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6uzmb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run() {
    try {
        await client.connect();
        const database = client.db("luxeryhotel");
        const servicesCollection = database.collection("services");
        const bookingCollection = database.collection("booking");

        // get services api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray()
            res.send(services)
        })

        /// Bookingorders

        app.post('/addorder', (req, res) => {
            console.log(req.body);
            bookingCollection.insertOne(req.body).then((result) => {
                res.json(result);
                console.log(result);
            })

        })

        app.get('/mybooking/:email', async (req, res) => {
            console.log(req.params.email);

            const result = await bookingCollection.find({ email: req.params.email }).toArray()
            res.send(result);
        })


        /// Get my orders

        app.get('/booking', async (req, res) => {
            const cursor = bookingCollection.find({});
            const booking = await cursor.toArray()
            res.send(booking)

        })

        //delete my orders
        app.delete('/deletebooking/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.deleteOne(query)
            res.json(result)

        })

        ///manage all orders
        app.delete('/managealldelete/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.deleteOne(query)
            res.json(result)

        })
        /// Add a new Services///
        app.post('/addservices', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service)
            res.json(result);

        })
        ///update <status /

        app.put('/update/:id', async (req, res) => {
            console.log(req.params.id);
            const updateinfo = req.body;
            // bookingCollection.findOne({_id:ObjectId(id)},{
            //     $set:{
            //         updateinfo

            //     }
            // })
            console.log(updateinfo);

        })




    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World! i am.... imran')
})

app.listen(port)
