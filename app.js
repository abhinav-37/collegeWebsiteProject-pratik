const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const passportLocalMongoose = require("passport-local-mongoose");
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.static("public"));
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(
    "mongodb+srv://admin-Abhinav:admin-Abhinav@cluster0-fz1t0.mongodb.net/testAuthDb",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("database is connected");
        }
    }
);
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({});
const noticeSchema = new mongoose.Schema({
    notice: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
const Notice = new mongoose.model("Notice", noticeSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=================get routes=========================
app.get("/register", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("register.ejs");
    } else {
        res.redirect("/login");
    }
});

app.get("/login", function (req, res) {
    res.render("login.ejs");
});
app.get("/noticeForm", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("noticeForm", {
            alertText: "",
            userName: req.user.username,
        });
    } else {
        res.redirect("/login");
    }
});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/login");
});

app.get("/", function (req, res) {
    res.render("index.ejs");
});
app.get("/admission", function (req, res) {
    res.render("indexInside/admission.ejs");
});
app.get("/syllabus", function (req, res) {
    res.render("indexInside/syllabus.ejs");
});
app.get("/rules", function (req, res) {
    res.render("indexInside/rules.ejs");
});
app.get("/results", function (req, res) {
    res.render("indexInside/result_year1.ejs");
});
app.get("/facilities", function (req, res) {
    res.render("indexInside/facilities.ejs");
});
app.get("/year1", function (req, res) {
    res.render("indexInside/result_year1.ejs");
});
app.get("/year2", function (req, res) {
    res.render("indexInside/result_year2.ejs");
});
app.get("/year3", function (req, res) {
    res.render("indexInside/result_year3.ejs");
});
// ==================post routes ==========================
app.post("/register", function (req, res) {
    if (req.isAuthenticated()) {
        User.register(
            { username: req.body.username },
            req.body.password,
            function (err, user) {
                if (err) {
                    console.log(err);
                    res.redirect("/register");
                } else {
                    passport.authenticate("local")(req, res, function () {
                        res.render("noticeForm", {
                            alertText: " Admin added successfully.",
                            userName: req.user.username,
                        });
                    });
                }
            }
        );
    } else {
        res.redirect("/login");
    }
});
app.post("/submitNotice", function (req, res) {
    if (req.isAuthenticated()) {
        const notice = new Notice({
            notice: req.body.noticeText,
        });
        notice.save();
        if (req.isAuthenticated()) {
            res.render("noticeForm", {
                alertText: " Notice uploaded successfully.",
                userName: req.body.username,
            });
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/noticeForm");
    }
});

app.post("/login", function (req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/noticeForm");
            });
        }
    });
});

app.listen(process.env.PORT || 8000, function () {
    console.log("server has started");
});
