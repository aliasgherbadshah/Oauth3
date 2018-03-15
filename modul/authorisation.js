
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    authorization_code  : {
        type : String
    },
    expires  : {
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
    },
    redirect_uri:{
        type : String
    }
});

module.exports = mongoose.model('authorisation', schema);








//
//
//authorization_code: String,
// expires: Date,
// redirect_uri:  String,
// scope:  String,
// User:  { type : Schema.Types.ObjectId, ref: ‘User’ },
// OAuthClient: { type : Schema.Types.ObjectId, ref: ‘OAuthClient’ },