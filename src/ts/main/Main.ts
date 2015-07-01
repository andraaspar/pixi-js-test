/// <reference path='../../../lib/illa/_module.ts'/>
/// <reference path='../../../lib/illa/Arrkup.ts'/>
/// <reference path='../../../lib/illa/Log.ts'/>

/// <reference path='../../../lib/jQuery.d.ts'/>

/// <reference path='../PIXI.d.ts'/>

/// <reference path='Star.ts'/>

module main {
	export class Main {
		
		static BLUE = 0x00aaff;
		static WHITE = 0xffffff;
		static BLACK = 0;
		static PINK = 0xaa0077;
		static YELLOW = 0xffcd11;

		private static instance = new Main();
		
		private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
		private stage: PIXI.Container;
		private bg: PIXI.Sprite;
		private windowJq: jQuery.IInstance = jQuery(window);
		private bloomFilter: PIXI.filters.BloomFilter;
		private starsCount: number;
		private starsCountText: PIXI.Text;
		private replayText: PIXI.Text;
		private timeText: PIXI.Text;
		private fpsText: PIXI.Text;
		private lastWhiteStars: number;
		private startTime: number;
		private endTime: number;
		private starsContainer: PIXI.Container;
		private frameCounter: number = 0;
		private lowestFPS = Infinity;

		constructor() {
			jQuery(illa.bind(this.onDomLoaded, this));
		}

		protected onDomLoaded(): void {
			illa.Log.info('DOM loaded.');
			
			PIXI.loader.add('bg', 'style/images/{{bg.jpg}}');
			PIXI.loader.add('glow', 'style/images/{{glow.png}}');
			PIXI.loader.once('complete', illa.bind(this.onResourcesLoaded, this));
			PIXI.loader.load();
		}
		
		protected onResourcesLoaded(): void {
			
			this.renderer = PIXI.autoDetectRenderer(1200, 400);
//			this.renderer = new PIXI.CanvasRenderer(1200, 400);
			jQuery('body').append(this.renderer.view);
			
			this.stage = new PIXI.Container();
			
			this.starsContainer = new PIXI.Container();
			this.stage.addChild(this.starsContainer);
			
			this.bloomFilter = new PIXI.filters.BloomFilter();
			this.bloomFilter.blur = 10;
			this.starsContainer.filters = [this.bloomFilter];
			
			this.bg = PIXI.Sprite.fromImage(PIXI.loader.resources['bg'].url);
			//this.bg.tint = 0x222233;
			this.starsContainer.addChild(this.bg);
			
			this.starsCount = Math.ceil(this.windowJq.width() * this.windowJq.height() / 5000);
			this.starsCount = Math.min(50, this.starsCount);
			for (var i = 0; i < this.starsCount; i++) {
				this.starsContainer.addChild(new Star());
			}
			
			this.fpsText = new PIXI.Text('', {font: '12px sans-serif', fill: Main.WHITE, align: 'right'});
			this.fpsText.anchor.x = 1;
			this.fpsText.alpha = .6;
			this.fpsText.blendMode = PIXI.BLEND_MODES.ADD;
			this.stage.addChild(this.fpsText);
			
			this.timeText = new PIXI.Text('', {font: '20px sans-serif', fill: Main.WHITE, align: 'center'});
			this.timeText.anchor.x = .5;
			this.timeText.alpha = .6;
			this.timeText.blendMode = PIXI.BLEND_MODES.ADD;
			this.stage.addChild(this.timeText);
			
			this.starsCountText = new PIXI.Text('', {font: 'bold 80px sans-serif', fill: Main.WHITE, align: 'center'});
			this.starsCountText.anchor.x = .5;
			this.starsCountText.anchor.y = .8;
			this.starsCountText.alpha = .6;
			this.starsCountText.blendMode = PIXI.BLEND_MODES.ADD;
			this.stage.addChild(this.starsCountText);
			
			this.replayText = new PIXI.Text('↻', {font: '100px sans-serif', fill: Main.WHITE, align: 'center'});
			this.replayText.anchor.x = .5;
			this.replayText.anchor.y = 1;
			this.replayText.alpha = 0;
			this.replayText.on('click', illa.bind(this.onReplayClicked, this));
			this.replayText.on('tap', illa.bind(this.onReplayClicked, this));
			this.stage.addChild(this.replayText);
			
			var replayDropShadow = new PIXI.filters.DropShadowFilter();
			replayDropShadow.blur = 10;
			replayDropShadow.distance = 0;
			this.replayText.filters = [replayDropShadow];
			
			this.windowJq.on('resize', illa.bind(this.onWindowResized, this));
			this.onWindowResized(null);
			
			PIXI.ticker.shared.add(illa.bind(this.animate, this));
			
			this.start();
		}
		
