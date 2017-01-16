var BeeAlpha = new Class({
	initialize: function (data, pool, stage)
	{
		this.scale     = 1;
		this.o_pos       = {x: 100, y: 100};
		this.pos       = {x: 100, y: 100};
		this.container = new PIXI.Container();
		var t          = pool[data.img.static].texture;
		this.texture   = t;
		var sprite     = new PIXI.Sprite(t);
		sprite.width   = t.width;
		sprite.height  = t.height;
		this.container.addChild(sprite);
		stage.addChild(this.container);
		this.h = t.height;
		this.update();
	},
	reset: function ()
	{
		this.pos.y = this.o_pos.y;
		this.update();
	},
	resize: function (scale, w, h)
	{
		this.scale = scale;
		this.update();
	},
	update_pos: function (y)
	{
		this.pos.y = y;
		this.update();
	},
	get_pos: function ()
	{
		return {
			x: Math.floor(this.pos.x * this.scale),
			y: Math.floor(this.pos.y * this.scale),
			w: Math.floor(this.texture.width * this.scale),
			h: Math.floor(this.texture.height * this.scale),
			y_orig: this.pos.y,
			h_orig: this.texture.height
		}
	},
	update: function ()
	{
		this.container.setTransform(Math.floor(this.pos.x * this.scale), Math.floor(this.pos.y * this.scale), this.scale, this.scale, 0, 0, 0, 0, 0);
	}
});