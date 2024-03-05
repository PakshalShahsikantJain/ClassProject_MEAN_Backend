const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemsSchema = new Schema({
    image : String,
    title : String,
    startDate : String,
    duration : String,
    Timings : String,
});

module.exports = mongoose.model('item',itemsSchema,'items')