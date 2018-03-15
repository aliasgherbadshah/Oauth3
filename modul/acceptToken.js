var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    accessToken  : {
        type : String
    },
    accessTokenExpiresAt  : {
        type : Date
    },
    user: {
        type : mongoose.Schema.Types.ObjectId ,
        ref: "singup"
    },
    client  : {
        type : String
    },
    scope:{
        type : String
    }
    
});

module.exports = mongoose.model('acceptToken', schema);
