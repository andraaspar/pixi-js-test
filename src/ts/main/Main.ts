/// <reference path='../../../lib/illa/_module.ts'/>
/// <reference path='../../../lib/illa/Arrkup.ts'/>
/// <reference path='../../../lib/illa/Log.ts'/>

/// <reference path='../../../lib/jQuery.d.ts'/>

/// <reference path='../PIXI.d.ts'/>

module main {
	export class Main {
		
		private static YELLOW = 0xffcd11;
		private static WHITE = 0xffffff;
		private static BLACK = 0;

		private static instance = new Main();
		
		private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
		private stage: PIXI.Graphics;
		private circle: PIXI.Graphics;
//		private cm: PIXI.filters.ColorMatrixFilter;
//		private rotation: number = 0;
		private circleFill: number = Main.YELLOW;
		private circleZoomIn = true;
		private windowJq: jQuery.IInstance = jQuery(window);

		constructor() {
			jQuery(illa.bind(this.onDomLoaded, this));
		}

		onDomLoaded(): void {
			illa.Log.info('DOM loaded.');
			
//			this.renderer = PIXI.autoDetectRenderer(1200, 400, {antialias: true});
			this.renderer = new PIXI.CanvasRenderer(1200, 400, {antialias: true});
			jQuery('body').append(this.renderer.view);
			
			this.stage = new PIXI.Graphics();
			this.stage.beginFill(0xf0f0f0);
			this.stage.drawRect(0, 0, 9999, 9999);
			this.stage.endFill();
			
			this.circle = new PIXI.Graphics();
			this.drawCircle(this.circleFill);
			this.circle.x = 200;
			this.circle.y = 200;
			this.stage.addChild(this.circle);
			this.circle.interactive = true;
			this.circle.on('click', illa.bind(this.onCircleClicked, this));
			this.circle.on('tap', illa.bind(this.onCircleClicked, this));
			
//			this.cm = new PIXI.filters.ColorMatrixFilter();
//			this.circle.filters = [this.cm];
			
			this.windowJq.on('resize', illa.bind(this.onWindowResized, this));
			this.onWindowResized(null);
			
			this.animate(0);
		}
		
		animate(ms: number): void {
			this.circle.x += 3;
			this.circle.y += 1.5;
			
			if (this.circleZoomIn) {
				this.circle.scale.x += .01;
				this.circle.scale.y += .01;
			} else {
				this.circle.scale.x -= .01;
				this.circle.scale.y -= .01;
			}
			if (this.circle.scale.x >= 2 || this.circle.scale.x <= .01) {
				this.circleZoomIn = !this.circleZoomIn;
			}
			
			if (this.circle.x - 105 * this.circle.scale.x > this.renderer.width) {
				this.circle.x = -105 * this.circle.scale.x;
			}
			if (this.circle.y - 105 * this.circle.scale.y > this.renderer.height) {
				this.circle.y = -105 * this.circle.scale.y;
			}
			
//			this.rotation = (this.rotation + 1) % 360;
//			this.cm.hue(this.rotation);
			
			this.renderer.render(this.stage);
			
			requestAnimationFrame(illa.bind(this.animate, this));
		}
		
		drawCircle(color: number): void {
			this.circle.clear();
			this.circle.lineStyle(10, color == Main.BLACK ? Main.WHITE : Main.BLACK);
			this.circle.beginFill(color);
			this.circle.drawCircle(0, 0, 100);
			this.circle.endFill();
		}
		
		onCircleClicked(e: jQuery.IEvent): void {
			if (this.circleFill == Main.YELLOW) {
				this.circleFill = Main.BLACK;
			} else {
				this.circleFill = Main.YELLOW;
			}
			this.drawCircle(this.circleFill);
		}
		
		onWindowResized(e: jQuery.IEvent): void {
			this.renderer.resize(this.windowJq.width(), this.windowJq.height());
		}
	}
}