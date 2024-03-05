require('dotenv').config();

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = process.env.MONGODB_URI;
const RegisterData = require('../models/register');
const items = require('../models/items');
const MessageData = require('../models/message');

mongoose.connect(db).then(() => {
    console.log("Connected To Data Base");
}).catch((err)=>{
    console.log("An Error Occured While Connecting To Data Base",err);
});

//router.get('/home',Home);
router.get('/access',Access);
router.post('/register',Register);
router.post('/message',Message);

/*
function Home(req,res)
{
    res.send("Hello World");    
}
*/

function GenerateRid(batch) 
{
    // Construct the custom ID
    const randomNumber = Math.floor(0 + Math.random() * 1000);

    return `${batch}${randomNumber}`;
}

async function Register(req,res)
{
    const data = req.body;
    const Batch = data.batch;

    const newRegisterData = new RegisterData({
        RID : GenerateRid(Batch),
        firstName : data.firstName,
        middleName : data.middleName,
        lastName : data.lastName,
        phone : data.phone,
        email : data.email,
        batch : data.batch,
        state : data.state,
        city : data.city,
        pinCode : data.pinCode,
        address : data.address,
        currentAddress : data.currentAddress,
    });

    newRegisterData.save().then((savedData) => {
        //console.log("Data Saved Successfully in Mongo DB",savedData.RID);
        res.status(200).json(
            {
                'RID' : savedData.RID,
                'firstName' : savedData.firstName,
                'lastName' : savedData.lastName,
                'batch': savedData.batch
            }
        );


    }).catch((error) =>{
        console.log("Error While Saving Data",error);
        res.status(500).json('Error Occured');
    })
}

async function Access(req,res)
{  
    try 
    {
       const data = await items.find({});
       //console.log(data);

       res.status(200).json(data);
    }
    catch(error) 
    {
        console.log("Error Occured While Accessing The Data",error);
        res.status(500).json('An Error Occured While Sending Data');
    }
}

async function Message(req,res)
{
    const data = req.body;

    newMessageData = new MessageData(data);

    newMessageData.save().then((result) => {
        //console.log(result);
        res.status(200).json(true);
    }).catch((error) => {
        console.log(error);
        res.status(500).json(false);
    })
}

module.exports = router;

