var adminSection = FlowRouter.group({
    prefix: "/admin"
});

// for the /admin page
adminSection.route('/', {
    action: function() {}
});

// for the /admin/new-post page
adminSection.route('/new-post', {
    action: function() {}
});

var superAdminSection = adminSection.group({
    prefix: "/super"
});

superAdminSection.route('/access-control', {
    action: function() {}
})

FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {header: "top", top: "advertisement", footer: "footer"});
  }
});

FlowRouter.route('/dashboard', {
  action: function() {
    BlazeLayout.render("mainLayout", {header: "top", top: "advertisement", content: "dashboard", footer: "footer"});
  }
});

FlowRouter.route('/admin_dashboard', {
  action: function() {
    BlazeLayout.render("mainLayout", {header: "top", content: "admin_dashboard", footer: "footer"});
  }
});

FlowRouter.route('/food', {
  action: function() {
    BlazeLayout.render("mainLayout", {header: "top", content: "foodMenu", footer: "footer"});
  }
});

FlowRouter.route('/drinks', {
  action: function() {
    BlazeLayout.render("mainLayout", {header: "top", content: "drinksMenu", footer: "footer"});
  }
});

FlowRouter.route('/desserts', {
  action: function() {
    BlazeLayout.render("mainLayout", {header: "top", content: "dessertsMenu", footer: "footer"});
  }
});

FlowRouter.route('/checkout', {
  action: function() {
    BlazeLayout.render("mainLayout", {header: "top", content: "checkOut", footer: "footer"});
  }
});

FlowRouter.route('/statistics', {
  action: function() {
    BlazeLayout.render("mainLayout", {header: "top", content: "statistics", footer: "footer"});
  }
});

FlowRouter.route('/:dishId', {
  action: function() {
    BlazeLayout.render("mainLayout", {header: "top", content: "indivDish", footer: "footer"});
  }
});

// FlowRouter.route('/', {
//   triggersEnter: [function(context, redirect) {
//     redirect('/some-other-path');
//   }],
//   action: function(_params) {
//     throw new Error("this should not get called");
//   }
// });