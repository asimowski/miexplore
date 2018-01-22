var mongoose = require("mongoose");

var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
        {
            name: "Ludington State Park", 
            image: "https://img.hipcamp.com/image/upload/c_limit,f_auto,h_1200,q_60,w_1920/v1440478008/campground-photos/csnhvxn0qcki2id5vxnc.jpg", 
            description: "Thestral dirigible plums, Viktor Krum hexed memory charm Animagus Invisibility Cloak three-headed Dog. Half-Blood Prince Invisibility Cloak cauldron cakes, hiya Harry! Basilisk venom Umbridge swiveling blue eye Levicorpus, nitwit blubber oddment tweak. Chasers Winky quills The Boy Who Lived bat spleens cupboard under the stairs flying motorcycle. Sirius Black Holyhead Harpies, you’ve got dirt on your nose. Floating candles Sir Cadogan The Sight three hoops disciplinary hearing. Grindlewald pig’s tail Sorcerer's Stone biting teacup. Side-along dragon-scale suits Filch 20 points, Mr. Potter."
            
        },
        {
            name: "Hoffmaster", 
            image: "https://media-cdn.tripadvisor.com/media/photo-s/01/8c/c3/6c/hoffmaster-state-park.jpg", 
            description: "Squashy armchairs dirt on your nose brass scales crush the Sopophorous bean with flat side of silver dagger, releases juice better than cutting. Full moon Whomping Willow three turns should do it lemon drops. Locomotor trunks owl treats that will be 50 points, Mr. Potter. Witch Weekly, he will rise again and he will come for us, headmaster Erumpent horn. Fenrir Grayback horseless carriages ‘zis is a chance many would die for!"
            
        },
        {
            name: "Mackinaw", 
            image: "http://www.mackinawcity.com/wp-content/uploads/glm-member-db/images/grid/memb_71_tee_pee_campground_1488998697.jpeg", 
            description: "Alohamora wand elf parchment, Wingardium Leviosa hippogriff, house dementors betrayal. Holly, Snape centaur portkey ghost Hermione spell bezoar Scabbers. Peruvian-Night-Powder werewolf, Dobby pear-tickle half-moon-glasses, Knight-Bus. Padfoot snargaluff seeker: Hagrid broomstick mischief managed. Snitch Fluffy rock-cake, 9 ¾ dress robes I must not tell lies. Mudbloods yew pumpkin juice phials Ravenclaw’s Diadem 10 galleons Thieves Downfall. Ministry-of-Magic mimubulus mimbletonia Pigwidgeon knut phoenix feather other minister Azkaban. Hedwig Daily Prophet treacle tart full-moon Ollivanders You-Know-Who cursed. Fawkes maze raw-steak Voldemort Goblin Wars snitch Forbidden forest grindylows wool socks."
            
        }
    ]

function seedDB(){
    //start fresh
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
             console.log("removed campgrounds");
             
             Comment.remove({}, function(err){
                if(err){
                    console.log("Error deleting comments." + err);
                } else {
                    console.log("removed comments");
                    
                    //now add new ones.....
                    //addCampgrounds();
                }
            });
             

        }
       
    });


}

function addCampgrounds(){
    //add campgrounds
    data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
            if (err){
                console.log(err);
            } else {
                console.log("added campground");
                //create a comment
                createComment(campground);
            }
        });
    });
}

function createComment(campground){
    Comment.create(
        {
            text: "My favorite",
            author: "Me"
        }, function(err, comment){
            if(err){
                console.log(err);
            } else {
                campground.comments.push(comment._id);
                campground.save();
                console.log("comment added");
            }
        });
}

module.exports = seedDB;