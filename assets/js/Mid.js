var Mid=new Class({
	Implements:[Events, Options],
	options:{
		size:{
			w:512,
			h:256
		},
		DELTA_X: 0.32
	},
	initialize:function(stage,w,h){
		var texture = PIXI.Texture.fromImage("assets/img/bg-mid.png");
		this.sprite = new PIXI.extras.TilingSprite(texture,this.options.size.w,this.options.size.h);
		this.sprite.position.x = 0;
		this.sprite.position.y = 128;
		this.sprite.tilePosition.x = 0;
		this.sprite.tilePosition.y = 0;
		this.viewportX = 0;
		this.resize(w,h);
		stage.addChild(this.sprite);
	},
	setViewportX: function(newViewportX) {
		var distanceTravelled = newViewportX - this.viewportX;
		this.viewportX = newViewportX;
		this.sprite.tilePosition.x -= (distanceTravelled * this.options.DELTA_X);
	},
	resize:function(w,h){
		var scale=w/this.options.size.w;
		this.sprite.setTransform(0, 0, scale, scale, 0, 0, 0, 0, 0);
	}
});