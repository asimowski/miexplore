var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//Comments NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash("error", "Someting went wrong!");
            console.log("err");
            res.redirect("back");
        } else {
            res.render("comments/new",{campground: campground});
        }
    });
   
});

//Comments SAVE
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            console.log(err);
            req.flash("error", "Someting went wrong!");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
              if(err || !comment){
                  console.log(err);
                  res.redirect("/campgrounds/"+ req.params.id);
              } else{
                  //add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //save comment
                  comment.save();
                  campground.comments.push(comment._id);
                  campground.save();
                  res.redirect("/campgrounds/"+ campground._id);
              }
            });
        }
    });
});

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentAuth, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
            req.flash("error", "Someting went wrong!");
            res.redirect("back");
        }
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    });
});

//UPDATE
router.put("/:comment_id", middleware.checkCommentAuth,  function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err || !updatedComment){
           req.flash("error", "Someting went wrong!");
           res.redirect("back");
       } 
       
       res.redirect("/campgrounds/" + req.params.id);
    });
});

//DELETE
router.delete("/:comment_id", middleware.checkCommentAuth,  function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if (err){
          req.flash("error", "Someting went wrong!");
          res.redirect("back");
      }
      res.redirect("/campgrounds/" + req.params.id);
    }); 
});

module.exports = router;