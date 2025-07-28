const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.m9nbb0x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Here you can add your database operations, e.g., creating collections, inserting documents, etc.
    const db = client.db("xbook"); // You can name your DB
    const usersCollection = db.collection("xuser");
    const postsCollection = db.collection("xpost");
    // Example: Insert a user
    // await usersCollection.insertOne({ name: "John Doe", email: "john@example.com" });

app.post('/xusers', async (req, res) => {
  const newUser = req.body;
  const emailOrPhone = newUser.emailOrPhone;

  const userExists = await usersCollection.findOne({
    $or: [
      { emailOrPhone: emailOrPhone },
      { email: emailOrPhone },         // Optional, if separate email field exists
      { phone: emailOrPhone }          // Optional, if separate phone field exists
    ]
  });

  if (userExists) {
    return res.send({ insertedId: userExists._id });
  }

  const result = await usersCollection.insertOne(newUser);
  res.send(result);
});


app.get('/xusers', async (req, res) => {
  // Fetch all users from the xuser collection
  const password = req.query.password;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).send({ error: 'Forbidden' });
  }
  if (!password) {
    return res.status(400).send({ error: 'Password is required' });
  }
  // Fetch all users from the xuser collection
  const users = await usersCollection.find({}).toArray();
  res.send(users);
});
  


  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Xbook server is running');
}
);






