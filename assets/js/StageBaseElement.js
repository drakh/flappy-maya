var StageBaseElement = new Class({
	Implements: [Events, Options],
	options: {
		delta: 0,
		scale: 1
	},
	initialize: function (texture, stage, options)
	{
		this.setOptions(options);
		this.set_sprite(texture, stage);
	},
	set_sprite: function (texture, stage)
	{
		/*
		var scale              = this.options.scale;
		this.limit             = 30;
		this.pos_y             = 40;
		this.pos_x             = 40;
		this.sprite            = new PIXI.Sprite(texture, texture.width, texture.height);
		this.sprite.position.x = this.pos_y * scale;
		this.sprite.position.y = this.pos_y * scale;
		this.size              = {
			x: this.sprite.position.x,
			y: this.sprite.position.y,
			w: texture.width * scale,
			h: texture.height * scale
		};
		this.viewportX         = 0;
		this.texture           = texture;
		stage.addChild(this.sprite);
		*/
	},
	update: function (o)
	{
		this.pos_y = this.pos_y + o.gravity;
		var y      = this.pos_y * this.options.scale;
		if (y + this.size.h >= this.limit)
		{
			y = this.limit - this.size.h;
		}
		if (y < 0)
		{
			y = 0;
		}
		this.pos_y             = y / this.options.scale;
		this.sprite.position.y = y;
		this.sprite.position.x = this.pos_x * this.options.scale;
	},
	set_scale: function (scale, h)
	{
		this.options.scale = scale;
		this.limit         = h;
		this.resize();
	},
	resize: function ()
	{
		var scale   = this.options.scale;
		var texture = this.texture;
		this.size.h = texture.width * this.options.scale;
		this.size.w = texture.height * this.options.scale;
		this.sprite.setTransform(0, 0, scale, scale, 0, 0, 0, 0, 0);
	}
});