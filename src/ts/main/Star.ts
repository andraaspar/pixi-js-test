

module main {
	export class Star extends PIXI.Sprite {
		
		private speed: number;
		private isZoomingIn: boolean;
		private lineBelow: PIXI.Sprite;
		private lineBelowScaleXDefault: number;
		private lineBelowScaleYDefault: number;
		
		constructor() {
			super(PIXI.Texture.fromImage(PIXI.loader.resources['glow'].url));
			
			this.blendMode = PIXI.BLEND_MODES.ADD;
			this.anchor.x = .5;
			this.anchor.y = .5;
			this.hitArea = new PIXI.Circle(0, 0, this.texture.width / 4);
			this.interactive = true;
			this.on('click', illa.bind(this.onClicked, this));
			this.on('tap', illa.bind(this.onClicked, this));
			
			this.lineBelow = new PIXI.Sprite(this.texture);
			this.lineBelow.blendMode = PIXI.BLEND_MODES.ADD;
			this.addChild(this.lineBelow);
			this.lineBelow.width = 10;
			this.lineBelow.height = Main.getWindowJq().height();
			this.lineBelow.anchor.x = .5;
			this.lineBelow.anchor.y = .25;
			this.lineBelowScaleXDefault = this.lineBelow.scale.x;
			this.lineBelowScaleYDefault = this.lineBelow.scale.y;
			
			this.reset();
		}
		
		updateStar(framesElapsed: number): void {
			this.x += this.speed * this.scale.x * framesElapsed;
			this.y += this.speed / 2 * this.scale.x * framesElapsed;
			
			this.rotation = (this.rotation + PIXI.DEG_TO_RAD * framesElapsed) % PIXI.PI_2;
			
			if (this.isZoomingIn) {
				this.scale.x += .01 * framesElapsed;
				this.scale.y += .01 * framesElapsed;
			} else {
				this.scale.x -= .01 * framesElapsed;
				this.scale.y -= .01 * framesElapsed;
			}
			if (this.scale.x >= 2 || this.scale.x <= .01) {
				this.isZoomingIn = !this.isZoomingIn;
				this.scale.x = Math.min(2, Math.max(.01, this.scale.x));
				this.scale.y = Math.min(2, Math.max(.01, this.scale.y));
			}
			
			if (this.x - this.width / 2 > Main.getRenderer().width) {
				this.x = -this.width / 2;
			}
			if (this.y - this.height / 2 > Main.getRenderer().height) {
				this.y = -this.height / 2;
				this.alpha = 0;
			}
			
			if (this.alpha < 1) {
				this.alpha += .05 * framesElapsed;
				this.alpha = Math.min(1, this.alpha);
			}
			
			this.lineBelow.rotation = -this.rotation;
			this.lineBelow.scale.x = this.lineBelowScaleXDefault * (1 / this.scale.x);
			this.lineBelow.scale.y = this.lineBelowScaleYDefault * (1 / this.scale.y);
		}
		
		reset(): void {
			this.tint = Main.BLUE;
			this.alpha = 0;
			this.scale.y = this.scale.x = Math.random() * 2;
			this.isZoomingIn = Math.random() < .5;
			this.rotation = Math.random() * PIXI.PI_2;
			this.speed = 1 + Math.random() * 3;
			
			this.x = Math.floor(Math.random() * Main.getWindowJq().width());
			this.y = Math.floor(Math.random() * Main.getWindowJq().height());
			
			this.lineBelow.tint = Main.PINK;
		}
		
		protected onClicked(e: Event): void {
			if (this.tint == Main.BLUE) {
				this.tint = Main.WHITE;
				this.lineBelow.tint = Main.YELLOW;
			} else {
				this.tint = Main.BLUE;
				this.lineBelow.tint = Main.PINK;
			}
		}
	}
}