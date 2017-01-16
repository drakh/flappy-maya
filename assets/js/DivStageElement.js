var DivStageElement = new Class({
	Implements: [Events, Options],
	initialize: function (el, img, options)
	{
		this.pos = 0;
		this.setOptions(options);
		this.el = new Element('div', {class: 'bg'}).inject(el);
		this.set_img(img);
		this.set_size();
	},
	set_img: function (img)
	{
		this.el.setStyles({
			                  'background-image': 'url(' + img + ')'
		                  });
	},
	set_size: function ()
	{
		var o = this.options;
		var w = Math.round(o.w * o.scale);
		var h = Math.round(o.h * o.scale);
		this.el.setStyles({
			                  width: w,
			                  height: h,
			                  'background-size': w + 'px ' + h + 'px'
		                  });
		this.set_pos();
	},
	get_pos: function ()
	{
		var o = this.options;
		var w = Math.round(o.w * o.scale * o.delta);
		return '' + (Math.round(-1 * this.pos * (w / 100))) + 'px 0px';
	},
	set_pos: function ()
	{
		this.el.setStyles({'background-position': this.get_pos()});
	},
	resize: function (scale, sz)
	{
		this.options.scale = scale;
		this.options.sz    = sz;
		this.set_size();
	},
	update: function (pos, gravity)
	{
		this.pos = pos;
		this.set_pos();
	}
});