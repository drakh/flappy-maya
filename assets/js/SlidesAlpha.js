var SlidesAlpha = new Class({
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
	update_pos: function (slide_arr)
	{
		this.pos.x = slide_arr.x;
		this.update(slide_arr);
	},
	build_slides: function (slide_arr)
	{
		var cnt         = 0;
		var tmp_sprites = [];
		var tmp_slides  = [];
		
		var o_sprites = slide_arr.sprites;
		var o_slides  = slide_arr.slides;
		
		var c_sprites = this.sprites;
		
		for (var i = 0; i < c_sprites.length; i++)
		{
			this.container.removeChild(c_sprites[i]);
		}
		for (var i = 0; i < o_sprites.length; i++)
		{
			var r         = o_slides[i];
			var t         = this.textures[r];
			var sprite    = new PIXI.Sprite(t);
			sprite.x      = o_sprites[i].x;
			sprite.y      = 0;
			sprite.width  = o_sprites[i].width;
			sprite.height = o_sprites[i].height;
			this.container.addChild(sprite);
			tmp_sprites[i] = sprite;
			tmp_slides[i]  = r;
		}
		this.sprites = tmp_sprites;
		this.slides  = tmp_slides;
	},
	update: function (slide_arr)
	{
		if (slide_arr)
		{
			this.build_slides(slide_arr);
		}
		this.container.setTransform(Math.floor(this.pos.x * this.scale), 0, this.scale, this.scale, 0, 0, 0, 0, 0);
	}
});