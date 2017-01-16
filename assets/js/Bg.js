var Bg = new Class({
	initialize: function (data, pool, stage)
	{
		this.scale     = 1;
		this.scale_w   = 1;
		this.start     = 0;
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
		this.last    = 0;
	},
	reset: function ()
	{
		this.pos.x   = this.o_pos.x;
		this.sprites = [];
		this.slides  = [];
		this.start   = 0;
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
				cnt++
			}
			previous = e_x;
		}
		while ((previous + start_x) < width)
		{
			var r         = this.last;
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
			this.last++;
			if (this.last > this.textures.length - 1)
			{
				this.last = 0;
			}
		}
		this.sprites = tmp_sprites;
		this.slides  = tmp_slides;
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
	update: function ()
	{
		this.build_slides();
		this.container.setTransform(Math.floor(this.pos.x * this.scale), 0, this.scale, this.scale, 0, 0, 0, 0, 0);
	}
});