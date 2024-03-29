var info = {}
var squad = []
var current_person = 0;
var current_field = 0;
var current_turn = 1;

var restart_game = $.noop
var fields = [
  "action",
  "weapon",
  "armor",
  "end_turn"
];

var exit = null

[% WRAPPER scope %]

  var rng = new lprng(null);

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
      str: 1,
    }, options);

    var self = this;
    self.integ_total = self.integ
  }

  [% INCLUDE "$game_js/catalogs.js" %]

  var Person = function(options)
  {
    $.extend(this, {
      name: "",
      pos: {x: 0, y: 0},
      xp: 0,
      hp: 10,
      ammo: 4,
      speed: 5,
      accuracy: 70,
      ev: 7,
      weapon: null,
      armor: null,
      inventory: [],
      action: "Explore",

      enemy: null,
    }, options);

    var self = this;

    self.hp_total = self.hp
    self.ammo_total = self.ammo

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

    // Add the None items
    self.inventory.push(no_weapon)
    self.inventory.push(no_armor)

    // Add default items
    $.each(weapon_catalog, function(i, weapon)
    {
      self.inventory.push(new Weapon(weapon))
    })
    $.each(armor_catalog, function(i, armor)
    {
      self.inventory.push(new Armor(armor))
    })

    self.all_weapon = function()
    {
      return $.grep(self.inventory, function(item)
      {
        if (item instanceof Weapon)
          return true;
        return false;
      })
    }

    self.all_armor = function()
    {
      return $.grep(self.inventory, function(item)
      {
        if (item instanceof Armor)
          return true;
        return false;
      })
    }

    self.all_inventory = function()
    {
      return $.merge([], self.inventory)
    }

    self.all_action = function()
    {
      var results = [
        "Nothing",
      ]
      if (self.enemy != undefined)
      {
        results.push("Retreat")
        results.push("Attack")
      }
      else
      {
        results.push("Explore")
      }

      if (exit != undefined)
      {
        if (self.pos.x == exit.x && self.pos.y == exit.y)
        {
          results.push("Exit")
        }
        else
        {
          if (self.enemy == undefined)
            results.push("Head to Exit")
        }
      }
      return results
    }

    self.set_armor = function (i)
    {
      var all = self.all_armor()
      var armor = all[i]
      if (armor == undefined)
        armor = no_armor
      self.armor = armor
      return armor
    }

    self.next_armor = function()
    {
      var all = self.all_armor()
      var cur_i = -1
      $.each(all, function(i, armor)
      {
        if (armor == self.armor)
        {
          cur_i = i;
          return false;
        }
      })
      self.set_armor(cur_i + 1 % all.length)
    }

    self.prev_armor = function()
    {
      var all = self.all_armor()
      var cur_i = -1
      $.each(all, function(i, armor)
      {
        if (armor == self.armor)
        {
          cur_i = i;
          return false;
        }
      })
      if (cur_i <= 0)
        cur_i = all.length

      self.set_armor(cur_i - 1 % all.length)
    }

    self.set_weapon = function (i)
    {
      var all = self.all_weapon()
      var weapon = all[i]
      if (weapon == undefined)
        weapon = no_weapon
      self.weapon = weapon
      return weapon
    }

    self.next_weapon = function()
    {
      var all = self.all_weapon()
      var cur_i = -1
      $.each(all, function(i, weapon)
      {
        if (weapon == self.weapon)
        {
          cur_i = i;
          return false;
        }
      })
      self.set_weapon(cur_i + 1 % all.length)
    }

    self.prev_weapon = function()
    {
      var all = self.all_weapon()
      var cur_i = -1
      $.each(all, function(i, weapon)
      {
        if (weapon == self.weapon)
        {
          cur_i = i;
          return false;
        }
      })
      if (cur_i <= 0)
        cur_i = all.length

      self.set_weapon(cur_i - 1 % all.length)
    }

    self.set_action = function (i)
    {
      var all = self.all_action()
      var action = all[i]
      if (action == undefined)
        action = "Nothing"
      self.action = action
      return action
    }

    self.next_action = function()
    {
      var all = self.all_action()
      var cur_i = -1
      $.each(all, function(i, action)
      {
        if (action == self.action)
        {
          cur_i = i;
          return false;
        }
      })
      self.set_action(cur_i + 1 % all.length)
    }

    self.prev_action = function()
    {
      var all = self.all_action()
      var cur_i = -1
      $.each(all, function(i, action)
      {
        if (action == self.action)
        {
          cur_i = i;
          return false;
        }
      })
      if (cur_i <= 0)
        cur_i = all.length

      self.set_action(cur_i - 1 % all.length)
    }

    // Actions

    self.Nothing = function() {}

    self.Explore = function()
    {
      var x_move = ceil(rng.random(self.speed * 2) - self.speed)
      var y_max  = floor(Math.sqrt(self.speed * self.speed - x_move * x_move))
      var y_move = ceil(rng.random(y_max * 2) - y_max)
      self.pos.x += x_move
      self.pos.y += y_move

      // Generate an exit?
      if (exit == undefined && rng.random(100) < 5)
      {
        exit = $.extend({}, self.pos)
      }

      if (rng.random(100) < 40)
      {
        self.enemy = new Person(rng.choose(
          [
            {
              name: "A rat",
              pos: $.extend({}, self.pos),
              speed: 10,
              ev: 10,
              weapon: { name: "Whiskers", accuracy: 40, rof: 1, power: 2, ammo: 1},
              enemy: self,
            },
            {
              name: "A Quokka",
              pos: $.extend({}, self.pos),
              ev: 12,
              accuracy: 75,
              weapon: { name: "Claws", accuracy: 50, rof: 1, power: 6, ammo: 1},
              armor: {name: "Skin", integ: 10, str: 2},
              enemy: self,
            },
            {
              name: "A Dragon",
              pos: $.extend({}, self.pos),
              speed: 3,
              ev: 10,
              accuracy: 85,
              ammo: 5,
              weapon: { name: "Claws", accuracy: 80, rof: 1, power: 14, ammo: 2},
              armor: {name: "Scales", integ: 12, str: 4},
              enemy: self,
            },
            {
              name: "A wild bug",
              pos: $.extend({}, self.pos),
              enemy: self,
            },
            {
              name: "A Potato",
              pos: $.extend({}, self.pos),
              enemy: self,
            },
          ])
        )
      }
    }

    self.Retreat = function(no_explore)
    {
      var e = self.enemy

      if (rng.random(e.ev + self.ev) < self.ev)
      {
        self.enemy = null
        if (!no_explore)
          self.Explore()
      }
    }

    self.Attack = function()
    {
      if (self.enemy == undefined)
        return

      var e = self.enemy

      for (var i = 0; i < self.weapon.rof; i++)
      {
        if (self.ammo < self.weapon.ammo)
          break

        // 75 self accuracy gives you the weapon's accuracy
        var accuracy = (self.accuracy / 75) * self.weapon.accuracy
        if (rng.random(100 + e.ev) < accuracy)
        {
          var dmg = self.weapon.power

          if (e.armor.integ > 0)
          {
            dmg = dmg - floor(rng.random(e.armor.str))
          }

          // If the armor took the entire dmg, it's integrety goes down
          if (dmg < 0)
          {
            e.armor.integ--
            dmg = 0
          }

          e.hp -= dmg

          if (e.hp < 0)
          {
            e.enemy = null
            self.enemy = null
            self.xp += 10
          }
        }
      }
    }

    self["Head to Exit"] = function()
    {
      if (self.enemy != undefined)
        self.Retreat(true)

      if (self.enemy != undefined)
        return

      var x_move = exit.x - self.pos.x
      var y_move = exit.y - self.pos.y
      var length = Math.sqrt((x_move * x_move) + (y_move * y_move))
      if (length > self.speed)
      {
        var ratio  = self.speed / length

        x_move = floor(x_move * ratio)
        y_move = floor(y_move * ratio)
      }

      warn(x_move, y_move, Math.sqrt(x_move * x_move + y_move * y_move))
      self.pos.x += x_move
      self.pos.y += y_move

    }

    self.Exit = function()
    {
      $.each(squad, function(i, p)
      {
        if (p.pos.x != exit.x || p.pos.y != exit.y)
        {
          p.upstairs = true
          p.hp = 0
        }
      })

      var scores = [
        squad[0].upstairs ? 0 : squad[0].xp + squad[0].hp,
        squad[1].upstairs ? 0 : squad[1].xp + squad[1].hp,
        squad[2].upstairs ? 0 : squad[2].xp + squad[2].hp,
        squad[3].upstairs ? 0 : squad[3].xp + squad[3].hp,
      ]

      var total = 0
      var multi = 0
      $.each(scores, function(i, v)
      {
        if (v > 0)
          multi++
        total += v
      })

      $("<div/>")
        .addClass("modal")
        .append($("<div/>")
          .addClass("modal-header")
          .append('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>')
          .append("<h1>Congratulations</h1>")
        )
        .append($("<div/>")
          .addClass("modal-body")
          .append("<h2>You have successfully exited</h2>")
          .append("<h3>Your Score:</h3>")
          .append($("<dl class='dl-horizontal'>")
            .append("<dt>Squad member '" + squad[0].name + "'</dt>")
            .append("<dd>" + (squad[0].upstairs ? "0 (left upstairs)" : scores[0]) + "</dd>")
          )
          .append($("<dl class='dl-horizontal'>")
            .append("<dt>Squad member '" + squad[1].name + "'</dt>")
            .append("<dd>" + (squad[1].upstairs ? "0 (left upstairs)" : scores[1]) + "</dd>")
          )
          .append($("<dl class='dl-horizontal'>")
            .append("<dt>Squad member '" + squad[2].name + "'</dt>")
            .append("<dd>" + (squad[2].upstairs ? "0 (left upstairs)" : scores[2]) + "</dd>")
          )
          .append($("<dl class='dl-horizontal'>")
            .append("<dt>Squad member '" + squad[3].name + "'</dt>")
            .append("<dd>" + (squad[3].upstairs ? "0 (left upstairs)" : scores[3]) + "</dd>")
          )
          .append($("<dl class='dl-horizontal'>")
            .append("<dt>Total</dt>")
            .append("<dd>" + (total * multi) + "</dd>")
          )
          .append("<small>Refresh to restart</small>")
        )
        .modal()
      runtime.stop_runtime()
    }
  }

  var end_turn = function()
  {
    var on_exit = false;

    $.each(squad, function(i, p)
    {
      if (p.hp <= 0)
        return;

      if ($.isFunction(p[p.action]))
      {
        p[p.action]()
      }

      if (p.enemy != undefined && $.isFunction(p.enemy.Attack))
      {
        p.enemy.Attack()
      }

      p.ammo = min(p.ammo_total, p.ammo + 1)

      // Reset the action
      p.prev_action()
      p.next_action()

      if (exit != undefined)
      {
        if (exit.x == p.pos.x && exit.y == p.pos.y)
          on_exit = true;
      }
    })

    if (on_exit == false)
      exit = null

    current_turn++
  }
  
  restart_game = function()
  {
    info = {}
    squad = []
    rng = new lprng(null);

    for (var i = 0; i < 4; i++)
    {
      squad.push(new Person({
        name: i,
      }))
    }
  }

  var input = new Input({listen: true})
  input.register_action("prev_book",  "pageup")
  input.register_action("next_book",  "pagedown")
  input.register_action("prev_field",  "shift+tab")
  input.register_action("next_field",  "tab")
  input.register_action("select",  "enter")
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
    down: function()
    {
      var p = squad[current_person]
      var field = fields[current_field]

      if (p == undefined || field == undefined)
        return new Cooldown()

      switch (field)
      {
        case "weapon":
          p.next_weapon()
          break;
        case "armor":
          p.next_armor()
          break;
        case "action":
          p.next_action()
          break;
      }

      return new Cooldown()
    },
    up: function()
    {
      var p = squad[current_person]
      var field = fields[current_field]

      if (p == undefined || field == undefined)
        return new Cooldown()

      switch (field)
      {
        case "weapon":
          p.prev_weapon()
          break;
        case "armor":
          p.prev_armor()
          break;
        case "action":
          p.prev_action()
          break;
      }

      return new Cooldown()
    },
    select: function()
    {
      var field = fields[current_field]

      if (field == undefined)
        return new Cooldown()

      current_field = (current_field + 1) % fields.length

      switch (field)
      {
        case "end_turn":
          end_turn()
          current_field = 0
          break;
      }

      return new Cooldown()
    },
  })

  restart_game()


[% END %]
