Users = new Mongo.Collection('useraccounts');
Dishes = new Mongo.Collection('menudishes');
UserDishes = new Mongo.Collection('userdishes');
DishesOrdered = new Mongo.Collection('dishesordered');

// Users.insert({username: 'foodmark', password: 'ilovefoodmark', type: 'admin', login: false})
// Users.insert({username: 'jindongyang', password: 'ilovefoodmark', type: 'member', login: false})


//UserDishes.insert({name: 'Pork Ribs', price: '$14.90', createdBy: 'jindongyang', wanttotry: true, fav: false, comments: [], imageURL: "/public/images/home/recommend1.jpg"})
//UserDishes.insert({name: 'Ribs', price: '$14.90', createdBy: 'jindongyang', wanttotry: true, fav: false, comments: [], imageURL: "/public/images/home/recommend1.jpg"})