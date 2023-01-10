const express = require('express')
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8tifwil.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run(){
    try{

        const productsCollection = client.db("Admin-panel").collection("products");
        const ordersCollection = client.db("Admin-panel").collection("orders");
        const usersCollection = client.db("Admin-panel").collection("users");


        app.post("/products", async (req, res) => {
            const product = req.body;
            const result = productsCollection.insertOne(product);
            res.send(result);
          });
        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = ordersCollection.insertOne(order);
            res.send(result);
          });
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = usersCollection.insertOne(user);
            res.send(result);
          });

          app.get("/products", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await productsCollection.find(query).sort({ $natural: -1 }).toArray();
            res.send(result);
          });
          app.get("/my-orders", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await ordersCollection.find(query).sort({ $natural: -1 }).toArray();
            res.send(result);
          });
          app.get("/all-products", async (req, res) => {
            const query = {};
            const result = await productsCollection.find(query).sort({ $natural: -1 }).toArray();
            res.send(result);
          });
          app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const filter = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(filter);
            res.send(result);
          });

          app.get("/users/admin/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === "Admin" });
          });
    }
    finally{

    }
}

run().catch((error) => {
    console.log(error.message);
  });



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`admin panel app listening on port ${port}`)
})