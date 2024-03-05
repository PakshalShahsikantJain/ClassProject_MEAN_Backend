const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    name : String,
    email : String,
    phone : Number,
    subject : String,
    message : String,
});

module.exports = mongoose.model('message',messageSchema,'messages')