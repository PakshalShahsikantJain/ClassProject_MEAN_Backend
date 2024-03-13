require('dotenv').config();

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const db = process.env.MONGODB_URI;
//const db = "mongodb://localhost:27017/classdata";

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
        var data = {
            'RID' : savedData.RID,
            'firstName' : savedData.firstName,
            'lastName' : savedData.lastName,
            'batch': savedData.batch,
            'email' : savedData.email,
        };
        
        res.status(200).json(data);

        SendMail(data);

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

function SendMail(data)
{
    var batch = " ";

    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'programmersden1256@gmail.com', // Your email address
            pass: 'nrqt vyiy craa vdeq' // Your email password
        }
    });

    switch(data.batch)
    {
        case "CCJ" :
            {
                batch = "C, C++ and Java Programming";
            }
            break;
        case "MEAN" :
            {
                batch = "MEAN Stack Web Development";
            }
            break;
        case "GO" :
            {
                batch = "Programming in GoLang";
                break;
            }
        case "PY" :
            {
                batch = "Programming in Python";
            }
            break;
        default :
        {
            console.log("Invalid Batch Selected");
            return;
        }
    }

    let emailBody = 'Hello '+data.firstName+' '+data.lastName+',\n\n'+'Welcome To Programmers Den Family,\n\n'+
    'Your Registration ID is RID:'+data.RID+'. Save it For Further Use.'+'\n\nRegistered For Batch : '+batch+
    '\n\nNote : Please Pay Registration Fees To Confirm Your Registration. Contact Us For Bank Details Or Come At Class To Pay in Cash!!!'
    +'\n\nRegards,\nPakshal Jain(Programmers Den)';

    // Set up email data
    let mailOptions = {
        from: 'programmersden1256@gmail.com', // Sender address
        to: data.email, // List of recipients
        subject: 'Registration ID and Batch Details', // Subject line
        text: emailBody // Plain text body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error.message);
        } else {
            console.log('Email sent successfully!');
            console.log('Message ID:', info.messageId);
        }
    });
}
module.exports = router;

