var StageElement = new Class({
	    Implements: [Events, Options],
	    options: {
		    delta: 0,
		    base: 1,
		    scale: 1,
		    pos: {
			    x: 0,
			    y: 0
		    }
	    },
	    initialize: function (textures, stage, options)
	    {
		    this.setOptions(options);
	    },
	    set_animation: function (textures, stage)
	    {
		    var sprite            = new PIXI.extras.MovieClip(textures);
		    sprite.loop           = false;
		    sprite.animationSpeed = 0.15;
		
		    this.sprite  = sprite;
		    this.texture = textures[0];
		    stage.addChild(sprite);
		    this.rst();
	    },
	    set_tiling_sprite: function (textures, stage)
	    {
		    var texture           = textures[0];
		    var sprite            = new PIXI.TilingSprite(texture, texture.width, texture.height);
		    sprite.position.x     = 0;
		    sprite.position.y     = 0;
		    sprite.tilePosition.x = 0;
		    sprite.tilePosition.y = 0;
		    this.sprite           = sprite;
		    this.viewportX        = 0;
		    this.texture          = texture;
		    this.width            = texture.width;
		    stage.addChild(this.sprite);
		    this.rst();
	    },
	    rst: function ()
	    {
		    this.options['pos'] = this.options['def_pos'];
		    this.resize();
	    },
	    set_sprite: function (textures, stage)
	    {
		    var texture       = textures[0];
		    var sprite        = new PIXI.Sprite(texture, texture.width, texture.height);
		    sprite.position.x = 0;
		    sprite.position.y = 0;
		    this.sprite       = sprite;
		    this.texture      = texture;
		    this.width        = texture.width;
		    stage.addChild(this.sprite);
		    this.rst();
	    }
	    ,
	    set_scale: function (size)
	    {
		    this.options.win_size = size;
		    this.resize();
	    }
	    ,
	    resize: function ()
	    {
		    var o             = this.options;
		    var base          = o.base;
		    var win_height    = o.win_size.y;
		    var sprite_height = this.texture.height;
		    var r_1           = win_height / base;
		    var r_2           = base / sprite_height;
		    if (o.fullheight !== true)
		    {
			    r_2 = 1;
		    }
		    var r              = r_2 * r_1;
		    var sz_1           = sprite_height * r;
		    var scale          = sz_1 / sprite_height;
		    this.options.scale = scale;
		    this.sprite.setTransform(Math.floor(o.pos.x * scale), Math.floor(o.pos.y * scale), scale, scale, 0, 0, 0, 0, 0);
	    }
    })
	;