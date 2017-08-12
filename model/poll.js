/**
 * Created by rdevansjr on 6/21/17.
 */

var mongoose = require('mongoose');
/* ********************************************
 URL SCHEMA
 ******************************************** */
var pollSchema = new mongoose.Schema({
    owner: {type: String, unique: false},
    question: {type: String, unique: false},
    response: [{ response: String, unique: false, votes: Number, unique: false }]
});

// Build the User model
module.exports = mongoose.model( 'Poll', pollSchema );



