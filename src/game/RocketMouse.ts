import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import AnimationKeys from '../consts/AnimationKeys';
import SceneKeys from "~/consts/SceneKeys";

enum MouseState {
    Running,
    Killed,
    Dead
}

export default class RocketMouse extends Phaser.GameObjects.Container {
    private flames: Phaser.GameObjects.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private mouse: Phaser.GameObjects.Sprite;
    private mouseState = MouseState.Running;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)
        // create the flames and play the animation
        this.flames = scene.add.sprite(-63, -15, TextureKeys.RocketMouse)
            .play(AnimationKeys.RocketFlamesOn);
        this.enableJetpack(false);

        // create the Rocket Mouse sprite
        this.mouse = scene.add.sprite(0, 0, TextureKeys.RocketMouse)
            .setOrigin(0.5, 1)
            .play(AnimationKeys.RocketMouseRun);
        // add as child of Container
        this.add(this.flames);
        this.add(this.mouse);

        scene.physics.add.existing(this);

        // adjust physics body size and offset
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(this.mouse.width, this.mouse.height);
        body.setOffset(this.mouse.width * -0.5, -this.mouse.height);

        // get a CursorKeys instance
        this.cursors = scene.input.keyboard.createCursorKeys();
        // use half width and 70% of height
        body.setSize(this.mouse.width * 0.5, this.mouse.height * 0.7);
        body.setOffset(this.mouse.width * -0.3, -this.mouse.height + 15);
    }

    preUpdate() {
        // switch on this.mouseState
        const body = this.body as Phaser.Physics.Arcade.Body
        switch (this.mouseState) {
            // move all previous code into this case
            case MouseState.Running: {
                if (this.cursors.space?.isDown) {
                    body.setAccelerationY(-600)
                    this.enableJetpack(true)
                    this.mouse.play(AnimationKeys.RocketMouseFly, true)
                } else {
                    body.setAccelerationY(0)
                    this.enableJetpack(false)
                }
                if (body.blocked.down) {
                    this.mouse.play(AnimationKeys.RocketMouseRun, true)
                } else if (body.velocity.y > 0) {
                    this.mouse.play(AnimationKeys.RocketMouseFall, true)
                }
                // don't forget the break statement
                break
            }
            case MouseState.Killed: {
                // reduce velocity to 99% of current value
                body.velocity.x *= 0.99;
                // once less than 5 we can say stop
                if (body.velocity.x <= 5) {
                    this.mouseState = MouseState.Dead;
                }
                break;
            }
            case MouseState.Dead: {
                // make a complete stop
                body.setVelocity(0, 0);
                this.scene.scene.run(SceneKeys.GameOver);
                break;
            }
        }

    }

    enableJetpack(enabled: boolean) {
        this.flames.setVisible(enabled);
    }

    kill() {
        // // don't do anything if not in RUNNING state
        // if (this.mouseState !== MouseState.Running) {
        //     return
        // }
        // // set state to KILLED
        // this.mouseState = MouseState.Killed
        // this.mouse.play(AnimationKeys.RocketMouseDead)
        // const body = this.body as Phaser.Physics.Arcade.Body
        // body.setAccelerationY(0)
        // body.setVelocity(400, 0)
        // this.enableJetpack(false)
    }
}
