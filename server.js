var express = require("express");
var oauthserver = require('oauth2-server');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var singup = require("./modul/singup.js");
var atoken = require("./modul/acceptToken.js");
var rtoken = require("./modul/refreshToken.js");
var client = require("./modul/client.js");
var item = require("./modul/item.js");



var Request = oauthserver.Request;
var Response = oauthserver.Response;






mongoose.connect('mongodb://ali_asgher:husain5253@ds151908.mlab.com:51908/oauth_data');


var app = express();
var Port = 1000;


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/public"));









app.oauth = new oauthserver({
  model: require("./oauth")
  
    
})


app.authenticate=function(options){
    return function(req, res, next){
        var request = new Request(req);
        var response = new Response(res);
        
        return app.oauth.authenticate(request, response, options)
      .then(function(token) {
        req.user=token.user;
        next();
      })
      .catch(function(err) {
        console.log(err);
            res.status(err.code || 500).send(err);
      });
        
    }
}













app.get('/',function(req, res){
    res.render('index')
})

app.post('/singup',function(req,res){
    var Singup = new singup();
    Singup.user = req.body.userName;
    Singup.password = req.body.password;
    Singup.scope = "Admin";
    Singup.save(function(err,data){
        if(err){console.log(err)}
        res.send({'all done':data})
//        res.send(data)
    console.log(Singup.password);
    console.log(Singup.user)    
    })
    
})

app.post('/login',function(req,res){
    
       var request = new Request(req);
       var response = new Response(res);

       app.oauth
           .token(request,response)
           .then(function(token) {
               // Todo: remove unnecessary values in response
           console.log(token)
               return res.json(token)
           }).catch(function(err){
           return res.status(500).json(err)
       })
   });
    
    
    
//    
//    var d;
//    singup.find({user: req.body.username}).
//    then(function(data){
//            res.send(data);
//    })
//    
    
    
//})


app.post('/login/insert',app.authenticate({scope:"user"}),function(req,res){
    
//    atoken.findOne({accessToken:req.token})
//    .then(function(data){
//        if(data){
//            `
//        }else{
//            res.send('no such access token exist')
//        }
//    })
    
    var Item = new item();
    Item.detail = req.body.detail;
    Item.save(function(err,data){
        if(err){console.log(err)}
        res.send({'all done':data})

    })
})






app.listen(Port,function(){
    console.log('server started')
})