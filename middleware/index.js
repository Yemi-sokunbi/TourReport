var middelwareObj = {};

middelwareObj.checkCampgroundOwnership = (req, res, next)=>{
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if(err){
                req.flash("error", "Campground not found")
                console.log(err);
            }
            else{
                //Is user login id == campground author's id
                if(campground.author.id.equals(req.user._id)){
                    next();
                } else{
                    res.flash("error", "You don't have permission")
                    res.redirect("back");
                } 
            }
        })
    } else{
        req.flash("error", "Login to proceed")
        res.redirect("/login");
    }
};

middelwareObj.checkCommentOwnership = (req, res, next)=>{
    if(req.isAuthenticated()){
        Comment.findById(req.params.id_2, function(err, comment){
            if(err){
                console.log(err);
            }
            else{
                console.log(comment.author.id);
                console.log(req.user._id);
                //Is comment author == loggedin user?
                if(ccurrentUser.username == comment.author){
                    next();
                } else{
                    res.flash("error", "No permission")
                    res.redirect("back");
                } 
            }
        })
    } else{
        res.flash("error","Login to continue")
        res.redirect("/login")
    }
}

middelwareObj.isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    };
    req.flash("error", "Login required");
    res.redirect("/login")
};

module.exports = middelwareObj;