

Meteor.methods({

	//Login Methods
	'logIn': function(username, password){
		if (!Users.findOne({login: true})){
			var user = Users.findOne({username: username, password: password});
			if (user){
				Users.update({username: username, password: password, login: false}, {$set: {login: true}});
			}else{
				alert("No such user!");
			};
		}else{
			alert("Please log out first!")
		};
	},


	'logOut': function(){
		Users.update({login: true}, {$set: {login: false}}, {multi: true});
	},

	//Want To Try Methods
	'addWant': function(dishName){
		if (Users.findOne({login:true})){
			var user = Users.findOne({login:true});
        	var currentUserId = user.username;
            if (!UserDishes.findOne({customerID: currentUserId, name: dishName})){
                UserDishes.insert({
                    name: dishName,
                    triedcounter: 0,
                    wanttotry: 1,
                    fav: 0,
                    comments: [],
                    customerID: currentUserId,
                })
            }else{
                UserDishes.update({customerID: currentUserId, name: dishName},
                                    {$set: {wanttotry: 1}})
            };
        }else{
        	alert("Sign up for the membership to personalize your own menu!")
        };
	},

    'removeWant': function(dishName){
        if (Users.findOne({login:true})){
        	var user = Users.findOne({login:true});
        	var currentUserId = user.username;
        	return UserDishes.update({customerID: currentUserId, name: dishName},
                                    {$set: {wanttotry: 0}}, {multi: true});
        }else{
        	alert("Sign up for the membership to personalize your own menu!")
        };
    },

	'findWant': function(){
		var user = Users.findOne({login:true});
        var currentUserId = user.username;
        if (currentUserId){
            return UserDishes.find({customerID: currentUserId, wantToTry: 1});
        };
    },


//Favourite methods
    'addFav': function(dishName){
        check(dishName, String);
        if (Users.findOne({login:true})){
        	var user = Users.findOne({login:true});
        	var currentUserId = user.username;
            if (!UserDishes.findOne({customerID: currentUserId, name: dishName})){
                UserDishes.insert({
                    name: dishName,
                    triedcounter: 1,
                    wantToTry: 0,
                    favourite: 1,
                    comments: [],
                    customerID: currentUserId,
                })
            }else{
                var dish = UserDishes.findOne({customerID: currentUserId, name: dishName});
                UserDishes.update({customerID: currentUserId, name: dishName},
                                    {$set: {favourite: 1}});
                if (dish.triedcounter == 0){
                    UserDishes.update({customerID: currentUserId, name: dishName},
                                        {$inc: {triedcounter: 1}});                    
                }
            };
        }else{
        	alert("Sign up for the membership to personalize your own menu!")
        };
    },

    'removeFav': function(dishName){
        if (Users.findOne({login:true})){
        	var user = Users.findOne({login:true});
        	var currentUserId = user.username;
        	return UserDishes.update({customerID: currentUserId, name: dishName},
                                    {$set: {favourite: 0}}, {multi: true});
        }else{
        	alert("Sign up for the membership to personalize your own menu!")
        };
    },

    'findFav': function(){
    	var user = Users.findOne({login:true});
        var currentUserId = user.username;
        if (currentUserId){
            return UserDishes.find({customerID: currentUserId, fav: 1});
        };
    },

//Past Dishes methods
    'addPast': function(dishName){
        check(dishName, String);
        var user = Users.findOne({login:true});
        var currentUserId = user.username;
        if (currentUserId){
            if (!UserDishes.findOne({customerID: currentUserId, name: dishName})){
                UserDishes.insert({
                    name: dishName,
                    triedcounter: 1,
                    wantToTry: 0,
                    favourite: 0,
                    comments: [],
                    customerID: currentUserId,
                })
            }else{
                UserDishes.update({customerID: currentUserId, name: dishName},
                                    {$inc: {triedcounter: 1}})
            };
        };
    },

    'findPast': function(){
    	var user = Users.findOne({login:true});
        var currentUserId = user.username;
        if (currentUserId){
            return UserDishes.find({customerID: currentUserId, triedcounter: {$gt: 0}});
        };
    },

    //Comment methods
    'addComment': function(comment, dishName){
        var user = Users.findOne({login:true});
        var currentUserId = user.username;
        if (currentUserId){
            if (!UserDishes.findOne({customerID: currentUserId, name: dishName})){
                UserDishes.insert({
                    name: dishName,
                    triedcounter: 1,
                    wantToTry: 0,
                    favourite: 0,
                    comments: [comment],
                    customerID: currentUserId,
                })
            }else{
                var dish = UserDishes.findOne({customerID: currentUserId, name: dishName});
                if (dish.comments == []){
                	UserDishes.update({customerID: currentUserId, name: dishName},
                                    {$set: {comments: [comment]}});
                }else{
                	UserDishes.update({customerID: currentUserId, name: dishName},
                                    {$push: {comments: comment}});
                };
                
                if (dish.triedcounter == 0){
                    UserDishes.update({customerID: currentUserId, name: dishName},
                                        {$inc: {triedcounter: 1}});                    
                }
            };
        }else{
        	alert("Sign up for the membership to personalize your own menu!")
        };
    },

    'removeComment': function(comment, dishName){
        var user = Users.findOne({login:true});
        var currentUserId = user.username;
        if (currentUserId){
            if (UserDishes.findOne({customerID: currentUserId, name: dishName})){
                UserDishes.update({customerID: currentUserId, name: dishName},
                                    {$pull: {comments: comment}});
            };
        };
    },
})
