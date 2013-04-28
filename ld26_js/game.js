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

[% END %]
