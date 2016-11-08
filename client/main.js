import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
Meteor.startup(function() {
	Session.set('login', false);
	Session.set('user', '');
});

Template.loginForm.events({
	'submit form': function(event){
	    event.preventDefault();

	    var username = event.target.Username.value;
	    var password = event.target.Password.value;


	    if (Session.get('login') == false){
	    	if (Users.findOne({username: username, password: password})){
		    	Session.set('user', username);
		    	Session.set('login', true);
		    	if (Users.findOne({username: username, type: 'Admin'})){
		    		Bert.alert("Login Successful! Welcome Adminstrator!", "success", "fixed-top", "fa-smile-o");
		    	}else{
		    		Bert.alert("Login Successful! Welcome "+username+"!", "success", "fixed-top", "fa-smile-o");
		    	};
		    }else{
		    	Bert.alert("No such user!", 'warning', 'growl-top-right');
		    };
	    }else{
	    	Bert.alert("Please log out first!", 'warning', 'growl-top-right')
	    }
	},

});

Template.top.helpers({
	isAdmin: function(){
		var username = Session.get('user');
		return Users.findOne({username: username, type: 'admin'});
	},

	isMember: function(){
		var username = Session.get('user');
		return Users.findOne({username: username, type: 'member'});
	},

	isLogout: function(){
		if (Session.get('login')){
			return false;
		}else{
			return true;
		}
	},

	isLogin: function(){
		return Session.get('login');
	},

	isCustomer: function(){
		var username = Session.get('user');
		if (Session.get('login')){
			if (Users.findOne({type: 'admin', username: username})){
				return false;
			}else{
				return true;
			};
		}else{
			return false;
		};
		
	},

	username: function(){
		return Session.get('user');
	}

});

Template.top.events({
	'click .checkouting': function(){
		Bert.alert('Checkout Successful', 'success', 'growl-top-right');
	},

	'click .cart': function(){
		Bert.alert('Cart Not Functionable', 'warning', 'growl-top-right');
	},

	'click .logout': function(){
		Session.set('login', false);
		Session.set('user', '');
		FlowRouter.go('/');
		Bert.alert({
			icon: "fa-frown-o",
    		message: "Logged out. See you next time!", 
    		type: 'danger', 
    		style: 'fixed-top'});
	},

});


Template.dashboard.helpers({

	isAdmin: function(){
		var username = Session.get('user');
		return Users.findOne({username: username, type: 'admin'});
	},

	isMember: function(){
		var username = Session.get('user');
		return Users.findOne({username: username, type: 'member'});
	},

	isLogout: function(){
		return Session.get('login');
	},

	isLogin: function(){
		return Session.get('login');
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
      	return UserDishes.find({customerID: customerName, comments: { $exists: true, $ne: [] }});
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
     	var username = Session.get('user');
    	var user = Users.findOne({username: username});
      	var userdishes = UserDishes.find({customerID: user.username, wanttotry: 1}, {sort: {name: 1}}).fetch();
      	var distinctdishes = _.uniq(userdishes, false, function(d){return d.name});
      	var distinctValues = _.pluck(distinctdishes, 'name');
      	return Dishes.find({name: {$in: distinctValues}})
    	},
});

Template.wanttotryItems.helpers({
    wanttotryItem: function(){
    	var username = Session.get('user');
    	var user = Users.findOne({username: username});
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
		Bert.alert('Added Successfully!', 'success', 'growl-top-right');
	},
});


Template.carousel_favourite.helpers({
     favouriteItem: function(){
     	var username = Session.get('user');
    	var user = Users.findOne({username: username});
      	var userdishes = UserDishes.find({customerID: user.username, favourite: 1}, {sort: {name: 1}}).fetch();
      	var distinctdishes = _.uniq(userdishes, false, function(d){return d.name});
      	var distinctValues = _.pluck(distinctdishes, 'name');
      	return Dishes.find({name: {$in: distinctValues}})

    },
});

Template.favouriteItems.helpers({
    favouriteItem: function(){
    	var username = Session.get('user');
    	var user = Users.findOne({username: username});
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
		Bert.alert('Added Successfully!', 'success', 'growl-top-right');
	},
});

