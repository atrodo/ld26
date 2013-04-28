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

    c.fillStyle = "#fff"
    draw_tab(gfx, 10, "Overview")

    return gfx
  },
}))

[%# Grid %]
var grid_xw = [% width %]
var grid_yh = [% height - 50 %]
var x_count = 12
var y_count = 18
var cell_yh = floor(grid_yh / (y_count + 1))
var cell_xw = floor((grid_xw - cell_yh) / x_count)

// Take care of the final (cut off) row and column
x_count++; y_count++

var data_in_cell = function(gfx, x, y, xw, data, align)
{
  xw = xw || 1
  if (align == undefined)
    align = "left"

  var c = gfx.context

  var x_pos = x * cell_xw + cell_yh
  var y_pos = y * cell_yh + cell_yh

  var text_x = x_pos + [% x_pad %]
  var text_max = cell_xw * xw - [% x_pad * 2 %]

  if (align == "center")
    text_x = text_x + text_max / 2

  if (align == "right")
    text_x = text_x + text_max

  c.fillRect(x_pos, y_pos, cell_xw * xw - 1, cell_yh - 1)

  var tmp_fill = c.fillStyle
  c.fillStyle = "#000"

  c.textAlign = align
  c.fillText(data, text_x, y_pos + cell_yh - [% y_pad * 2 %], text_max)

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

    [% y = 2 %]

    data_in_cell(gfx,  0, [%y%], 1, "Name")
    data_in_cell(gfx,  1, [%y%], 3, p.name, "center")
    data_in_cell(gfx,  4, [%y%], 2, "End Turn", "center")

    [% y = y + 1 %]

    data_in_cell(gfx,  0, [%y%], 1, "Location")
    data_in_cell(gfx,  1, [%y%], 1, "" + p.pos.x + ", " + p.pos.y, "right")

    data_in_cell(gfx,  2, [%y%], 1, "Level")
    data_in_cell(gfx,  3, [%y%], 1, p.level(), "right")

    data_in_cell(gfx,  4, [%y%], 1, "XP")
    data_in_cell(gfx,  5, [%y%], 1, floor(p.xp * 100) / 100, "right")

    [% y = y + 1 %]

    data_in_cell(gfx,  0, [%y%], 1, "HP")
    data_in_cell(gfx,  1, [%y%], 1, p.hp, "right")
    data_in_cell(gfx,  2, [%y%], 1, p.hp_total)

    data_in_cell(gfx,  3, [%y%], 1, "Ammo")
    data_in_cell(gfx,  4, [%y%], 1, p.ammo, "right")
    data_in_cell(gfx,  5, [%y%], 1, p.ammo_total)

    [% y = y + 1 %]

    data_in_cell(gfx,  0, [%y%], 1, "Speed")
    data_in_cell(gfx,  1, [%y%], 1, p.speed)

    data_in_cell(gfx,  2, [%y%], 1, "Accuracy")
    data_in_cell(gfx,  3, [%y%], 1, p.accuracy)

    data_in_cell(gfx,  4, [%y%], 1, "Evasion")
    data_in_cell(gfx,  5, [%y%], 1, p.ev)

    [% y = y + 1 %]

    data_in_cell(gfx,  0, [%y%], 1, "Weapon")
    data_in_cell(gfx,  1, [%y%], 2, p.weapon == null ? "" : p.weapon.name)

    [% y = y + 1 %]

    data_in_cell(gfx,  0, [%y%], 1, "")
    data_in_cell(gfx,  1, [%y%], 1, "Accuracy")
    data_in_cell(gfx,  3, [%y%], 2, "Rate of Fire")

    if (p.weapon == null)
    {
      data_in_cell(gfx,  2, [%y%], 1, "")
      data_in_cell(gfx,  5, [%y%], 1, "")
    } else {
      data_in_cell(gfx,  2, [%y%], 1, p.weapon.accuracy)
      data_in_cell(gfx,  5, [%y%], 1, p.weapon.rof)
    }

    [% y = y + 1 %]

    data_in_cell(gfx,  0, [%y%], 1, "")
    data_in_cell(gfx,  1, [%y%], 1, "Power")
    data_in_cell(gfx,  3, [%y%], 2, "Ammo Use")

    if (p.weapon == null)
    {
      data_in_cell(gfx,  2, [%y%], 1, "")
      data_in_cell(gfx,  5, [%y%], 1, "")
    } else {
      data_in_cell(gfx,  2, [%y%], 1, p.weapon.power)
      data_in_cell(gfx,  5, [%y%], 1, p.weapon.ammo)
    }

    [% y = y + 1 %]

    data_in_cell(gfx,  0, [%y%], 1, "Armor")
    data_in_cell(gfx,  1, [%y%], 2, p.armor == null ? "" : p.armor.name)

    [% y = y + 1 %]

    data_in_cell(gfx,  0, [%y%], 1, "")
    data_in_cell(gfx,  1, [%y%], 1, "Integrity")
    data_in_cell(gfx,  4, [%y%], 1, "Strength")

    if (p.weapon == null)
    {
      data_in_cell(gfx,  2, [%y%], 1, "")
      data_in_cell(gfx,  3, [%y%], 1, "")
      data_in_cell(gfx,  5, [%y%], 1, "")
    } else {
      data_in_cell(gfx,  2, [%y%], 1, p.armor.integ)
      data_in_cell(gfx,  3, [%y%], 1, p.armor.integ_total)
      data_in_cell(gfx,  5, [%y%], 1, p.armor.str)
    }

    [% y = y + 1 %]

    return gfx
  },
}))

[% END %]
