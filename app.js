const mongoose = require("mongoose")
const session = require('express-session')
const passport = require("passport");
const bodyParser = require("body-parser");
const passportLocalMongoose = require("passport-local-mongoose");
const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    
  }))

  app.use(passport.initialize());
  app.use(passport.session());


 mongoose.connect("mongodb+srv://admin-Abhinav:admin-Abhinav@cluster0-fz1t0.mongodb.net/testAuthDb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
},function(err){
    if (err) {
        console.log(err);
    } else {
        console.log("database is connected");
    }
    
});
mongoose.set("useCreateIndex",true);

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/register",function(req,res){
    res.render("register.ejs")
});

app.get("/",function(req,res){
    res.render("login.ejs")
})
app.get("/index",function(req,res){
    if (req.isAuthenticated()) {
        res.render("index.ejs")
    } else {
        res.redirect("/")
    }
})


app.post("/register",function(req,res){
    User.register({username:req.body.username},req.body.password,function(err,user){
        if (err) {
            console.log(err);
            res.redirect("/register")
        } else {
            passport.authenticate("local")(req,res, function(){
                res.redirect("/index");
            })
        }
    })
})





app.listen("3000",function(){
    console.log("server has started");
})