Template.foodMenu.helpers({
	foodItem: function(){
		return Dishes.find({type: "mains"});
	},

	isFavourited: function(){
		var dishName = this.name;
		var username = Session.get('user');
		var user = Users.findOne({username: username});
		return UserDishes.findOne({customerID: user.username, name: dishName, favourite: 1});
	},

	isWantToTry: function(){
		var dishName = this.name;
		var username = Session.get('user');
		var user = Users.findOne({username: username});
		return UserDishes.findOne({customerID: user.username, name: dishName, wanttotry: 1});
	},

	isTried: function(){
		var dishName = this.name;
		var username = Session.get('user');
		var user = Users.findOne({username: username});
		return UserDishes.findOne({customerID: user.username, name: dishName, triedcounter: {$gt: 0}});
	},
});

Template.foodMenu.events({
	'click .cart': function(){
		Bert.alert('Added Successfully!', 'success', 'growl-top-right');
	},

	'click .fav': function(){
		var dishName = this.name;
		var username = Session.get('user');
		Meteor.call('addFav', dishName, username);
	},

	'click .unfav': function(){
		var dishName = this.name;
		var username = Session.get('user');
		Meteor.call('removeFav', dishName, username);
	},

	'click .want': function(){
		var dishName = this.name;
		var username = Session.get('user');
		Meteor.call('addWant', dishName, username);
	},

	'click .unwant':function(){
		var dishName = this.name;
		var username = Session.get('user');
		Meteor.call('removeWant', dishName, username);
	},

	'click .seemore': function(){
		var dishName = this.name;
		FlowRouter.go("/"+dishName);
	},

	'click. tried': function(){
		Bert.alert("You have already tried before!", "info", 'growl-top-right');
	},
});

Template.drinksMenu.helpers({
	drinkItem: function(){
		return Dishes.find({type: "drink"});
	},

	isFavourited: function(){
		var dishName = this.name;
		var username = Session.get('user');
		var user = Users.findOne({username: username});
		return UserDishes.findOne({customerID: user.username, name: dishName, favourite: 1});
	},

	isWantToTry: function(){
		var dishName = this.name;
		var username = Session.get('user');
		var user = Users.findOne({username: username});
		return UserDishes.findOne({customerID: user.username, name: dishName, wanttotry: 1});
	},

	isTried: function(){
		var dishName = this.name;
		var username = Session.get('user');
		var user = Users.findOne({username: username});
		return UserDishes.findOne({customerID: user.username, name: dishName, triedcounter: {$gt: 0}});
	},
});

Template.drinksMenu.events({
	'click .cart': function(){
		Bert.alert('Added Successfully!', 'success', 'growl-top-right');
	},

	'click .fav': function(){
		var dishName = this.name;
		var username = Session.get('user');
		Meteor.call('addFav', dishName, username);
	},

	'click .unfav': function(){
		var dishName = this.name;
		var username = Session.get('user');
		Meteor.call('removeFav', dishName, username);
	},

	'click .want': function(){
		var dishName = this.name;
		var username = Session.get('user');
		Meteor.call('addWant', dishName, username);
	},

	'click .unwant':function(){
		var dishName = this.name;
		var username = Session.get('user');
		Meteor.call('removeWant', dishName, username);
	},
	'click .seemore': function(){
		var dishName = this.name;
		FlowRouter.go("/"+dishName);
	},

	'click. tried': function(){
		Bert.alert("You have already tried before!", "info", 'growl-top-right');
	},

});

Template.dessertsMenu.helpers({
	dessertItem: function(){
		return Dishes.find({type: "dessert"});
	},

	isFavourited: function(){
		var dishName = this.name;
		var username = Session.get('user');
		var user = Users.findOne({username: username});
		return UserDishes.findOne({customerID: user.username, name: dishName, favourite: 1});
	},

	isWantToTry: function(){
		var dishName = this.name;
		var username = Session.get('user');
		var user = Users.findOne({username: username});
		return UserDishes.findOne({customerID: user.username, name: dishName, wanttotry: 1});
	},

	isTried: function(){
		var dishName = this.name;
		var username = Session.get('user');
		var user = Users.findOne({username: username});
		return UserDishes.findOne({customerID: user.username, name: dishName, triedcounter: {$gt: 0}});
	},
});

