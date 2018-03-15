var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    refreshToken  : {
        type : String
    },
    refreshTokenExpiresAt  : {
        type : Date
    },
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref: "singup"
    },
    client  : {
       type : mongoose.Schema.Types.ObjectId ,
        ref: "client"
    },
    scope:{
        type : String
    }
});

module.exports = mongoose.model('refreshToken', schema);
