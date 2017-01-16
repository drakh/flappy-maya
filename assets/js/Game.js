var already_voted = false;
var d_base        = '/';
var gpf           = '';
var Game          = new Class({
	Implements: [Events, Options],
	options: {
		gravity: 0.5,
		base: 750,
		alpha_renderer_size: {
			x: 80,
			y: 60
		},
		asst: {
			bg: {
				img: {
					pool: {
						min: 1,
						max: 7,
						dir: gpf + 'assets/img/bg/',
						ext: '.jpg'
					}
				}
			},
			bee: {
				img: {
					animations: {
						fly: {min: 1, max: 75, dir: gpf + 'assets/img/maya/fly/', ext: '.png',},
						explosion: {min: 1, max: 9, dir: gpf + 'assets/img/maya/explosion/', ext: '.png'},
						bonus: {min: 1, max: 37, dir: gpf + 'assets/img/maya/bonus/', ext: '.png'}
					}
				}
			},
			slides_rgb: {
				img: {
					pool: {
						min: 1,
						max: 12,
						dir: gpf + 'assets/img/prekazky/rgb/',
						ext: '.png'
					}
				}
			},
			bee_alpha: {img: {static: gpf + "assets/img/maya/alpha.png"}},
			slides_alpha: {
				img: {
					pool: {
						min: 1,
						max: 12,
						dir: gpf + 'assets/img/prekazky/alpha/',
						ext: '.png'
					}
				}
			}
		}
	},
	initialize: function (el, options)
	{
		this.setOptions(options);
		this.prev_speed    = 2;
		this.scale         = 1;
		this.frames        = 0;
		this.gravity       = 3;
		this.speed         = 10;
		this.mouse_is_down = false;
		this.el            = el;
		this.canvas        = new Element('canvas');
		/*.inject(document.body).setStyles({
		 'position': 'absolute',
		 'z-index': 999
		 });*/
		this.stage       = new PIXI.Container();
		this.alpha_stage = new PIXI.Container();
		
		this.loader   = PIXI.loader;
		this.elements = [];
		this.textures = {};
		
		this.game_pos = 0;
		
		this.load_sprites();
	},
	get_size: function ()
	{
		this.sz = window.getSize();
	},
	load_sprites: function ()
	{
		var a = this.options.asst;
		var t = {};
		for (var pid in a)
		{
			var imgs = a[pid].img;
			if (imgs['static'])
			{
				var img = imgs.static;
				this.loader.add(img, img);
			}
			if (imgs['pool'])
			{
				for (var i = imgs.pool.min; i <= imgs.pool.max; i++)
				{
					var img = imgs.pool.dir + i + imgs.pool.ext;
					this.loader.add(img, img);
				}
			}
			if (imgs['animations'])
			{
				var ims = imgs.animations;
				for (var i_pid in ims)
				{
					var p = ims[i_pid];
					for (var i = p.min; i <= p.max; i++)
					{
						var img = p.dir + i + p.ext;
						this.loader.add(img, img);
					}
				}
			}
		}
		this.loader.once("complete", this.game_init.bind(this));
		this.loader.load();
	},
	set_key_down: function (e)
	{
		if (e.key == 'space')
		{
			e.stop();
			this.set_mouse_down();
		}
	},
	set_key_up: function (e)
	{
		if (e.key == 'space')
		{
			e.stop();
			this.set_mouse_up();
		}
	},
	set_mouse_down: function (e)
	{
		this.gravity       = -5;
		this.mouse_is_down = true;
		this.fireEvent('goup');
	},
	set_mouse_up: function (e)
	{
		this.mouse_is_down = false;
		this.fireEvent('godown');
	},
	game_init: function (e, pool)
	{
		this.get_size();
		
		this.renderer          = new PIXI.CanvasRenderer(this.sz.x, this.sz.y, {
			view: this.el,
			roundPixels: true,
			backgroundColor: '#000'
		});
		this.stage.interactive = true;
		window.addEvents({
			                 'mousedown': this.set_mouse_down.bind(this),
			                 'mouseup': this.set_mouse_up.bind(this),
			                 'touchstart': this.set_mouse_down.bind(this),
			                 'touchend': this.set_mouse_up.bind(this),
			                 'keyup': this.set_key_up.bind(this),
			                 'keydown': this.set_key_down.bind(this)
		                 });
		this.alpha_renderer = new PIXI.CanvasRenderer(this.options.alpha_renderer_size.x, this.options.alpha_renderer_size.y, {
			view: this.canvas,
			roundPixels: true,
			backgroundColor: '#f00'
		});
		
		this.bg = new Bg(this.options.asst.bg, pool, this.stage);
		
		this.mid = new SlidesRgb(this.options.asst.slides_rgb, pool, this.stage);
		this.bee = new BeeRgb(this.options.asst.bee, pool, this.stage);
		
		this.mid_alpha = new SlidesAlpha(this.options.asst.slides_alpha, pool, this.alpha_stage);
		this.mid_alpha.resize(this.options.alpha_renderer_size.y / this.options.base, this.options.alpha_renderer_size.x, this.options.alpha_renderer_size.y);
		
		this.bee_alpha = new BeeAlpha(this.options.asst.bee_alpha, pool, this.alpha_stage);
		this.bee_alpha.resize(this.options.alpha_renderer_size.y / this.options.base, this.options.alpha_renderer_size.x, this.options.alpha_renderer_size.y);
		
		this.gravity = 10;
		
		this.win_resize();
		window.addEvent('resize', this.win_resize.bind(this));
		this.reset();
		this.fireEvent('loaded');
	},
	win_resize: function ()
	{
		this.get_size();
		this.renderer.resize(this.sz.x, this.sz.y);
		var scale  = this.sz.y / this.options.base;
		var scale2 = this.sz.y / this.options.base;
		this.bg.resize(scale, this.sz.x, this.sz.y);
		this.bee.resize(scale, this.sz.x, this.sz.y);
		this.mid.resize(scale2, this.sz.x, this.sz.y);
	},
	game_render: function ()
	{
		if (this.is_started === true)
		{
			this.update();
			this.alpha_renderer.render(this.alpha_stage);
			var bee_pos = this.bee_alpha.get_pos();
			var p_loose = this.is_loose;
			if (bee_pos.y_orig > this.options.base || bee_pos.y_orig + bee_pos.h_orig < 0)
			{
				this.is_loose = true;
			}
			else
			{
				var data = this.alpha_renderer.rootContext.getImageData(bee_pos.x + 3, bee_pos.y + 3, bee_pos.w - 3, bee_pos.h - 3);
				for (var i = 0; i < data.data.length; i += 4)
				{
					if (data.data[i] >= 127)
					{
						this.is_loose = true;
						break;
					}
				}
			}
			if (this.is_loose === true && p_loose == false)
			{
				this.bee.play_crash();
				this.stoped();
			}
			this.renderer.render(this.stage);
			requestAnimationFrame(this.game_render.bind(this));
		}
	},
	stoped: function ()
	{
		if (this.is_started === true)
		{
			this.is_started = false;
			this.fireEvent('crash');
		}
	},
	progress: function ()
	{
	},
	start: function ()
	{
		if (this.is_started === false)
		{
			this.reset();
			this.is_started = true;
		}
		if (this.is_loose === true)
		{
			this.reset();
		}
		this.game_render();
	},
	reset: function ()
	{
		this.is_win     = false;
		this.is_loose   = false;
		this.is_started = false;
		
		this.bg.reset();
		this.mid.reset();
		this.bee.reset();
		this.bee_alpha.reset();
		this.mid_alpha.reset();
	},
	update: function ()
	{
		var a_speed   = 0.5;
		var mov_speed = 2;
		var a         = 2000;
		var p         = -1 * this.mid.pos.x;
		var d         = Math.floor(p / a);
		mov_speed     = mov_speed + d * 0.5;
		var sp        = this.prev_speed + ((mov_speed - this.prev_speed ) / 5);
		mov_speed     = sp;
		if (mov_speed >= 8)
		{
			mov_speed = 8;
		}
		this.prev_speed = mov_speed;
		if (this.is_loose == false && this.is_started == true)
		{
			if (this.mouse_is_down == true)
			{
				this.gravity -= a_speed;
			}
			else
			{
				this.gravity += a_speed;
			}
			if (this.gravity > 15)
			{
				this.gravity = 15
			}
			if (this.gravity < -15)
			{
				this.gravity = -15
			}
			
			this.mid.update_pos(mov_speed);
			var sl = this.mid.get_slides();
			this.mid_alpha.update_pos(sl);
			this.bg.update_pos(mov_speed / 3);
			this.bee.update_pos(this.gravity);
			this.bee_alpha.update_pos(this.bee.pos.y);
			this.fireEvent('move', -1 * this.mid.pos.x);
		}
	},
	play_win: function ()
	{
		this.bee.play_win();
	}
});

