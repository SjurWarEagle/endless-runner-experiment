import Phaser from 'phaser'
import TextureKeys from "~/consts/TextureKeys";

export default class LaserObstacle extends Phaser.GameObjects.Container {
    public touched = false;
    public bottom: Phaser.GameObjects.Image;
    public top: Phaser.GameObjects.Image;
    private myScene: Phaser.Scene;
    private middle: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)
        this.myScene=scene;

        // create a top
        const borders = this.scene.physics.add.staticGroup();
        this.top = (borders.get(0, 0, TextureKeys.LaserEnd) as Phaser.Physics.Arcade.Sprite)
            .setOrigin(0.5, 0);

        // create a middle and set it below the top
        this.middle = scene.add.image(
            0,
            this.top.y + this.top.displayHeight,
            TextureKeys.LaserMiddle
        ).setOrigin(0.5, 0);

        // set height of middle laser to 200px
        this.middle.setDisplaySize(this.middle.width, 200)

        // create a bottom that is flipped and below the middle
        this.bottom = (borders.get(0, this.middle.y + this.middle.displayHeight, TextureKeys.LaserEnd) as Phaser.Physics.Arcade.Sprite)
            .setOrigin(0.5, 0)
            .setFlipY(true);
        // add them all to the Container
        this.add(this.top);
        this.add(this.middle);
        this.add(this.bottom);

        this.updateBorders();

        // scene.physics.add.existing(this.top, true);
        // scene.physics.add.existing(this.bottom, true);
        // this.bottom.setActive(true);
        // this.top.setActive(true);

        // const topBody = this.top.body as Phaser.Physics.Arcade.StaticBody;
        // topBody.setCircle(topBody.width * 0.5);

        scene.physics.add.existing(this, true)
        const body = this.body as Phaser.Physics.Arcade.StaticBody
        const width = this.middle.displayWidth / 4;
        const height = this.middle.displayHeight;
        body.setSize(width, height)
        body.setOffset(-width * 0.5, this.top.displayHeight)
        // reposition body
        body.position.x = this.x + body.offset.x;
        body.position.y = this.y + this.top.displayHeight;
    }

    private initBorderTop(border: Phaser.GameObjects.Image, scene: Phaser.Scene) {
        this.initBorderCommon(border, scene);
    }

    private initBorderBottom(border: Phaser.GameObjects.Image, scene: Phaser.Scene, offset: number) {
        this.initBorderCommon(border, scene);
        const body = (border.body as Phaser.Physics.Arcade.StaticBody);
        body.position.y = body.position.y + offset;
    }

    private initBorderCommon(border: Phaser.GameObjects.Image, scene: Phaser.Scene) {
        scene.physics.add.existing(this.top, true);
        const body = (border.body as Phaser.Physics.Arcade.StaticBody);
        body.setSize(border.displayWidth, border.displayHeight);
        body.position.x = this.x - body.width / 2;
        body.position.y = this.y;
    }

    public resetTouched() {
        this.top.setData('touched',false);
        this.middle.setData('touched',false);
        this.bottom.setData('touched',false);
    }

    public updateBorders() {
        this.initBorderTop(this.top, this.myScene);
        this.initBorderBottom(this.bottom, this.myScene, this.top.displayHeight + this.middle.displayHeight);
    }
}
