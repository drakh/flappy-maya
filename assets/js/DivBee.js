var DivBee = new Class({
	Extends: DivStageElement,
	initialize: function (el, img, options)
	{
		this.parent(el, img, options);
		this.compute_middle_top();
		this.set_pos();
	},
	compute_middle_top: function ()
	{
		var o    = this.options;
		var w_h  = o.sz.y;
		var c_h  = Math.round(o.h * o.scale);
		var top  = Math.round((w_h - c_h) / 2);
		this.top = top;
	},
	get_pos: function ()
	{
		return '0px 0px';
	},
	set_pos: function ()
	{
		this.el.setStyles({
			                  left: 80 * this.options.scale,
			                  top: this.top
		                  });
	},
	update: function (pos, gravity)
	{
		var o   = this.options;
		var p   = Math.round((o.sz.y / 100) * (gravity / 2));
		var max = o.sz.y;
		var min = 0 - Math.round(o.h * o.scale);
		if (p != 0)
		{
			this.top += p;
			if (this.top > max)
			{
				this.top = max
			}
			if (this.top < min)
			{
				this.top = min;
			}
			this.set_pos();
		}
		//console.log(p);
	}
});