var App = {
	urls: {
		vote: d_base + "/",
		start: d_base + "/",
		score: d_base + "/",
	},
	init: function ()
	{
		$('homebutton').addEvent('click', function ()
		{
			document.location = '/';
		});
		this.bar      = $('bar');
		this.is_muted = false;
		this.snd_btn  = $('soundtoggle');
		this.snd_btn.addEvent('click', this.mute.bind(this));
		this.va           = $('voteadd');
		this.add_vote_req = new Request.JSON({url: this.urls.vote, onSuccess: this.vote_resp.bind(this)});
		this.start_req    = new Request.JSON({url: this.urls.start});
		this.score_req    = new Request.JSON({url: this.urls.score});
		this.limit        = 100;
		this.is_win       = false;
		this.current      = 0;
		
		this.sounds          = $$('audio');
		this.crashsound      = $$('audio.crashsound');
		this.musicsound      = $('musicsound');
		this.musicsound.gain = 0.6;
		this.bonussound	 = $$('audio.bonussound');
		this.successound     = $('successound');
		this.flysound        = $('flysound');
		
		var btns = $$('button.start');
		for (var i = 0; i < btns.length; i++)
		{
			btns[i].addEvent('click', this.start_game.bind(this));
		}
		btns = $$('button.close');
		for (var i = 0; i < btns.length; i++)
		{
			btns[i].addEvent('click', this.loaded.bind(this));
		}
		$('toptenbtn').addEvent('click', this.open_top_ten.bind(this));
		$('rulesbtn').addEvent('click', this.open_rules.bind(this));
		this.g = new Game($("game-canvas"));
		
		this.g.addEvents({
			                 'crash': this.game_crash.bind(this),
			                 'move': this.game_move.bind(this),
			                 'loaded': this.loaded.bind(this)
		                 });
		this.dists = $$('.amount');
		this.ln    = $('prog');
		if (already_voted == true)
		{
			this.hide_bar();
		}
	},
	hide_bar: function ()
	{
		this.bar.addClass('hide');
		document.body.addClass('already_voted');
	},
	mute: function ()
	{
		if (this.is_muted === false)
		{
			for (var i = 0; i < this.sounds.length; i++)
			{
				this.sounds[i].volume = 0;
			}
			this.snd_btn.addClass('mute');
			this.is_muted = true;
		}
		else
		{
			for (var i = 0; i < this.sounds.length; i++)
			{
				this.sounds[i].volume = 1;
			}
			this.musicsound.gain = 0.6;
			this.snd_btn.removeClass('mute');
			this.is_muted = false;
		}
	},
	loaded: function ()
	{
		this.reset();
		document.body.addClass('mainpart');
	},
	reset: function ()
	{
		this.current = 0;
		this.is_win  = false;
		this.va.removeClass('visible');
		document.body.removeClass('loading');
		document.body.removeClass('mainpart');
		document.body.removeClass('rulespart');
		document.body.removeClass('toptenpart');
		document.body.removeClass('failedpart');
		document.body.removeClass('succespart');
		document.body.removeClass('gamepart');
	},
	start_game: function (e)
	{
		e.stop();
		this.reset();
		this.start_req.post();
		document.body.addClass('gamepart');
		this.g.reset();
		this.g.start();
		this.flysound.play();
		this.musicsound.play();
	},
	game_move: function (e)
	{
		var x        = Math.floor(e / 50);
		this.current = x;
		if (this.is_win === false && x >= this.limit)
		{
			this.is_win = true;
			this.send_vote(x);
		}
		for (var i = 0; i < this.dists.length; i++)
		{
			this.dists[i].set('text', x);
		}
		var w = (x / (this.limit / 100));
		if (w >= 100)
		{
			w = 100;
		}
		this.ln.setStyles({'width': w + '%'});
	},
	open_rules: function (e)
	{
		e.stop();
		this.reset();
		document.body.addClass('rulespart');
	},
	open_top_ten: function (e)
	{
		e.stop();
		this.reset();
		document.body.addClass('toptenpart');
	},
	game_crash: function ()
	{
		var r                          = Number.random(0, 2);
		this.crashsound[r].currentTime = 0;
		this.crashsound[r].play();
		this.flysound.pause();
		this.show_crashparts.delay(1000, this);
	},
	show_crashparts: function ()
	{
		var c = this.current;
		this.send_score(c);
		this.reset();
		if (c >= this.limit)
		{
			document.body.addClass('succespart');
		}
		else
		{
			document.body.addClass('failedpart');
		}
	},
	send_score: function (c)
	{
		this.score_req.post({score: c});
	},
	send_vote: function (c)
	{
		document.body.removeClass('new_vote');
		var r                          = Number.random(0, 2);
		this.bonussound[r].currentTime = 0;
		this.bonussound[r].play();
		this.hide_bar();
		this.add_vote_req.cancel();
		this.add_vote_req.post({score: c});
	},
	vote_resp: function (o)
	{
		if (o.success === true)
		{
			document.body.addClass('new_vote');
			this.g.play_win();
			this.successound.curentTime = 0;
			this.successound.play();
			this.va.addClass('visible');
		}
	}
}
window.addEvent('domready', App.init.bind(App));
