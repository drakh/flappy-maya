var Background = new Class({
	Extends: StageElement,
	initialize: function (textures, stage, options)
	{
		options['fullheight'] = true;
		options['def_pos']    = {x: 0, y: 0};
		this.parent(textures, stage, options);
		this.set_tiling_sprite(textures, stage);
	},
	update: function (o)
	{
		var per                    = (this.texture.width) / 100;
		var pos                    = -1 * per * o.position * this.options.delta;
		this.sprite.tilePosition.x = (pos);
	},
	
});