export class SpriteAnimation {
    fps;
    loop;
    frames;
    frame;
    playing;
    constructor(fps, loop, frames) {
        this.fps = fps;
        this.loop = loop;
        this.frames = frames;
        this.frame = 0;
        this.playing = false;
    }
    clone() {
        return new SpriteAnimation(this.fps, this.loop, this.frames);
    }
}
