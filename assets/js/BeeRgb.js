var BeeRgb = new Class({
	initialize: function (data, pool, stage)
	{
		this.scale     = 1;
		this.o_pos     = {x: 100, y: 100};
		this.pos       = {x: 100, y: 100};
		this.container = new PIXI.Container();
		
		var fly_textures       = [];
		var explosion_textures = [];
		var bonus_textures     = [];
		var j                  = 0;
		
		for (var i = data.img.animations.fly.min; i <= data.img.animations.fly.max; i++)
		{
			var img         = data.img.animations.fly.dir + i + data.img.animations.fly.ext;
			fly_textures[j] = pool[img].texture;
			j++;
		}
		var j = 0;
		for (var i = data.img.animations.explosion.min; i <= data.img.animations.explosion.max; i++)
		{
			var img               = data.img.animations.explosion.dir + i + data.img.animations.explosion.ext;
			explosion_textures[j] = pool[img].texture;
			j++;
		}
		
		var j = 0;
		for (var i = data.img.animations.bonus.min; i <= data.img.animations.bonus.max; i++)
		{
			var img           = data.img.animations.bonus.dir + i + data.img.animations.bonus.ext;
			bonus_textures[j] = pool[img].texture;
			j++;
		}
		
		this.fly                = new PIXI.extras.MovieClip(fly_textures);
		this.fly.animationSpeed = 0.5;
		this.fly.loop           = true;
		this.fly.visible        = true;
		this.fly.play();
		this.container.addChild(this.fly);
		
		this.explosion                = new PIXI.extras.MovieClip(explosion_textures);
		this.explosion.loop           = false;
		this.explosion.animationSpeed = 0.5;
		this.explosion.visible        = false;
		this.container.addChild(this.explosion);
		
		this.bonus                = new PIXI.extras.MovieClip(bonus_textures);
		this.bonus.animationSpeed = 0.5;
		this.bonus.loop           = false;
		this.bonus.visible        = false;
		this.container.addChild(this.bonus);
		stage.addChild(this.container);
		this.update();
	},
	reset: function ()
	{
		this.pos.y = this.o_pos.y;
		this.play_fly();
		this.update();
	},
	play_fly: function ()
	{
		this.fly.visible       = true;
		this.bonus.visible     = false;
		this.explosion.visible = false;
	},
	play_win: function ()
	{
		this.fly.visible       = false;
		this.bonus.visible     = true;
		this.explosion.visible = false;
		this.bonus.gotoAndPlay(0);
		this.play_fly.delay(1200, this);
	},
	play_crash: function ()
	{
		this.fly.visible       = false;
		this.bonus.visible     = false;
		this.explosion.visible = true;
		this.explosion.gotoAndPlay(0);
	},
	resize: function (scale, w, h)
	{
		this.scale = scale;
		this.update();
	},
	update_pos: function (y)
	{
		this.pos.y += y;
		this.update();
	},
	update: function ()
	{
		this.container.setTransform(Math.round(this.pos.x * this.scale), Math.round(this.pos.y * this.scale), this.scale, this.scale, 0, 0, 0, 0, 0);
	}
});