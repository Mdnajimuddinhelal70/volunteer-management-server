const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9b7hvrr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const volunteerCollection = client.db("volunteerDb").collection("volunteer");
    const formVolunteerCollection = client.db("volunteerDb").collection("formVolunteer");

    app.get('/volunteer', async (req, res) => {
        const result = await volunteerCollection.find().sort({ deadline: 1 }) 
          .limit(3) 
          .toArray();
        res.json(result);    
    });
          // API for showing all cards and filtering
      app.get('/volunteerAll', async (req, res) => {
        const filter = req.query;
        const query = {
          postTitle: {$regex: filter.search, $options: 'i'}
        }
          const result = await volunteerCollection.find(query).toArray();
          res.json(result);   
      });


    app.get("/volunteerDetails/:id", async (req, res) => {  
        const id = req.params.id;
        const result = await volunteerCollection.findOne({
          _id: new ObjectId(id),
        });
        res.send(result);
    });

    //api for request send
    app.post('/submit-volunteer-request/:email', async (req, res) => {
      const email = req.params.email; 
      const requestData = req.body; 
      requestData.email = email; 
      const result = await formVolunteerCollection.insertOne(requestData);
      res.send(result); 
    });

    app.post("/formVolunteer", async (req, res) => {
      const result = await volunteerCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/volunteer-need-details/:id", async (req, res) => {
      const id = req.params.id;
      const result = await volunteerCollection.findOne({_id: new ObjectId(id)});
      res.send(result);
    });

    app.get("/needPost", async (req, res) => {
      const result = await formVolunteerCollection.find().toArray();
      res.send(result);
    });

    // API for deleting a volunteer
    app.delete("/deleteVolunteer/:id", async (req, res) => {
      const result = await formVolunteerCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.get('/volunteerPostUpdate/:id', async (req, res) => {
      const result = await formVolunteerCollection.find().toArray();
      res.send(result);
    });

    app.get('/myNeedPost', async(req, res) => {
      const result = await formVolunteerCollection.find().toArray()
      res.send(result)
    })

    app.put("/updateVolunteerPost/:id", async (req, res) => {
        const query = { _id: new ObjectId(req.params.id) };
        const data = {
          $set: {
            thumbnail: req.body.thumbnail,
            postTitle: req.body.postTitle,
            description: req.body.description,
            category: req.body.category,
            location: req.body.location,
            noOfVolunteersNeeded: req.body.noOfVolunteersNeeded,
            deadline: req.body.deadline,
          },
        };
        const result = await formVolunteerCollection.updateOne(query, data);
        res.send(result); 
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Volunteer project is running");
});

app.listen(port, () => {
  console.log(`Volunteer project is running on port ${port}`);
});
