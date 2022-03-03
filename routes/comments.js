var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");


//New Comment
router.get("/campgrounds/:id/comment/new", middleware.isLoggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else{
            res.render("comment",{campground: campground});
        }
    });
    
})

//Create new comment
router.post("/campgrounds/:id/comment", middleware.isLoggedIn, function(req, res){
        //Lookup campground with ID
        Campground.findById(req.params.id, function(err, campground){
            if(err){
                console.log(err);
            } else{
                newComment = {
                    text: req.body.text,
                    author: req.user.username
                };
                Comment.create(newComment, function(err, comment){
                //Add the comment to the specific campground
                campground.comments.push(comment);
                campground.save();
                //Redirect to show page
                res.redirect("/campgrounds/" +req.params.id)
            })
        }                 
    })
})

//EDIT COMMENT ROUTE
router.get("/campgrounds/:id/comments/:id_2/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.id_2, function(err,comment){
        res.render("editComment", {campground_id: req.params.id, comment:comment});
    })
});

//UPDATE ROUTE
router.put("/campgrounds/:id/comments/:id_2", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.id_2, req.body.comment, function(err, comment){
        if(err){
            console.log(err);
        } else{
            
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
});

//DELETE A COMMENT
router.delete("/campgrounds/:id/comments/:id_2", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.id_2, function(err){
        if (err){
            req.flash("error", "Encountered and error")
            console.log(err)
        }
        else{
            req.flash("success", "Comment deleted")
            res.redirect("/campgrounds/"+req.params.id)
        }
    });
})

module.exports = router;