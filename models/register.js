const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const registerSchema = new Schema({
    RID : String,
    firstName : String,
    middleName : String,
    lastName : String,
    phone : Number,
    email : String,
    batch : String,
    state : String,
    city : String,
    pinCode : Number,
    address : String,
    currentAddress : String,
});

module.exports = mongoose.model('register',registerSchema,'registers')