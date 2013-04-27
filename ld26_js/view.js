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
  c.lineTo(xw, 1);
  c.lineTo(xw + yh, yh);

  c.strokeStyle = "#728ead";
  c.stroke();
  c.fill();

  c.fillStyle = "#728ead";
  c.scale(1, -1)
  c.fillText(text, x + [% x_pad %], -[% y_pad * 2 %])
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
    var x_count = 12
    var y_count = 18
    var cell_headers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    var cell_yh = floor(this.yh / (y_count + 1))
    var cell_xw = floor((this.xw - cell_yh) / x_count)

    // Take care of the final (cut off) row and column
    x_count++; y_count++

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
[% END %]
