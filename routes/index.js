var     express = require("express"),
        router  = express.Router(),
        User      = require("../models/user"),
        passport  = require("passport");
       
        router.get("/", function(req,res){
            res.redirect("/campgrounds")
        });          

//INDEX ROUTE
router.get("/register", function(req,res){
    res.render("register", {currentUser: req.user});
    
});

//SIGN UP
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
            //Logs user in and takes care of the session using local strategy
            passport.authenticate("local")(req,res, function(){
                req.flash("success", "Welcome to YemCamp " + user.username)
                res.redirect("/campgrounds")
            })
    });
});

//LOGIN
router.get("/login", function(req, res){
res.render("login");
})
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }) ,function(req, res){      
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged out")
    res.redirect("/campgrounds")
})

module.exports = router;