var Explosion = new Class({
	Extends: StageElement,
	initialize: function (textures, stage, options)
	{
		options['fullheight'] = false;
		var sz                = options.win_size;
		var scale             = sz.y / options.base;
		var t                 = textures[0];
		var top               = ((sz.y / scale) - (t.height)) / 2;
		options['def_pos']    = {x: 120, y: top};
		this.parent(textures, stage, options);
		this.set_animation(textures, stage);
	},
	play: function ()
	{
		this.sprite.gotoAndPlay(0);
	},
	update: function (obj)
	{
		var o = this.options;
		var y = o.pos.y + obj.gravity;
		
		if (y < 0)
		{
			y = 0;
		}
		if (y > o.win_size.y + (this.texture.height * o.scale))
		{
			y = o.win_size.y + (this.texture.height * o.scale);
		}
		o.pos.y = y;
		this.sprite.setTransform(o.pos.x * o.scale, o.pos.y * o.scale, o.scale, o.scale, 0, 0, 0, 0, 0);
		this.options = o;
	},
	rst: function ()
	{
		var options      = this.options;
		var t            = this.texture;
		var sz           = options.win_size;
		var scale        = sz.y / options.base;
		var top          = ((sz.y / scale) - (t.height)) / 2;
		this.def_pos     = {x: 120, y: top};
		this.is_outside  = false;
		this.options.pos = this.def_pos;
		this.update({gravity: 0});
	},
});