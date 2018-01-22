var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var middleware = require("../middleware");

var geocoder = require("geocoder");

//INDEX
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err || !campgrounds){
            req.flash("error", "Someting went wrong!");
            console.log("ERR"+ err);
            res.redirect("back");
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds, page: 'campgrounds'});
        }
    });
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.campname;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function(err, data){
        if(err){
            console.log(err);
        } else {
           var lat = data.results[0].geometry.location.lat;
           var lng = data.results[0].geometry.location.lng;
           var location = data.results[0].formatted_address;
       
           var newCamp = {name: name, image: image, description: description, price: price, author: author, location: location, lat: lat, lng: lng};
            Campground.create(newCamp, function(err, campground){
                if (err || !campground){
                    req.flash("error", "Something went wrong!");
                    console.log("ERROR creating camp: "+ err);
                    res.redirect("back");
                } else {
                    res.redirect("/campgrounds");
                }
            });
        }
    });

});

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    var id = req.params.id;
    var campground = Campground.findById(id).populate("comments").exec(function(err, camp){
        if(err || !camp){
            console.log("ERROR finding campground: " + err);
            req.flash("error", "Someting went wrong!");
            res.render("back");
        } else {
            res.render("campgrounds/show", {campground: camp});
        }
    });
});

//EDIT Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err || !foundCampground){
            req.flash("error", "Someting went wrong!");
            res.redirect("/campgrounds");
        }
       res.render("campgrounds/edit", {campground: foundCampground});
    });

});

//UPDATE Campground Route
router.put("/:id", middleware.checkCampgroundOwner, function(req, res){
    geocoder.geocode(req.body.campground.location, function(err, data){
        if(err){
            console.log(err);
        } else {
            req.body.campground.lat = data.results[0].geometry.location.lat;
            req.body.campground.lng = data.results[0].geometry.location.lng;
            req.body.campground.location = data.results[0].formatted_address;
            
            Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
                if(err || !updatedCamp){
                    req.flash("error", "Someting went wrong!");
                    res.redirect("/campgrounds");
                }
                res.redirect("/campgrounds/" + req.params.id);
            });
        }

    });
});


//DELETE
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           req.flash("error", "Something went wrong!");
           res.redirect("/campgrounds");
       } 
       res.redirect("/campgrounds");
    });
});


module.exports = router;