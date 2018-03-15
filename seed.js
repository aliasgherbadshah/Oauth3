var client = require("./modul/client.js");
var server = require("./server.js");
var singup = require("./modul/singup.js");



var Client = new client();
    Client.clientId = "ali";
    Client.clientSecret ='asew';
    Client.user = '5aaa094df6b96b0478674185';
    Client.scope = "Admin";
    Client.save(function(err,data){
        if(err){console.log(err)}
    console.log(Client.clientId);
    console.log(Client.clientSecret)    
})