import Phaser from 'phaser';
import TextureKeys from '~/consts/TextureKeys';
import SceneKeys from '~/consts/SceneKeys';
import AnimationKeys from "~/consts/AnimationKeys";


export default class Preloader extends Phaser.Scene {


    constructor() {
        super(SceneKeys.Preloader)
    }

    preload() {
        this.load.image(TextureKeys.Coin, 'house/object_coin.png');

        this.load.image(TextureKeys.Background, 'spaceship/bg_spaceship.png')
        // this.load.image(TextureKeys.Background1, 'spaceship/bg_spaceship_1.png')
        // this.load.image(TextureKeys.Background2, 'spaceship/bg_spaceship_2.png')
        // this.load.image(TextureKeys.Background3, 'spaceship/bg_spaceship_3.png')
        this.load.atlas(TextureKeys.RocketMouse, 'characters/rocket-mouse.png', 'characters/rocket-mouse.json')

        this.load.image(TextureKeys.LaserEnd, 'house/object_laser_end.png');
        this.load.image(TextureKeys.LaserMiddle, 'house/object_laser.png');

    }

    create() {
        this.anims.create({
            key: AnimationKeys.RocketMouseRun,
            // helper to generate frames
            frames: this.anims.generateFrameNames('rocket-mouse', {
                start: 1,
                end: 4,
                prefix: 'rocketmouse_run',
                zeroPad: 2,
                suffix: '.png'
            }),
            frameRate: 10,
            repeat: -1 // -1 to loop forever
        });

        // new fall animation
        this.anims.create({
            key: AnimationKeys.RocketMouseFall,
            frames: [{
                key: TextureKeys.RocketMouse,
                frame: 'rocketmouse_fall01.png'
            }]
        });

        // new fly animation
        this.anims.create({
            key: AnimationKeys.RocketMouseFly,
            frames: [{
                key: TextureKeys.RocketMouse,
                frame: 'rocketmouse_fly01.png'
            }]
        });

        this.anims.create({
            key: AnimationKeys.RocketMouseDead,
            frames: this.anims.generateFrameNames(TextureKeys.RocketMouse,
                {
                    start: 1,
                    end: 2,
                    prefix: 'rocketmouse_dead',
                    zeroPad: 2,
                    suffix: '.png'
                }),
            frameRate: 10
        })

        // create the flames animation
        this.anims.create({
            key: AnimationKeys.RocketFlamesOn,
            frames: this.anims.generateFrameNames(TextureKeys.RocketMouse,
                {start: 1, end: 2, prefix: 'flame', suffix: '.png'}),
            frameRate: 10,
            repeat: -1
        })

        this.scene.start(SceneKeys.Game);
    }
}
