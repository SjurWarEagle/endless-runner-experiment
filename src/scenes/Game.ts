import Phaser from 'phaser'
import SceneKeys from "~/consts/SceneKeys";
import TextureKeys from '~/consts/TextureKeys';
import RocketMouse from "~/game/RocketMouse";
import LaserObstacle from "~/game/LaserObstacle";

export default class Game extends Phaser.Scene {
    private CNT_COINS: number = 10;
    // create the background class property
    private mouse!: RocketMouse;
    private background!: Phaser.GameObjects.TileSprite;
    private coins!: Phaser.Physics.Arcade.StaticGroup
    private laserObstacle!: LaserObstacle;

    private scoreLabel!: Phaser.GameObjects.Text
    private liveLabel!: Phaser.GameObjects.Text
    private score = 0;
    private lives = 3;

    public init() {
        this.score = 0;
        this.lives = 1;
    }

    constructor() {
        super(SceneKeys.Game)
    }

    public create() {
        const height = this.scale.height;
        const width = this.scale.width;

        this.background = this.add.tileSprite(0, 0, width, height, TextureKeys.Background)
            .setOrigin(0, 0)
            .setScrollFactor(0, 0);

        this.laserObstacle = new LaserObstacle(this, 900, 100)
        this.add.existing(this.laserObstacle)

        this.coins = this.physics.add.staticGroup();
        this.spawnCoins();

        // add new RocketMouse
        this.mouse = new RocketMouse(this, width * 0.25, height - 100)
        this.add.existing(this.mouse);

        // error happens here
        const body = this.mouse.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setVelocityX(200);

        this.physics.world.setBounds(
            0, 0, // x, y
            Number.MAX_SAFE_INTEGER, height - 40 // width, height
        )

        this.cameras.main.startFollow(this.mouse);
        this.cameras.main.followOffset.set(-width * 0.35, 0);
        this.cameras.main.setBounds(100, 0, Number.MAX_SAFE_INTEGER, height);

        this.physics.add.overlap(
            this.laserObstacle.top,
            this.mouse,
            this.handleTouchedGateBorder,
            undefined,
            this
        );

        this.physics.add.overlap(
            this.laserObstacle.bottom,
            this.mouse,
            this.handleTouchedGateBorder,
            undefined,
            this
        );

        this.physics.add.overlap(
            this.coins,
            this.mouse,
            this.handleCollectCoin,
            undefined,
            this
        );

        this.physics.add.overlap(
            this.laserObstacle,
            this.mouse,
            this.handleOverlapLaser,
            undefined,
            this
        );

        this.scoreLabel = this.add.text(10, 10, `Score: ${this.score}`, {
            fontSize: '24px',
            color: '#080808',
            backgroundColor: '#F8E71C',
            shadow: {fill: true, blur: 0, offsetY: 0},
            padding: {left: 15, right: 15, top: 10, bottom: 10}
        }).setScrollFactor(0)

        this.liveLabel = this.add.text(10, 50, `Lives: ${this.lives}`, {
            fontSize: '12px',
            color: '#080808',
            backgroundColor: '#F8E71C',
            shadow: {fill: true, blur: 0, offsetY: 0},
            padding: {left: 15, right: 15, top: 10, bottom: 10}
        }).setScrollFactor(0)

    }

    private handleTouchedGateBorder(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        if ((this.laserObstacle.top.getData('touched')) || (this.laserObstacle.bottom.getData('touched'))) {
            return;
        }
        this.laserObstacle.top.setData('touched', true);
        this.laserObstacle.bottom.setData('touched', true);
        this.score -= 5;
        this.scoreLabel.text = `Score: ${this.score}`;
    }

    private handleCollectCoin(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        // obj2 will be the coin
        const coin = obj2 as Phaser.Physics.Arcade.Sprite
        // use the group to hide it
        this.coins.killAndHide(coin)
        // and turn off the physics body
        coin.body.enable = false;
        this.score++;
        this.scoreLabel.text = `Score: ${this.score}`;
        this.generateCoin();
    }

    private handleOverlapLaser(
        obj1: Phaser.GameObjects.GameObject,
        obj2: Phaser.GameObjects.GameObject
    ) {
        const gate = obj1 as LaserObstacle;
        gate.touched = true;
    }

    private wrapCoins() {
        const scrollX = this.cameras.main.scrollX;

        this.coins.children.each(child => {
            const coin = child as Phaser.Physics.Arcade.Sprite;
            const body = coin.body as Phaser.Physics.Arcade.StaticBody;
            const width = body.width;

            if (coin.x + width < scrollX) {
                this.coins.killAndHide(coin);
                coin.body.enable = false;
                this.generateCoin();
            }
        })
    }

    private wrapLaserObstacle() {
        const scrollX = this.cameras.main.scrollX
        const rightEdge = scrollX + this.scale.width
        // body variable with specific physics body type
        const body = this.laserObstacle.body as
            Phaser.Physics.Arcade.StaticBody
        // use the body's width
        const width = body.width
        if (this.laserObstacle.x + width < scrollX) {
            if (!this.laserObstacle.touched) {
                this.missedObstacle();
            }
            this.laserObstacle.x = Phaser.Math.Between(
                rightEdge + width,
                rightEdge + width + 1000
            )
            this.laserObstacle.y = Phaser.Math.Between(0, 300)
            // set the physics body's position
            // add body.offset.x to account for x offset
            body.position.x = this.laserObstacle.x + body.offset.x
            body.position.y = this.laserObstacle.y + body.offset.y;
            this.laserObstacle.touched = false;

            this.laserObstacle.updateBorders();
            this.laserObstacle.resetTouched();
        }
    }

    update(t: number, dt: number) {
        // scroll the background
        this.background.setTilePosition(this.cameras.main.scrollX);

        this.wrapLaserObstacle();
        this.wrapCoins();
    }

    private spawnCoins() {
        // make sure all coins are inactive and hidden
        this.coins.children.each(child => {
            const coin = child as Phaser.Physics.Arcade.Sprite
            this.coins.killAndHide(coin)
            coin.body.enable = false
        })
        const numCoins = Phaser.Math.Between(1, this.CNT_COINS);

        for (let i = 0; i < numCoins; ++i) {
            this.generateCoin();
        }
    }

    private generateCoin() {
        const scrollX = this.cameras.main.scrollX
        const rightEdge = scrollX + this.scale.width
        // start at 100 pixels past the right side of the screen
        let x = rightEdge + Phaser.Math.Between(100, 1000);

        const coin = this.coins.get(
            x,
            Phaser.Math.Between(100, this.scale.height - 100),
            TextureKeys.Coin
        ) as Phaser.Physics.Arcade.Sprite

        const body = coin.body as Phaser.Physics.Arcade.StaticBody

        // make sure coin is active and visible
        coin.setVisible(true)
        coin.setActive(true)

        // enable and adjust physics body to be a circle
        body.setCircle(body.width * 0.5)
        body.enable = true
        // move x a random amount
        // x += coin.width * 1.5

        // update the body x, y position from the GameObject
        body.updateFromGameObject()
    }

    private missedObstacle() {
        this.lives--;
        if (this.lives <= 0) {
            this.mouse.kill();
        }
        this.liveLabel.text = `Lives: ${this.lives}`;
    }
}
