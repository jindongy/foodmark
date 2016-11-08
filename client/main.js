import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.loginForm.events({
	'submit form': function(event){
	    event.preventDefault();

	    var username = event.target.Username.value;
	    var password = event.target.Password.value;

	    Meteor.call('logIn', username, password);
	},

});

Template.top.helpers({
	isAdmin: function(){
		return Users.findOne({type: 'admin', login: true});
	},

	isMember: function(){
		return Users.findOne({type: 'member', login: true});
	},

	isLogout: function(){
		if (Users.findOne({login: true})){
			return false;
		}else{
			return true;
		};
	},

	isLogin: function(){
		return Users.findOne({login: true});
	},

	isCustomer: function(){
		if (Users.findOne({type: 'admin', login: true})){
			return false;
		}else{
			return true;
		};
	},

});

Template.top.events({
	'click .checkouting': function(){
		alert('Checkout Successful');
	},

	'click .cart': function(){
		alert('Cart No Items');
	},

	'click .logout': function(){
		Meteor.call('logOut');
		FlowRouter.go('/');
		alert('Logout Successful');
	},

});


Template.dashboard.helpers({

	isAdmin: function(){
		return Users.findOne({type: 'admin', login: true});
	},

	isMember: function(){
		return Users.findOne({type: 'member', login: true});
	},

	isLogout: function(){
		if (Users.findOne({login: true})){
			return false;
		}else{
			return true;
		};
	},

	isLogin: function(){
		return Users.findOne({login: true});
	},

});

Template.admin_dashboard.helpers({
	customer: function(){
		var customerName = Session.get('customerName');
		return Users.findOne({username: customerName})
	},

	wanttotryItem: function(){
		var customerName = Session.get('customerName');
		var userdishes = UserDishes.find({customerID: customerName, wanttotry: 1}, {sort: {name: 1}}).fetch();
      	var distinctdishes = _.uniq(userdishes, false, function(d){return d.name});
      	var distinctValues = _.pluck(distinctdishes, 'name');
      	return Dishes.find({name: {$in: distinctValues}})
	},

	favouriteItem: function(){
    	var customerName = Session.get('customerName');
      	var userdishes = UserDishes.find({customerID: customerName, favourite: 1}, {sort: {name: 1}}).fetch();
      	var distinctdishes = _.uniq(userdishes, false, function(d){return d.name});
      	var distinctValues = _.pluck(distinctdishes, 'name');
      	return Dishes.find({name: {$in: distinctValues}})

    },

    triedItem: function(){
    	var customerName = Session.get('customerName');
      	return UserDishes.find({customerID: customerName, triedcounter: {$gt: 0}});
    },

    triedItem2: function(){
    	var dishName = this.name;
    	return Dishes.findOne({name: dishName});
    },

    commentedItem: function(){
    	var customerName = Session.get('customerName');
      	return UserDishes.find({customerID: 'Dong', comments: { $exists: true, $ne: [] }});
    },

    commentedItem2: function(){
    	var dishName = this.name;
    	return Dishes.findOne({name: dishName});
    },
});

Template.admin_dashboard.events({
  'submit .findCustomer'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
 
	Session.set('customerName', text);

    // Clear form
    target.text.value = '';
  },

  'click .clear':function(){
  	Session.set('customerName', '');
  },

});

Template.carousel_wanttotry.helpers({
     wanttotryItem: function(){
    	var user = Users.findOne({login:true});
      	var userdishes = UserDishes.find({customerID: user.username, wanttotry: 1}, {sort: {name: 1}}).fetch();
      	var distinctdishes = _.uniq(userdishes, false, function(d){return d.name});
      	var distinctValues = _.pluck(distinctdishes, 'name');
      	return Dishes.find({name: {$in: distinctValues}})
    	},
});

Template.wanttotryItems.helpers({
    wanttotryItem: function(){
    	var user = Users.findOne({login:true});
      	var userdishes = UserDishes.find({customerID: user.username, wanttotry: 1}, {sort: {name: 1}}).fetch();
      	var distinctdishes = _.uniq(userdishes, false, function(d){return d.name});
      	var distinctValues = _.pluck(distinctdishes, 'name');
      	return Dishes.find({name: {$in: distinctValues}})

    },

    isActive: function () {
    	if (this.index === 0){
    		console.log(this.index);
    		return "active";
    	}else{
    		return "";
    	};
  	},
});

Template.wanttotryItems.events({
	'click .cart': function(){
		alert('Added Successfully!');
	},
});


Template.carousel_favourite.helpers({
     favouriteItem: function(){
    	var user = Users.findOne({login:true});
      	var userdishes = UserDishes.find({customerID: user.username, favourite: 1}, {sort: {name: 1}}).fetch();
      	var distinctdishes = _.uniq(userdishes, false, function(d){return d.name});
      	var distinctValues = _.pluck(distinctdishes, 'name');
      	return Dishes.find({name: {$in: distinctValues}})

    },
});

Template.favouriteItems.helpers({
    favouriteItem: function(){
    	var user = Users.findOne({login:true});
      	var userdishes = UserDishes.find({customerID: user.username, favourite: 1}, {sort: {name: 1}}).fetch();
      	var distinctdishes = _.uniq(userdishes, false, function(d){return d.name});
      	var distinctValues = _.pluck(distinctdishes, 'name');
      	return Dishes.find({name: {$in: distinctValues}})

    },

    isActive: function () {
    	if (this.index < 4){
    		console.log(this.index);
    		return "active";
    	}else{
    		return "";
    	};
  	},
});

