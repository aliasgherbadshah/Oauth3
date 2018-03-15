var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    user : {
        type : String
    },
    password : {
        type : String
    },
    scope:{
        type : String
    }
});

module.exports = mongoose.model('singup', schema);
