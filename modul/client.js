var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    clientId : {
        type : String
    },
    clientSecret : {
        type : String
    },
    user: {
        type:String
    },
   scope:{
       type: String
   } 
});

module.exports = mongoose.model('client', schema);
