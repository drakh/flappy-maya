var Bee = new Class({
	Extends: StageElement,
	initialize: function (textures, stage, options)
	{
		options['fullheight'] = false;
		var sz                = options.win_size;
		var scale             = sz.y / options.base;
		var t                 = textures[0];
		var top               = Math.floor(((sz.y / scale) - (t.height)) / 2);
		this.def_pos          = {x: 120, y: top};
		options['def_pos']    = {x: 120, y: top};
		this.parent(textures, stage, options);
		this.set_sprite(textures, stage);
		this.is_outside = false;
	},
	update: function (obj)
	{
		var o   = this.options;
		var y   = o.pos.y + obj.gravity;
		var min = 0 - this.texture.height;
		var max = o.win_size.y / o.scale;
		if (y < min)
		{
			y               = min;
			this.is_outside = true;
		}
		if (y > max)
		{
			y               = max;
			this.is_outside = true;
		}
		o.pos.y       = y;
		this.sprite.x = Math.floor(o.pos.x * o.scale);
		this.sprite.y = Math.floor(o.pos.y * o.scale);
		//this.sprite.setTransform(Math.floor(o.pos.x * o.scale), Math.floor(o.pos.y * o.scale), o.scale, o.scale, 0,
		// 0, 0, 0, 0);
		this.options  = o;
	},
	rst: function ()
	{
		var options      = this.options;
		var t            = this.texture;
		var sz           = options.win_size;
		var scale        = sz.y / options.base;
		var top          = Math.floor(((sz.y / scale) - (t.height)) / 2);
		this.def_pos     = {x: 120, y: top};
		this.is_outside  = false;
		this.options.pos = this.def_pos;
		this.update({gravity: 0});
	},
	get_scale: function ()
	{
		console.log(this.options);
	},
	get_position: function ()
	{
		var o = this.options;
		var t = this.texture;
		return {
			x: Math.floor(o.pos.x * o.scale),
			y: Math.floor(o.pos.y * o.scale),
			w: Math.floor(t.width * o.scale),
			h: Math.floor(t.height * o.scale)
		}
	}
	
});