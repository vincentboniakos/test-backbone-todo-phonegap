$(function(){

	// TODO Model

	var Todo = Backbone.Model.extend({

		defaults: function () {
			return {
				title: "Empty ...",
				done: false
			}
		},

		toggle: function () {
			this.save({done: !this.get("done")});
		}

	});


	// Todo Collection

	var TodoList = Backbone.Collection.extend({

		model: Todo,

		localStorage: new Backbone.LocalStorage("todos-backbone"),

	});

	var Todos = new TodoList;


	// Todo View

	var TodoView = Backbone.View.extend({

		tagName: "li",
		template: _.template($('#item-template').html()),


		events: {
			"click .toggle" : "toggleDone"
		},

		initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

		
		render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      return this;
    },

    toggleDone: function () {
    	this.model.toggle();
    }

	});

	// The application

	var AppView = Backbone.View.extend({

		el: $("#todoapp"),

		events : {
			"keydown #new-todo" : "createOnEnter"
		},

		initialize: function () {
			this.input = this.$("#new-todo");
			this.listenTo(Todos, 'add', this.addOne);
      this.listenTo(Todos, 'reset', this.addAll);
			Todos.fetch();
		},

		addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").prepend(view.render().el);
    },
		
		addAll: function () {
			Todos.each(this.addOne, this);
		},

		createOnEnter: function(e) {

			if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      Todos.create({title: this.input.val()});
      this.input.val('');
		},

		render: function () {

		},



	});

	var App = new AppView;


});