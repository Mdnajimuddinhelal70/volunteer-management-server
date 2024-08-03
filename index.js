const express = require("express");
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9b7hvrr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
  
    const volunteerCollection = client.db("volunteerDb").collection("volunteer");

    app.get("/volunteer", async(req, res) => {
        const result = await volunteerCollection.find().toArray();
        res.send(result);
    });

    app.get('/voluntrDetails/:id', async (req, res) => {
        const id = req.params.id;
        const result = await volunteerCollection.findOne({_id: new ObjectId(id)})
        res.send(result)
    })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);



app.get('/', (req, res)=> {
    res.send('Volunteer project is running')
});
app.listen(port, () => {
    console.log(`Volunteer project is running on port ${port}`)
})