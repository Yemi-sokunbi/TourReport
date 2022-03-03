var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
const user = require("../models/user");
var passport = require("passport");
var middleware = require("../middleware/index");



router.get("/", function(req,res){
    //console.log(req.user); 
    Campground.find({},function(err,allcampgrounds){
       if(err){
           console.log(err)
       } else{
         res.render("index", {campgrounds: allcampgrounds});
       }
    })
});
//CREATE
router.post("/",middleware.isLoggedIn, function(req,res){
    //get data from form
    var name = req.body.campground;
    var url = req.body.url;
    var synopsis = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name: name, 
        image: url, 
        description: synopsis,
        author: author
    };
    Campground.create(newCampground, function(err,campground){
        if(err){
            console.log(err)
        } else{
            console.log(newCampground);
             //redirect to campgrounds page
            res.redirect("/campgrounds");
        }
    })  
});
//NEW
router.get("/new", middleware.isLoggedIn,function(req,res){
    res.render("addcampgrounds");
})
//SHOW
router.get("/:id",function(req,res){
    //find the campground with the selected ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,description){
        if(err){
            console.log(err);
        }else{
            res.render("show", {description: description});
        };
    })
})

//EDIT CAMPGROUND
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
            res.render("edit", {campground: campground}); 
    })
});

//UPDATE CAMPGROUND
router.put("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, update){
        if(err){
            res.redirect("/campgrounds")
        }
        else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//DELETE CAMPGROUND
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            console.log(err)
        }
        else{
            res.redirect("/campgrounds")
        }
    });
})

module.exports = router;