Template.dessertsMenu.events({
	'click .cart': function(){
		Bert.alert('Added Successfully!', 'success', 'growl-top-right');
	},

	'click .fav': function(){
		var dishName = this.name;
		var username = Session.get('user');
		Meteor.call('addFav', dishName, username);
	},

	'click .unfav': function(){
		var dishName = this.name;
		var username = Session.get('user');
		Meteor.call('removeFav', dishName, username);
	},

	'click .want': function(){
		var dishName = this.name;
		var username = Session.get('user');
		Meteor.call('addWant', dishName, username);
	},

	'click .unwant':function(){
		var dishName = this.name;
		var username = Session.get('user');
		Meteor.call('removeWant', dishName, username);
	},

	'click .seemore': function(){
		var dishName = this.name;
		FlowRouter.go("/"+dishName);
	},

	'click. tried': function(){
		Bert.alert("You have already tried before!", "info", 'growl-top-right');
	},
});

Template.indivDish.helpers({
	dish: function(){
		var dishName = FlowRouter.getParam('dishId');
		return Dishes.findOne({name: dishName});
	},

	commentDish: function(){
		var dishName = this.name;
		var username = Session.get('user');
		var user = Users.findOne({username: username});
		return UserDishes.findOne({name: dishName, customerID: user.username})
	},

	selectedComment: function(){
		var comment = Session.get('comment');
		var username = Session.get('user');
		var user = Users.findOne({username: username});
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
		Bert.alert('Added Successfully!', 'success', 'growl-top-right');
	},

	'submit form': function(event){
	    event.preventDefault();

	    var comment = event.target.comment.value;
	    var dishName = FlowRouter.getParam('dishId');
	    var username = Session.get('user');
	    Meteor.call('addComment', comment, dishName, username);

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
		var username = Session.get('user');
		var user = Users.findOne({username: username});
		Meteor.call('removeComment', comment, dishName, username);
	}
});

Array.prototype.SumArray = function (arr) {
    var sum = [];
    if (arr != null && this.length == arr.length) {
        for (var i = 0; i < arr.length; i++) {
            sum.push(this[i] + arr[i]);
        };
    };

    return sum;
};

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
};

var Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

