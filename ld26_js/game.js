var info = {}
var squad = []
var current_person = 0;
var current_field = 0;

var restart_game = $.noop
var fields = [
  "action",
  "weapon",
  "armor",
  "end_turn"
];

[% WRAPPER scope %]

  var Weapon = function(options)
  {
    $.extend(this, {
      name: "",
      accuracy: 50,
      rof: 1,
      power: 1,
      ammo: 1,
    }, options);

    var self = this;
  }

  var Armor = function(options)
  {
    $.extend(this, {
      name: "",
      integ: 0,
      integ_total: 0,
      str: 1,
    }, options);

    var self = this;
  }

  [% INCLUDE "$game_js/catalogs.js" %]

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
      inventory: [],
    }, options);

    var self = this;

    self.level = function()
    {
      return self.xp / 100
    }

    var no_weapon = new Weapon({name: "None"})
    var no_armor  = new Armor({name: "None"})

    if (self.weapon == null)
      self.weapon = no_weapon
    if (self.armor == null)
      self.armor = no_armor

    self.inventory.push(no_weapon)
    self.inventory.push(no_armor)

    self.all_armor = function()
    {
      return $.grep(self.inventory, function(item)
      {
        if (item instanceof Armor)
          return true;
        return false;
      })
    }

    warn(self.all_armor())
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
  input.register_action("prev_book",  "pagedown")
  input.register_action("next_book",  "pageup")
  input.register_action("prev_field",  "shift+tab")
  input.register_action("next_field",  "tab")
  input.add_action({
    prev_book: function()
    {
      current_person--
      if (current_person < -1)
        current_person = squad.length-1
      return new Cooldown()
    },
    next_book: function()
    {
      current_person++
      if (current_person > squad.length-1)
        current_person = -1
      return new Cooldown()
    },
    prev_field: function()
    {
      current_field = (current_field - 1) % fields.length
      return new Cooldown()
    },
    next_field: function()
    {
      current_field = (current_field + 1) % fields.length
      return new Cooldown()
    },
  })


[% END %]
