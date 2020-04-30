const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended : true}));
var random = require("random");
var secretcode = random.int(143263, 34848833) + "";
app.use(session({resave: true, saveUninitialized: true, secret: secretcode, cookie: { maxAge: 600000 }}));
var sessionData

app.get("/" , function(req , res){
  res.sendFile(__dirname+"/signin.html");
})

app.post("/set_session", function(req, res){
  sessionData = req.session;
  sessionData.user = {};
  let username = req.body.emailid;
  let pwd = req.body.pwd;
  sessionData.user.username = username
  sessionData.user.pwd = pwd
   console.log("Setting session data:username=%s and pwd=%s", username, pwd)
   if(sessionData.user){
     console.log("Session available")
   }
   else{
     console.log("Session not available")
   }
 // res.end('Saved session and salary : ' + sessionData.username);
 res.json(sessionData.user)
})

app.get("/check" , function(req , res){
  if(sessionData){
      console.log("The username is " + sessionData.user.username + " and pwd is " + sessionData.user.pwd)
      res.end("The username is " + sessionData.user.username + " and pwd is " + sessionData.user.pwd)
  }
  else{
    console.log("Session not available")
    res.end("Session not available")
  }
})

app.get("/signout", function(req , res){
  sessionData = req.session;

    sessionData.destroy(function(err) {
        if(err){
            msg = 'Error destroying session';
            res.json(msg);
        }else{
            msg = 'Session destroy successfully';
            console.log(msg)
            res.json(msg);
        }
    })
})

let port = process.env.PORT || 3000

app.listen(port, function(){
  console.log("Server started on port " + port);
})