Template.favouriteItems.events({
	'click .cart': function(){
		alert('Added Successfully!');
	},
});

Template.foodMenu.helpers({
	foodItem: function(){
		return Dishes.find({type: "mains"});
	},

	isFavourited: function(){
		var dishName = this.name;
		var user = Users.findOne({login:true});
		return UserDishes.findOne({customerID: user.username, name: dishName, favourite: 1});
	},

	isWantToTry: function(){
		var dishName = this.name;
		var user = Users.findOne({login:true});
		return UserDishes.findOne({customerID: user.username, name: dishName, wanttotry: 1});
	},
});

Template.foodMenu.events({
	'click .cart': function(){
		alert('Added Successfully!');
	},

	'click .fav': function(){
		var dishName = this.name;
		Meteor.call('addFav', dishName);
	},

	'click .unfav': function(){
		var dishName = this.name;
		Meteor.call('removeFav', dishName);
	},

	'click .want': function(){
		var dishName = this.name;
		Meteor.call('addWant', dishName);
	},

	'click .unwant':function(){
		var dishName = this.name;
		Meteor.call('removeWant', dishName);
	},

	'click .seemore': function(){
		var dishName = this.name;
		FlowRouter.go("/"+dishName);
	},
});

Template.drinksMenu.helpers({
	drinkItem: function(){
		return Dishes.find({type: "drink"});
	},

	isFavourited: function(){
		var dishName = this.name;
		var user = Users.findOne({login:true});
		return UserDishes.findOne({customerID: user.username, name: dishName, favourite: 1});
	},

	isWantToTry: function(){
		var dishName = this.name;
		var user = Users.findOne({login:true});
		return UserDishes.findOne({customerID: user.username, name: dishName, wanttotry: 1});
	},
});

Template.drinksMenu.events({
	'click .cart': function(){
		alert('Added Successfully!');
	},

	'click .fav': function(){
		var dishName = this.name;
		Meteor.call('addFav', dishName);
	},

	'click .unfav': function(){
		var dishName = this.name;
		console.log(dishName);
		Meteor.call('removeFav', dishName);
	},

	'click .want': function(){
		var dishName = this.name;
		Meteor.call('addWant', dishName);
	},

	'click .unwant':function(){
		var dishName = this.name;
		Meteor.call('removeWant', dishName);
	},
	'click .seemore': function(){
		var dishName = this.name;
		FlowRouter.go("/"+dishName);
	},

});

Template.dessertsMenu.helpers({
	dessertItem: function(){
		return Dishes.find({type: "dessert"});
	},

	isFavourited: function(){
		var dishName = this.name;
		var user = Users.findOne({login:true});
		return UserDishes.findOne({customerID: user.username, name: dishName, favourite: 1});
	},

	isWantToTry: function(){
		var dishName = this.name;
		var user = Users.findOne({login:true});
		return UserDishes.findOne({customerID: user.username, name: dishName, wanttotry: 1});
	},
});

Template.dessertsMenu.events({
	'click .cart': function(){
		alert('Added Successfully!');
	},

	'click .fav': function(){
		var dishName = this.name;
		Meteor.call('addFav', dishName);
	},

	'click .unfav': function(){
		var dishName = this.name;
		console.log(dishName);
		Meteor.call('removeFav', dishName);
	},

	'click .want': function(){
		var dishName = this.name;
		Meteor.call('addWant', dishName);
	},

	'click .unwant':function(){
		var dishName = this.name;
		Meteor.call('removeWant', dishName);
	},

	'click .seemore': function(){
		var dishName = this.name;
		FlowRouter.go("/"+dishName);
	},
});

Template.indivDish.helpers({
	dish: function(){
		var dishName = FlowRouter.getParam('dishId');
		return Dishes.findOne({name: dishName});
	},

	commentDish: function(){
		var dishName = this.name;
		var user = Users.findOne({login:true});
		return UserDishes.findOne({name: dishName, customerID: user.username})
	},

	selectedComment: function(){
		var comment = Session.get('comment');
		var user = Users.findOne({login: true});
		var dishName = FlowRouter.getParam('dishId');

		return UserDishes.findOne({customerID: user.username, name: dishName, comments: comment})
		
	},

	selectedClass: function(){
		var comment = this;
		var selectedComment = Session.get('comment');
		if (comment == selectedComment){
			return "selected";
		}else{
			return "nothing";
		};
	},

});

Template.indivDish.events({
	'click .carting': function(){
		alert('Added Successfully!');
	},

	'submit form': function(event){
	    event.preventDefault();

	    var comment = event.target.comment.value;
	    var dishName = FlowRouter.getParam('dishId');
	    Meteor.call('addComment', comment, dishName);

	    // Clear form
    	event.target.comment.value = '';
	},

	'click .comment':function(){
		var comment = this.toString();
		if (comment == Session.get('comment')){
			Session.set('comment', 'nothing')
		}else{
			Session.set('comment', comment);
		};
	},

	'click .remove': function(){
		var comment = Session.get('comment');
		var dishName = FlowRouter.getParam('dishId');
		var user = Users.findOne({login: true});
		Meteor.call('removeComment', comment, dishName);
	}
});
