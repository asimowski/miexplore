var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err || !foundCampground){
               req.flash("error", "Campground not found!");
               res.redirect("back");
           } 
           if(foundCampground.author.id.equals(req.user._id)){
                next();
           } else {
                req.flash("error", "You do not have permission to edit this campground.");
                res.redirect("back");
           }
        });
    } else {
        req.flash("error", "You must be logged in to edit.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentAuth = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash("error", "Comment not found!");
               res.redirect("back");
           } 
           if(foundComment.author.id.equals(req.user._id)){
                next();
           } else {
                req.flash("error", "You do not have permission to edit this comment.");
                res.redirect("back");
           }
        });
    } else {
        req.flash("error", "You must be logged in to edit.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to do that.");
    res.redirect("/login");
};

module.exports = middlewareObj;

