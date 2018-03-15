var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    detail : {
        type : String
    }
});

module.exports = mongoose.model('item', schema);