		protected start(): void {
			this.startTime = new Date().getTime();
			this.endTime = 0;
		}
		
		protected end(): void {
			this.endTime = new Date().getTime();
		}
		
		protected onReplayClicked(e: Event): void {
			for (var i = 0, n = this.starsContainer.children.length; i < n; i++) {
				var child = this.starsContainer.children[i];
				if (child instanceof Star) {
					child.reset();
				}
			}
			
			this.start();
		}
		
		protected animate(framesElapsed: number): void {
			var whiteStarsCount = this.starsCount;
			var prevStar: Star;
			for (var i = 0, n = this.starsContainer.children.length; i < n; i++) {
				var child = this.starsContainer.children[i];
				if (child instanceof Star) {
					child.updateStar(framesElapsed);
					if (child.tint == Main.WHITE) {
						if (prevStar && prevStar.tint == Main.BLUE) this.starsContainer.swapChildren(prevStar, child);
					} else {
						whiteStarsCount--;
					}
					prevStar = child;
				}
			}
			
			this.bg.tint = this.getColor(0x000033, 0x5522aa, whiteStarsCount / this.starsCount);
			
			this.starsCountText.scale.x += (.5 - this.starsCountText.scale.x) / 4;
			this.starsCountText.scale.y = this.starsCountText.scale.x;
			if (whiteStarsCount != this.lastWhiteStars) {
				this.lastWhiteStars = whiteStarsCount;
				this.starsCountText.text = whiteStarsCount < this.starsCount ? this.starsCount - whiteStarsCount + '' : 'You win!';
				this.starsCountText.scale.x = this.starsCountText.scale.y = 1;
				
				this.replayText.interactive = whiteStarsCount == this.starsCount;
				if (this.replayText.interactive) this.end();
				if (!this.replayText.interactive) {
					this.replayText.alpha = 0;
				}
			}
			
			if (this.replayText.interactive && this.replayText.alpha < 1) this.replayText.alpha += .5;
			
			var timeElapsed = (this.endTime || new Date().getTime()) - this.startTime;
			timeElapsed = Math.floor(timeElapsed / 100) / 10;
			this.timeText.text = timeElapsed + ' s';
			
			this.lowestFPS = Math.min(PIXI.ticker.shared.FPS, this.lowestFPS);
			if (this.frameCounter <= 0) {
				this.fpsText.text = Math.round(this.lowestFPS * 10) / 10 + ' FPS';
				this.lowestFPS = Infinity;
				this.frameCounter = 30;
			}
			this.frameCounter -= framesElapsed;
			
			this.renderer.render(this.stage);
		}
		
		protected onWindowResized(e: jQuery.IEvent): void {
			this.renderer.resize(this.windowJq.width(), this.windowJq.height());
			this.bg.width = this.renderer.width;
			this.bg.height = this.renderer.height;
			this.starsCountText.x = this.bg.width / 2;
			this.starsCountText.y = this.bg.height * .48;
			this.replayText.x = this.starsCountText.x;
			this.replayText.y = this.renderer.height * .95;
			this.timeText.x = this.starsCountText.x;
			this.timeText.y = this.renderer.height * .03;
			this.fpsText.x = this.renderer.width - 5;
			this.fpsText.y = 5;
		}
		
		protected getColor(a: number, b: number, t: number): number {
			var rgbA = this.getRGB(a);
			var rgbB = this.getRGB(b);
			var rgbC = [this.interpolate(rgbA[0], rgbB[0], t), this.interpolate(rgbA[1], rgbB[1], t), this.interpolate(rgbA[2], rgbB[2], t)];
			return this.getHex(rgbC);
		}
		
		protected interpolate(a: number, b: number, t: number): number {
			return a + (b - a) * t;
		}
		
		protected getRGB(a: number): number[] {
			return [a & 0xff, (a & 0xff00) >>> 8, (a & 0xff0000) >>> 16];
		}
		
		protected getHex(a: number[]): number {
			return a[0] + (a[1] << 8) + (a[2] << 16);
		}
		
		static getRenderer(): PIXI.WebGLRenderer | PIXI.CanvasRenderer {
			return this.instance.renderer;
		}
		
		static getWindowJq(): jQuery.IInstance {
			return this.instance.windowJq;
		}
	}
}