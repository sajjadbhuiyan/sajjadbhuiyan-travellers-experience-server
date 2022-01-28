const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zl5hq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
   try {
    await client.connect();
    const database = client.db("traveler_experience");
    const blogColoection = database.collection("blogs");

    app.get('/blogs', async(req, res) =>{
        const cursor = blogColoection.find({});
        const page = req.query.page;
        const size = parseInt(req.query.size);
        let blogs;
        const count = await cursor.count();
        if(page){
          blogs = await cursor.skip(page*size).limit(size).toArray();
        }else{
          blogs = await cursor.toArray();
        }
        res.send({
          count,
          blogs,
        });
    })

    // GET sengle blog
    app.get('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      console.log('getting specific service', id);
      const query = {_id: ObjectId(id)};
      const blog = await blogColoection.findOne(query);
      res.json(blog);
  })
   } finally{
    // await client.close();
   }
}

run().catch(console.dir)
 
app.get('/', (req, res) => {
  res.send('Hello Travelers!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})