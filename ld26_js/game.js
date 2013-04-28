var info = {}
var squad = []
var current_person = 0;

var restart_game = $.noop

[% WRAPPER scope %]

  var Person = function(options)
  {
    $.extend(this, {
      name: "",
      pos: {x: 0, y: 0},
      xp: 0,
      hp: 10,
      hp_total: 10,
      ammo: 1,
      ammo_total: 1,
      speed: 5,
      accuracy: 70,
      ev: 7,
      weapon: null,
      armor: null,
    }, options);

    var self = this;

    self.level = function()
    {
      return self.xp / 100
    }
  }

  restart_game = function()
  {
    info = {}
    squad = []

    for (var i = 0; i < 8; i++)
    {
      squad.push(new Person({
        name: i,
      }))
    }
  }

  restart_game()

  var input = new Input({listen: true})
  input.register_action("prev_book",  "pageup")
  input.register_action("next_book",  "pagedown")
  input.add_action({
    prev_book: function()
    {
      current_person = max(current_person-1, -1)
      return new Cooldown()
    },
    next_book: function()
    {
      current_person = min(current_person+1, squad.length-1)
      return new Cooldown()
    },
  })


[% END %]
