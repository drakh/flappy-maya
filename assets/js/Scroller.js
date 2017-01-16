var Scroller = new Class({
	Implements: [Events, Options],
	initialize: function (stage, w, h)
	{
		this.elements    = [];
		this.elements[0] = new Far(stage, w, h);
		this.elements[1] = new Mid(stage, w, h);
		//stage.addChild(this.far);
		/*
		 this.mid = new Mid();
		 stage.addChild(this.mid);

		 this.front = new Walls();
		 stage.addChild(this.front);

		 this.mapBuilder = new MapBuilder(this.front);
		 */
		this.viewportX = 0;
	},
	setViewportX: function (viewportX)
	{
		this.viewportX = Math.round(viewportX);
		this.elements.each(function (el)
		                   {
			                   el.setViewportX(viewportX)
		                   });
		//this.far.setViewportX(viewportX);
		//this.mid.setViewportX(viewportX);
		//this.front.setViewportX(viewportX);
	},
	getViewportX: function ()
	{
		return this.viewportX;
	},
	moveViewportXBy: function (units)
	{
		var newViewportX = this.viewportX + units;
		this.setViewportX(newViewportX);
	},
	resize: function (w, h)
	{
		this.elements.each(function (el)
		                   {
			                   el.resize(w, h)
		                   });
	}
});