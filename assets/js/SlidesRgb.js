var SlidesRgb = new Class({
	initialize: function (data, pool, stage)
	{
		this.scale     = 1;
		this.scale_w   = 1;
		this.start     = 1500;
		this.o_pos     = {x: 0, y: 0};
		this.pos       = {x: 0, y: 0};
		this.container = new PIXI.Container();
		this.textures  = [];
		var j          = 0;
		for (var i = data.img.pool.min; i <= data.img.pool.max; i++)
		{
			var img          = data.img.pool.dir + i + data.img.pool.ext;
			this.textures[j] = pool[img].texture;
			j++;
		}
		stage.addChild(this.container);
		this.sprites = [];
		this.slides  = [];
		
	},
	reset: function ()
	{
		this.pos.x = this.o_pos.x;
		this.update();
	},
	resize: function (scale, w, h)
	{
		this.scale = scale;
		var w_w    = Math.floor(w / scale);
		this.w_w   = w_w;
		this.update();
	},
	update_pos: function (p)
	{
		this.pos.x -= p;
		this.update();
	},
	build_slides: function ()
	{
		var tmp_sprites = [];
		var tmp_slides  = [];
		
		var width   = this.w_w;
		var start_x = this.pos.x;
		
		var previous = this.start;
		var cnt      = 0;

		for (var i = 0; i < this.sprites.length; i++)
		{
			var sprite = this.sprites[i];
			var slide  = this.slides[i];
			var s_x    = sprite.x;
			var e_x    = s_x + sprite.width;
			if (e_x + start_x < 0 || s_x + start_x > width)
			{
				this.container.removeChild(sprite);
			}
			else
			{
				tmp_sprites[cnt] = sprite;
				tmp_slides[cnt]  = slide;
				cnt++;
			}
			previous = e_x;
		}
		while ((previous + start_x) < width)
		{
			var r         = Number.random(0, this.textures.length - 1);
			var t         = this.textures[r];
			var sprite    = new PIXI.Sprite(t);
			sprite.x      = previous;
			sprite.y      = 0;
			sprite.width  = t.width;
			sprite.height = t.height;
			previous      = sprite.x + sprite.width;
			this.container.addChild(sprite);
			tmp_sprites[cnt] = sprite;
			tmp_slides[cnt]  = r;
			cnt++;
		}
		this.sprites = tmp_sprites;
		this.slides  = tmp_slides;
	},
	get_slides: function ()
	{
		return {sprites: this.sprites, slides: this.slides, x: this.pos.x}
	},
	update: function ()
	{
		this.build_slides();
		this.container.setTransform(Math.floor(this.pos.x * this.scale), 0, this.scale, this.scale, 0, 0, 0, 0, 0);
	}
});