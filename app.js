const express = require('express')
const app = express()
const mongoose = require('mongoose')
var bodyParser = require('body-parser')
const cors = require('cors')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('./User.js')
require('./Detection.js')
require('./Department.js')
require('./Position.js')

const User = mongoose.model('User')
const Detection = mongoose.model('Detection')
const Department = mongoose.model('Department')
const Position = mongoose.model('Position')

app.use(cors())
// parse application/x-www-form-urlencoded

// app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: false
}));
app.use(bodyParser.json({limit: "50mb"}));

// parse application/json
app.use(express.json())

const JWT_SECRET = 'E2831E78F46FD6C2735E4E3A3494623D4C3C1C7B9823633DE94D611AFA525459'
const port = 5000
const mongoUrl = 'mongodb+srv://tranthanhtue:tuetran123@cluster0.lsnutbu.mongodb.net/blog-database'

mongoose.connect(mongoUrl)
.then(()=>{
    console.log("Connected to MongoDB")
})
.catch((e)=>{
  console.log(e)
})


app.post('/register', async(req, res) => {
    const { username,password,fullname,address,phonenumber,email,departmentID,positionID,gender,role} = req.body
    // console.log(req.body)
    const encryptedPassword = await bcryptjs.hash(password,10)

    try {
      const isUsernameExist = await User.exists({username: username})
      const isPhonenumberExist = await User.exists({phonenumber: phonenumber})
      const isEmailExist = await User.exists({email: email})      

      if(isUsernameExist){
        return res.json({error:'Username already exists'})
      }
      if(isEmailExist){
        return res.json({error:'Email already exists'})
      }
      if(isPhonenumberExist){
        return res.json({error:'phonenumber already exists'})
      }

    await User.create(
      {
        username:username,
        password:encryptedPassword,
        fullname:fullname,
        address:address,
        phonenumber:phonenumber,
        email:email,
        department:departmentID,
        position:positionID,
        gender:gender,
        role:role,
      }
     )
     res.send({status:'ok'})
    }
    catch(err) {
      console.log(err)
      res.send({status:'error'})
    }
})

app.post('/departmentCreate', async(req, res) => {
  const { departmentName,description} = req.body
  try {
    await Department.create(
    {
      departmentName:departmentName,
      description:description,
    }
   )
   res.send({status:'ok'})
  }
  catch(err) {
    console.log(err)
    res.send({status:'error'})
  }
})

app.post('/positionCreate', async(req, res) => {
  const { positionName,description} = req.body
  try {
    await Position.create(
    {
      positionName:positionName,
      description:description,
    }
   )
   res.send({status:'ok'})
  }
  catch(err) {
    console.log(err)
    res.send({status:'error'})
  }
})


app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcryptjs.compare(password, user.password)) {
    const token = jwt.sign({ username: user.username }, JWT_SECRET);

    
    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
});

app.post('/userDetail', async(req,res)=>{
  const {token} = req.body
  
  try{
    const user = jwt.verify(token,JWT_SECRET, (err, res)=>{
      if(err){
        return'token expired'
      }
      return res
    })
    // console.log(user)
    if(user=='token expired'){
      return res.send({status:'error',data:'token expired'})
    }

    const usernameDetail = user.username
    User.findOne({username: usernameDetail}).then((data)=>{
      res.send({status:'ok',data:data})
      // console.log(data)
    }).catch((err)=>{
      res.send({status:'error',data:err})
    })
  }catch(err){

  }
})

app.post('/detectionDetail', async(req,res)=>{
  const {token} = req.body
  try{
    const user = jwt.verify(token,JWT_SECRET, (err, res)=>{
      if(err){
        return'token expired'
      }
      return res
    })
    console.log(user)
    if(user=='token expired'){
      return res.send({status:'error',data:'token expired'})
    }
    const usernameDetail = user.username
    Detection.find({username: usernameDetail}).then((data)=>{
      res.send({status:'ok',data:data})
    }).catch((err)=>{
      res.send({status:'error',data:err})
    })
  }catch(err){

  }
})

app.get("/getAllUsers",async(req, res)=>{
  try{
    const allUser = await User.find({});
    res.send({status:'ok',data:allUser})
  } catch (err){
    console.log(err)
  }
})

app.post("/particularUser",async(req, res)=>{
  console.log(req.body)
  const { username } = req.body;
  try{
    User.find({username: username}).
    then((data)=>res.send({status:'ok',data:data}).
    catch((err)=>{res.send({status:'error',data:err})}))
  } catch (err){
    console.log(err)
  }
})

app.get("/getAllDetections",async(req, res)=>{
  try{
    const allDetection = await Detection.find({});
    res.send({status:'ok',data:allDetection})
  } catch (err){
    console.log(err)
  }
})

app.get("/getExecutiveAndDeparment",async(req, res)=>{
  try{
    const allExecutive = await User.find({});
    const allDepartment = await Department.find({});

    res.send({status:'ok',data:{executive:allExecutive, department:allDepartment}});
  } catch (err){
    console.log(err)
  }
})

app.get("/getPositionAndDeparment",async(req, res)=>{
  try{
    const allPosition = await Position.find({});
    const allDepartment = await Department.find({});

    res.send({status:'ok',data:{position:allPosition, department:allDepartment}});
  } catch (err){
    console.log(err)
  }
})

app.post('/deleteUser',async(req,res) => {
  const {userID}=req.body;
  try {
    const deleteUser = await User.deleteOne({_id:userID});
    
    res.send({status:'ok',data:deleteUser});
  } catch (error) {
    console.log(error)
  }
})



app.post("/update-image", async (req, res) => {
  const { userID,base64 } = req.body;
  try {
    await User.updateOne({_id: userID},{image: base64})
    res.send({ Status: "ok" })

  } catch (error) {
    res.send({ Status: "error", data: error });

  }
})

app.post("/personal-update", async (req, res) => {
  const { userID,username,fullname,address,phonenumber,email,gender,role } = req.body;
  try {
    await User.updateOne({_id: userID},{
      username: username,
      fullname: fullname,
      address: address,
      phonenumber: phonenumber,
      email: email,
      gender: gender,
      role: role,
    })
    res.send({ Status: "ok" })

  } catch (error) {
    res.send({ Status: "error", data: error });

  }
})

app.post("/employee-update", async (req, res) => {
  const { userID,positionID,departmentID } = req.body;
  // console.log(req.body)
  try {
    await User.updateOne({_id: userID},{
      position: positionID,
      department: departmentID,
    })
    res.send({ Status: "ok" })

  } catch (error) {
    res.send({ Status: "error", data: error });

  }
})

app.post("/get-info", async (req, res) => {
  const { userID } = req.body;
  try {
    await User.findOne({_id: userID})
    .populate("department","departmentName -_id")
    .populate("position","positionName -_id")
    .then((data)=>{
      res.send({status:'ok',data:data})
    }).catch((err)=>{
      res.send({status:'error',data:err})
    })

  } catch (error) {

  }
})

app.post("/user-detection-by-date", async (req, res) => {
  const { username } = req.body;
  try {
    await Detection.find({username: username})
    .then((data)=>{
      res.send({status:'ok',data:data})
    }).catch((err)=>{
      res.send({status:'error',data:err})
    })

  } catch (error) {

  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})