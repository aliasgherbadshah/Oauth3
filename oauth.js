var mongoose = require("mongoose");
var moment = require('moment');
var singup = require("./modul/singup.js");
var atoken = require("./modul/acceptToken.js");
var rtoken = require("./modul/refreshToken.js");
var Client = require("./modul/client.js");
var authorisation = require("./modul/authorisation.js");
var _ = require("underscore");




// get Client 
module.exports.getClient=function(clientId, clientSecret, callback){
//    console.log("get client id ----------------------------------------",clientId,clientSecret);
    Client.findOne({clientId: clientId}).
    then(function(clientData){
        if(clientData == null){
            console.log('client not found')
            callback(false,null);
        }else{
            clientData.grants=['authorization_code', 'password', 'refresh_token', 'client_credentials'];
            callback(null,clientData);
            
                
        }
    }).catch(function(err){
        console.log(err);
        callback(false,null);
    })
}


// get user
module.exports.getUser=function(username, password, callback){
    console.log('get user-----------', username ,password);
    
    singup.find({user: username}).
    then(function(data){
//        var userobject = _.extend({},data);
        
//        console.log('user object', userobject)

        
            if(data[0].password === password){
                var obj={};
                obj._id=data[0]._id;
                obj.user=data[0].user;
                obj.password=data[0].password;
                obj.scope=data[0].scope;
//                console.log('new object---------------', obj)
                callback(null,obj)
                
            }else{
                callback(false, null)
            }
    }).catch(function(err){
        console.log(err);
        callback(false, null)
    })
    
}


//saving token
module.exports.saveToken=function(token, client, user, callback){
//    console.log('In Save Token',user)
    var d = {
        token,
        user,
        client
    };
//    console.log(d)
    
    
    
    var Atoken = new atoken();
    Atoken.accessToken = token.accessToken;
    Atoken.accessTokenExpiresAt =token.accessTokenExpiresAt;
    Atoken.user =   user;
    Atoken.client =client.clientId; 
    Atoken.scope=user.scope
    Atoken.save(function(err,data){
        console.log("data---______",data)
        
        var t = data.toObject();
        t.refreshToken = token.refreshToken;
        t.refreshTokenExpiresAt = token.refreshTokenExpiresAt;
        
        if(err){console.log(err)}
//    console.log("done-------===-----");
    callback(null,t);
//        console.log(t)
})
    
    
    var Rtoken = new rtoken();
    Rtoken.refreshToken = token.refreshToken;
    Rtoken.refreshTokenExpiresAt = token.refreshTokenExpiresAt;
    Rtoken.user =user;
    Rtoken.client =client; 
    Rtoken.scope=user.scope
    Rtoken.save(function(err,data){
        
        
        if(err){console.log(err)}
//    console.log("done-------===-----");
    callback(null,data);
//        console.log(data)
})
    
    
}

//console.log('*************************************************')
//
//var timing = moment().utc();
//console.log(timing)


module.exports.getRefreshToken=function(refreshToken, callback){
    console.log('********************************************************************************')
    
    
    rtoken.findOne({refreshToken:refreshToken})
        .populate('user')
        .populate('client')
        .then(function(savedRT){
        if(savedRT){
//        console.log(token)
//        console.log(refreshToken)
//      
            
            
//            console.log('SAVED RT');
//            console.log(savedRT);
//            console.log('SAVED RT');
            var tokenTemp = {
               user: savedRT ? savedRT.user : {},
               client: savedRT ? savedRT.client : {},
               refreshTokenExpiresAt: savedRT ? new Date(savedRT.expires) : null,
               refreshToken: refreshToken,
               refresh_token: refreshToken,
               scope: savedRT.scope
           };
            
            
            
                    //    console.log(tokenTemp);

            
            
        callback(null,tokenTemp)
        }else{
            
            callback(false,null);
        }
    }).catch(function(err){
        console.log(err)
        callback(false,null)
    })
    
    
   
    
    
}


module.exports.revokeToken=function(token, callback){
    
     rtoken.findOne({
       where: {
           refreshToken: token.refreshToken
       }
   }).then(function (rT) {     
            
           if (rT)rT.destroy();

           var expiredToken = token;
           expiredToken.refreshTokenExpiresAt = new Date('2015-05-28T06:59:53.000Z')
           callback(null,true);
        
         
    }).catch(function(err){
        console.log(err);
        callback(false,null);
    })
    
    
    
    
  }  
    
    
    
module.exports.getAccessToken=function(accessToken, callback){
 console.log('In get access token',accessToken);
    
    atoken.findOne({accessToken:accessToken})
    .then(function(accessToken){
        console.log(accessToken);
        if(accessToken){
            callback(null,accessToken);
        }else{
            callback(false,null)
        }
    }).catch(function(err){
        console.log(err);
        callback(false,null);
    })
    
    
}





module.exports.validateScope=function(user, client, scope, callback){
    console.log("in Scope validation",client.scope);
    console.log("in Scope validation",client);
    if (user.scope === scope) {
        callback(null,scope)
    }if(client.scope === "Admin"){
        callback(null,client.scope)
    }else{
        callback(false,null)
    }
}


module.exports.verifyScope=function(accessToken, scope, callback){
    console.log(accessToken);
    console.log(scope);
    //    
     if (accessToken.scope === scope) {
        callback(null,accessToken);
    }else{
      callback(false,null);  
    }
//      
      
}





module.exports.getUserFromClient=function(client, callback){
    console.log("client grant",client);
    
    Client.findOne({clientId:client.clientId})
    .then(function(client){
        if(client){
            Client.findOne({clientSecret:client.clientSecret})
            .then(function(cl){
                console.log("-----------client credintial",cl)
                callback(null,cl);
                
            }).catch(function(err){
                console.log(err);
                callback(false,null)
            })
        }else{
            console.log("client not found")
            callback(false,null)
        }
    }).catch(function(err){
        console.log(err);
        callback(false,null);
    })
    
}





module.exports.getAuthorizationCode=function(authorizationCode, callback){
    console.log('In get auhtorisation code',authorizationCode);
    authorisation.findOne({authorization_code:authorizationCode})
    .then(function(authorisation){
        if(authorisation){
            callback(null,authorisation)
        }else{
            console.log('authorisation code note found')
            callback(false,null)
        }
    }).catch(function(err){
        console.log(err);
        callback(false,null);
    })
    
}


module.exports.saveAuthorizationCode=function(code, client, user, callback){
    console.log("authorisation code", code);
    
    
     var Authorisation = new authorisation();
    Authorisation.authorization_code = code.code;
    Authorisation.expires = code.expiresAt;
    Authorisation.user = code.user;
    Authorisation.client = code.client;
    Authorisation.scope = code.scope;
    Authorisation.redirect_uri = code.redirectUri;
    Authorisation.save(function(err,data){
        
        
        if(err){console.log(err)}
//    console.log("done-------===-----");
    callback(null,data);
//        console.log(data)
})
    
}


module.exports.revokeAuthorizationCode=function(code, callback){
  
    authorisation.findOne({
       where: {
           authorization_code: code.authorizationCode
       }
   }).then(function (aT) {     
            
           if (aT)aT.destroy();

           var expiredcode = code;
           expiredcode.expiresAt = new Date('2015-05-28T06:59:53.000Z')
           callback(null,true);
        
         
    }).catch(function(err){
        console.log(err);
        callback(false,null);
    })
    
    
    
    
}












    
// console.log('alalallalalallalalalalallal');
//    
//    rtoken.delete({refreshToken:token.refreshToken})
//    
// console.log(token);
 