Template.statistics.helpers({
	createMainsChart: function () {
	  // Gather data: 
	  	var dishNames = Dishes.find({type: 'mains'}).map(function(dish) {
	  		return dish.name;
	  	});

	  	var count = dishNames.length

		var result1 = [];
		for (var i = 0; i<count; i++){
			var dishName = dishNames[i];
			dishName = dishName.toString();
			var total = UserDishes.find({name: dishName, wanttotry: 1}).count();
			result1.push(total);
		};
		var wanttotryMain = result1;

		var result2 = [];
		for (var i = 0; i<count; i++){
			var dishName = dishNames[i];
			dishName = dishName.toString();
			var total = UserDishes.find({name: dishName, favourite: 1}).count();
			result2.push(total);
		};
		var favMain = result2;

	  // Use Meteor.defer() to craete chart after DOM is ready:
	  Meteor.defer(function() {
	    // Create standard Highcharts chart with options:
	    Highcharts.chart('mainschart', {
	      chart: {
            type: 'column'
        },
        title: {
            text: 'Popularity of Main Dishes'
        },
        subtitle: {
            text: 'Determined by Number of Bookmarks'
        },
        xAxis: {
            categories: dishNames,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Members'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} members</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Want To Try',
            data: wanttotryMain

        }, {
            name: 'Favourite',
            data: favMain

        }]

	    });
	  });
	},

	createDrinksChart: function () {
	  // Gather data: 
	  	var dishNames = Dishes.find({type: 'drink'}).map(function(dish) {
	  		return dish.name;
	  	});

	  	var count = dishNames.length

		var result1 = [];
		for (var i = 0; i<count; i++){
			var dishName = dishNames[i];
			dishName = dishName.toString();
			var total = UserDishes.find({name: dishName, wanttotry: 1}).count();
			result1.push(total);
		};
		var wanttotryDrink = result1;

		var result2 = [];
		for (var i = 0; i<count; i++){
			var dishName = dishNames[i];
			dishName = dishName.toString();
			var total = UserDishes.find({name: dishName, favourite: 1}).count();
			result2.push(total);
		};
		var favDrink = result2;

	  // Use Meteor.defer() to craete chart after DOM is ready:
	  Meteor.defer(function() {
	    // Create standard Highcharts chart with options:
	    Highcharts.chart('drinkschart', {
	      chart: {
            type: 'column'
        },
        title: {
            text: 'Popularity of Drinks'
        },
        subtitle: {
            text: 'Determined by Number of Bookmarks'
        },
        xAxis: {
            categories: dishNames,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Members'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} members</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Want To Try',
            data: wanttotryDrink

        }, {
            name: 'Favourite',
            data: favDrink

        }]

	    });
	  });
	},

	createDessertsChart: function () {
	  // Gather data: 
	  	var dishNames = Dishes.find({type: 'dessert'}).map(function(dish) {
	  		return dish.name;
	  	});

	  	var count = dishNames.length

		var result1 = [];
		for (var i = 0; i<count; i++){
			var dishName = dishNames[i];
			dishName = dishName.toString();
			var total = UserDishes.find({name: dishName, wanttotry: 1}).count();
			result1.push(total);
		};
		var wanttotryDessert = result1;

		var result2 = [];
		for (var i = 0; i<count; i++){
			var dishName = dishNames[i];
			dishName = dishName.toString();
			var total = UserDishes.find({name: dishName, favourite: 1}).count();
			result2.push(total);
		};
		var favDessert = result2;

	  // Use Meteor.defer() to craete chart after DOM is ready:
	  Meteor.defer(function() {
	    // Create standard Highcharts chart with options:
	    Highcharts.chart('dessertschart', {
	      chart: {
            type: 'column'
        },
        title: {
            text: 'Popularity of Desserts'
        },
        subtitle: {
            text: 'Determined by Number of Bookmarks'
        },
        xAxis: {
            categories: dishNames,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Members'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} members</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Want To Try',
            data: wanttotryDessert

        }, {
            name: 'Favourite',
            data: favDessert

        }]

	    });
	  });
	},

	createSalesChart: function () {
	  // Gather data: 
	  	var times = Orders.find().map(function(order) {
	  		return order.time;
	  	});

	  	var times = times.getUnique();
	  	var count = times.length;

	  	result = []
	  	for (var i = 0; i<count; i++){
	  		time = times[i];
	  		var sales = Orders.find({time: time}).map(function(sale) {
	  		return sale.price;
	  		});

	  		var sum = sales.reduce(function(a, b) {
						  return a + b;
						}, 0);
	  		result.push(sum);
	  	}

	  // Use Meteor.defer() to craete chart after DOM is ready:
	  Meteor.defer(function() {
	    // Create standard Highcharts chart with options:
	    Highcharts.chart('saleschart', {
	      title: {
            text: 'In-Restaurant Sales For Today',
            x: -20 //center
        },
        subtitle: {
            text: 'Sales Aggregated from In-House Orders Today',
            x: -20
        },
        xAxis: {
            categories: times
        },
        yAxis: {
            title: {
                text: 'Sales Generated'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#000080'
            }]
        },
        tooltip: {
            valueSuffix: '$'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Sales',
            data: result
        }]

	    });
	  });
	},

});

Highcharts.createElement('link', {
   href: 'https://fonts.googleapis.com/css?family=Signika:400,700',
   rel: 'stylesheet',
   type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

// Add the background image to the container
Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function (proceed) {
   proceed.call(this);
   this.container.style.background = 'url(http://www.highcharts.com/samples/graphics/sand.png)';
});


Highcharts.theme = {
   colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
      '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
   chart: {
      backgroundColor: null,
      style: {
         fontFamily: 'Signika, serif'
      }
   },
   title: {
      style: {
         color: 'black',
         fontSize: '16px',
         fontWeight: 'bold'
      }
   },
   subtitle: {
      style: {
         color: 'black'
      }
   },
   tooltip: {
      borderWidth: 0
   },
   legend: {
      itemStyle: {
         fontWeight: 'bold',
         fontSize: '13px'
      }
   },
   xAxis: {
      labels: {
         style: {
            color: '#6e6e70'
         }
      }
   },
   yAxis: {
      labels: {
         style: {
            color: '#6e6e70'
         }
      }
   },
   plotOptions: {
      series: {
         shadow: true
      },
      candlestick: {
         lineColor: '#404048'
      },
      map: {
         shadow: false
      }
   },

   // Highstock specific
   navigator: {
      xAxis: {
         gridLineColor: '#D0D0D8'
      }
   },
   rangeSelector: {
      buttonTheme: {
         fill: 'white',
         stroke: '#C0C0C8',
         'stroke-width': 1,
         states: {
            select: {
               fill: '#D0D0D8'
            }
         }
      }
   },
   scrollbar: {
      trackBorderColor: '#C0C0C8'
   },

   // General
   background2: '#E0E0E8'

};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
