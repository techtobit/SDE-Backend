const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
let jwt = require('jsonwebtoken');
const multer = require('multer');
const port = process.env.PORT || 5000;
const UPLOAD_FOLDER = './Upload';


//save uploaded img

var upload = multer({
 dest: UPLOAD_FOLDER
});

//Middleware
app.use(express.static("public"));
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@netclan.p5hhjcj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
 try {
  await client.connect();
  const collection = client.db("test").collection("jsondatas");
  const userCollection = client.db("test").collection("users");

  // JWT Login Auth
  app.post('/jwt', (req, res) => {
   const user = req.body;
   const token = jwt.sign(user, process.env.ACCESS_TOKEN);
   res.cookie('token', token, { httpOnly: true });
   res.json({ token });
  });

  //JWT 
  // app.post('/login', async (req, res) => {
  //  const user = req.body;
  //  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
  //   expiresIn: '1d'
  //  })
  //  res.send(accessToken)
  // })

  app.post('/singup', async (req, res) => {
   const user = req.body;
   const userData = await userCollection.insertOne(user).toArray;
   res.send(userData);
  })


  //Img upload Api 
  app.post('/', upload.single('avatar'), (req, res) => {
   res.send('Hello Uploaded')
  })
  // app.post('/', upload.array('avatar', 12), function async(req, res, next) {

  // })




  app.get('/data', async (req, res) => {
   const user = await collection.find({}).toArray();
   res.send(user)
  })

 } catch (error) {

 }

}
run().catch(console.dir)



app.get('/', (req, res) => {
 res.send('Hello World!')
})


app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
})