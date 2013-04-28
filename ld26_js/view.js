[% WRAPPER scope %]

var view_layer = runtime.add_layer('game.wrapper', { });

var overview_layer = runtime.add_layer('game.overview', { });

var squad_layers = []

[% y_pad = 3 %]
[% x_pad = 4 %]
var draw_tab = function(gfx, x, text)
{
  var c = gfx.context;
  var yh = gfx.yh();

  var xw = c.measureText(text).width + [% x_pad * 2 %]

  c.beginPath();
  c.moveTo(x, yh);
  c.lineTo(x, 2);
  c.lineTo(x + 2, 2);
  c.lineTo(x + 2, 1);
  c.lineTo(x + xw, 1);
  c.lineTo(x + xw + yh, yh);

  c.strokeStyle = "#728ead";
  c.stroke();
  c.fill();

  c.fillStyle = "#728ead";
  c.scale(1, -1)
  c.fillText(text, x + [% x_pad * 2 %], -[% y_pad * 2 %])
  gfx.reset_transform()

  return xw
}

[%# Tabs %]
view_layer.add_animation(new Animation({
  frame_x: 0,
  frame_y: 0,
  xw: [% width %],
  yh: 20,
  get_gfx: function()
  {
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context
    c.lineWidth = 1
    c.strokeStyle = "#728ead"
    c.fillStyle = "#c7d9ed"
    c.fillRect(0, 0, this.xw, this.yh)

    c.font = (this.yh - [% y_pad * 2 %]) + "px Georgia"

    var total = 10;
    var tabs = ["Overview"]
    var titles = $.map(squad, function(v)
    {
      return v.name
    })
    titles = $.merge(tabs, titles)

    var positions = $.map(titles, function(v)
    {
      var result = total
      total += 10 + c.measureText(v).width + [% x_pad * 2 %]
      return result
    })

    titles.reverse()
    positions.reverse()

    var current_tab = 0
    $.each(titles, function(i)
    {
      c.fillStyle = "#cdddef"
      if (squad.length - i == current_person + 1)
      {
        current_tab = i
        return
      }
      draw_tab(gfx, positions[i], titles[i])
    })

    c.fillStyle = "#fff"
    draw_tab(gfx, positions[current_tab], titles[current_tab])

    return gfx
  },
}))

[%# Grid %]
var grid_xw = [% width %]
var grid_yh = [% height - 50 %]
var x_count = 12
var y_count = 19
var cell_yh = floor(grid_yh / (y_count + 1))
var cell_xw = floor((grid_xw - cell_yh) / x_count)

// Take care of the final (cut off) row and column
x_count++; y_count++

var halo = {}

var data_in_cell = function(gfx, x, y, xw, data, align)
{
  xw = xw || 1
  if (align == undefined)
    align = "center"

  var c = gfx.context

  var x_pos = x * cell_xw + cell_yh
  var y_pos = y * cell_yh + cell_yh

  var text_x = x_pos + [% x_pad %]
  var text_max = cell_xw * xw - [% x_pad * 2 %]

  if (align == "center")
    text_x = text_x + text_max / 2

  if (align == "right")
    text_x = text_x + text_max

  if (data == halo)
  {
    c.strokeStyle = "#398fef"
    c.strokeRect(x_pos + 0, y_pos + 0, cell_xw * xw - 1, cell_yh - 1)
    c.strokeStyle = "#73adef"
    c.globalAlpha = 0.6
    c.strokeRect(x_pos + 1, y_pos + 1, cell_xw * xw - 3, cell_yh - 3)
    c.strokeStyle = "#a8c9ef"
    c.globalAlpha = 0.4
    c.strokeRect(x_pos + 2, y_pos + 2, cell_xw * xw - 5, cell_yh - 5)
    c.globalAlpha = 1
    return
  }

  c.fillRect(x_pos, y_pos, cell_xw * xw - 1, cell_yh - 1)

  if (data == undefined)
    return

  var tmp_fill = c.fillStyle
  c.fillStyle = "#000"

  c.textAlign = align
  c.fillText(data, text_x, y_pos + cell_yh - [% y_pad * 3 %], text_max)

  c.fillStyle = tmp_fill
}

view_layer.add_animation(new Animation({
  frame_x: 0,
  frame_y: 20,
  xw: [% width %],
  yh: [% height - 50 %],
  get_gfx: function()
  {
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context
    c.translate(0, this.yh)
    c.scale(1, -1)
    c.lineWidth = 1

    var cell_headers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    c.font = (cell_yh - [% y_pad * 2 %]) + "px Georgia"
    c.textAlign = "center"

    c.strokeStyle = "#a0b0c7"
    c.fillStyle   = "#dae7f5"

    c.fillRect  (0, 0, cell_yh, cell_yh)
    c.strokeRect(0, 0, cell_yh, cell_yh)

    for (var x = 0; x < x_count; x++)
    {
      c.fillRect  (x * cell_xw + cell_yh, 0, cell_xw, cell_yh)
      c.strokeRect(x * cell_xw + cell_yh, 0, cell_xw, cell_yh)
    }

    for (var y = 0; y < y_count; y++)
    {
      c.fillRect  (0, y * cell_yh + cell_yh, cell_yh, cell_yh)
      c.strokeRect(0, y * cell_yh + cell_yh, cell_yh, cell_yh)
    }

    c.fillStyle   = "#1e395b"
    for (var x = 0; x < x_count; x++)
    {
      c.fillText(cell_headers[x], x * cell_xw + cell_yh + cell_xw/2, cell_yh - [% y_pad * 2 %])
    }

    for (var y = 0; y < y_count; y++)
    {
      c.fillText(y + 1, cell_yh/2, (y + 1) * cell_yh + cell_yh - [% y_pad * 2%])
    }

    c.strokeStyle = "#dadcdd"
    c.fillStyle   = "#fff"
    for (var x = 0; x < x_count; x++)
    {
      for (var y = 0; y < y_count; y++)
      {
        var x_pos = x * cell_xw + cell_yh
        var y_pos = y * cell_yh + cell_yh
        c.fillRect  (x_pos, y_pos, cell_xw, cell_yh)
        c.beginPath()
        c.moveTo(x_pos          , y_pos + cell_yh)
        c.lineTo(x_pos + cell_xw, y_pos + cell_yh)
        c.lineTo(x_pos + cell_xw, y_pos          )
        c.stroke()
      }
    }

    return gfx;
  },
}))

[%# Formula Bar %]
view_layer.add_animation(new Animation({
  frame_x: 0,
  frame_y: [% height - 30 %],
  xw: [% width %],
  yh: 30,
  get_gfx: function()
  {
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context
    var yh = this.yh - 3

    c.strokeStyle = "#9babc2"
    c.fillStyle   = "#dfe9f5"

    c.fillRect(0, 0, this.xw, 3)
    c.strokeRect(0, 0, this.xw, 3)

    c.strokeStyle = "#9babc2"
    c.fillStyle   = "#fff"

    c.fillRect(0, 3, this.xw, yh)
    c.strokeRect(0, 3, this.xw, yh)

    c.strokeStyle = "#9babc2"
    c.fillStyle   = "#dfe9f5"
    c.beginPath()
    c.moveTo(84, 3)
    c.lineTo(164, 3)
    c.lineTo(164, this.yh)
    c.lineTo(84, this.yh)

    c.arc(84, yh/2 + 3, yh / 2, Math.PI / 2, Math.PI * 1.5)
    c.fill()
    c.stroke()

    c.scale(1, -1)
    c.fillStyle = "#1e395b"
    c.font = "24px Georgia"
    c.fillText("\u0192", 140, -12);
    c.font = "12px Bold Georgia"
    c.fillText("x", 150, -10);

    return gfx;
  },
}))

[%# Data %]
view_layer.add_animation(new Animation({
  frame_x: 0,
  frame_y: 20,
  xw: grid_xw,
  yh: grid_yh,
  get_gfx: function()
  {
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context
    c.translate(0, this.yh)
    c.scale(1, -1)
    c.font = "16px Georgia"

    var p = squad[current_person]
    c.fillStyle = "#cfc"

    if (p == undefined)
      return gfx;

    var act_notes = {}

    [% y = 0 %]

    data_in_cell(gfx,  4, [%y%], 2, "End Turn", "center")
    act_notes.end_turn = {x: 4, y:[%y%], xw: 2 }

    [% y = y + 1 %]

    data_in_cell(gfx,  0, [%y%], 2, "Current Turn", "center")
    data_in_cell(gfx,  2, [%y%], 1, current_turn.toFixed(2), "center")

    data_in_cell(gfx,  3, [%y%], 1, "Action", "center")
    data_in_cell(gfx,  4, [%y%], 2, p.action, "center")
    act_notes.action = {x: 4, y:[%y%], xw: 2 }

    [% y = y + 1 %]

    data_in_cell(gfx, 0, [%y%], 1, "Name")
    data_in_cell(gfx, 1, [%y%], 5, p.name, "center")

    [% y = y + 1 %]

    [% first_line = y %]

    var show_person = function(p, x, y)
    {
      [% y = 0 %]

      var loc = p.pos != undefined ? "" + p.pos.x + ", " + p.pos.y : ""
      data_in_cell(gfx, x + 0, y + [%y%], 1, "Location")
      data_in_cell(gfx, x + 1, y + [%y%], 1, loc, "right")

      data_in_cell(gfx, x + 2, y + [%y%], 1, "Level")
      data_in_cell(gfx, x + 3, y + [%y%], 1, p.level(), "right")

      data_in_cell(gfx, x + 4, y + [%y%], 1, "XP")
      data_in_cell(gfx, x + 5, y + [%y%], 1, p.xp, "right")

      [% y = y + 1 %]

      data_in_cell(gfx, x + 0, y + [%y%], 1, "HP")
      data_in_cell(gfx, x + 1, y + [%y%], 1, p.hp, "right")
      data_in_cell(gfx, x + 2, y + [%y%], 1, p.hp_total, "left")

      data_in_cell(gfx, x + 3, y + [%y%], 1, "Ammo")
      data_in_cell(gfx, x + 4, y + [%y%], 1, p.ammo, "right")
      data_in_cell(gfx, x + 5, y + [%y%], 1, p.ammo_total, "left")

      [% y = y + 1 %]

      data_in_cell(gfx, x + 0, y + [%y%], 1, "Speed")
      data_in_cell(gfx, x + 1, y + [%y%], 1, p.speed, "right")

      data_in_cell(gfx, x + 2, y + [%y%], 1, "Accuracy")
      data_in_cell(gfx, x + 3, y + [%y%], 1, p.accuracy, "right")

      data_in_cell(gfx, x + 4, y + [%y%], 1, "Evasion")
      data_in_cell(gfx, x + 5, y + [%y%], 1, p.ev, "right")

      [% y = y + 1 %]

      data_in_cell(gfx, x + 0, y + [%y%], 2, "Weapon")
      data_in_cell(gfx, x + 2, y + [%y%], 4, p.weapon.name, "center")
      act_notes.weapon = {x: 2, y:y + [%y%], xw: 4 }

      [% y = y + 1 %]

      data_in_cell(gfx, x + 0, y + [%y%], 1, "")
      data_in_cell(gfx, x + 1, y + [%y%], 1, "Accuracy")
      data_in_cell(gfx, x + 2, y + [%y%], 1, p.weapon.accuracy, "right")

      data_in_cell(gfx, x + 3, y + [%y%], 2, "Rate of Fire")
      data_in_cell(gfx, x + 5, y + [%y%], 1, p.weapon.rof, "right")

      [% y = y + 1 %]

      data_in_cell(gfx, x + 0, y + [%y%], 1, "")
      data_in_cell(gfx, x + 1, y + [%y%], 1, "Power")
      data_in_cell(gfx, x + 2, y + [%y%], 1, p.weapon.power, "right")

      data_in_cell(gfx, x + 3, y + [%y%], 2, "Ammo Use")
      data_in_cell(gfx, x + 5, y + [%y%], 1, p.weapon.ammo, "right")

      [% y = y + 1 %]

      data_in_cell(gfx, x + 0, y + [%y%], 2, "Armor")
      data_in_cell(gfx, x + 2, y + [%y%], 4, p.armor.name, "center")
      act_notes.armor = {x: 2, y:y + [%y%], xw: 4 }

      [% y = y + 1 %]

      data_in_cell(gfx, x + 0, y + [%y%], 1, "")
      data_in_cell(gfx, x + 1, y + [%y%], 1, "Integrity")
      data_in_cell(gfx, x + 2, y + [%y%], 1, p.armor.integ, "right")
      data_in_cell(gfx, x + 3, y + [%y%], 1, p.armor.integ_total, "left")

      data_in_cell(gfx, x + 4, y + [%y%], 1, "Strength")
      data_in_cell(gfx, x + 5, y + [%y%], 1, p.armor.str, "right")

      [% y = y + 1 %]
    }

    show_person(p, 0, [% first_line %])

    var act_note = act_notes[fields[current_field]]
    if (act_note != undefined)
    {
      data_in_cell(gfx, act_note.x, act_note.y, act_note.xw, halo)
    }

    c.fillStyle = "#ffc"
    data_in_cell(gfx, 6, [% first_line - 1 %], 1, "Enemy")

    [% y = y + 1 %]
    var enemy = { weapon: {}, armor: {}, level: $.noop, };

    if (p.enemy != undefined)
    {
      data_in_cell(gfx, 7, [% first_line - 1 %], 5, p.enemy.name, "center")
      enemy = p.enemy
    }
    else
    {
      data_in_cell(gfx, 7, [% first_line - 1 %], 5, "None", "center")
    }

    show_person(enemy, 6, [% first_line %])

    return gfx
  },
}))

[% END %]
