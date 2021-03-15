require('dotenv').config();
const express = require("express");
const app = express();
const User = require("./module/User");
const Order = require("./module/Order");
const bodyParser =require("body-parser");
var jwt = require("jsonwebtoken");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// token generate
const generateAccessToken = (id) => {
    return jwt.sign({ id }, `${process.env.JWT_SECRET_KEY}`);
  };


// authenticate the user
let order_id = "";
const authenticate = async(req , res , next) =>
{
    try{
        let decoded = await jwt.verify(
            // requesting the token from the header to authenticate
            req.headers.authorization,
            process.env.JWT_SECRET_KEY
        );
        // console.log(decoded);
        if (!decoded) {
          return res.send("Unauthenticated User");
        }
        order_id = decoded.id;
        console.log(order_id)
            next();
        
      } catch (err) {
        //   console.log(err)
        return res.send(err.message);
      }
      
};


// create users
app.post('/Register', async(req,res)=>{
    let {name ,pass} =req.body;
    let data = new User(req.body);
    data.save();
   
    console.log("successfully posted");
})


// login
app.post('/login', async (req,res)=>{
    let{name ,pass} = req.body;
    if(name !== "" && pass !== "")
    {
        let data = await User.findOne({name});
        if(data)
        {
            console.log("data id",data._id);
            let token = generateAccessToken(data._id);
            res.send(token);
        }else{
            res.send("error to find");
        }
    }else{
        console.log("not found");
    }
})


// Order Placement
app.post("/order", authenticate ,async(req ,res)=>{
    let { product_name } = req.body;
    let user_id=order_id;
    let data = await Order({user_id:user_id , product_name:product_name});
    data.save();
    console.log("sucessfully placed");
    if(data)
    {
        res.send("Product placed sucessfully");
    }else{
        res.send("not");
    }
})


// Get the user placed order
app.get("/order/:id", authenticate ,async(req ,res)=>{
    let id=req.params.id;
    let data = await Order.find({ user_id :id});
    res.json(data);
})

app.get("/user", (req,res) =>{
    console.log("sucess");
})

app.listen(8000 , ()=>console.log('Port is running on port 8000'))