import Phaser from 'phaser'

import Game from './scenes/Game'
import Preloader from './scenes/Preloader'
import GameOver from "~/scenes/GameOver";

const config: Phaser.Types.Core.GameConfig = {
	parent: 'mygame',
	type: Phaser.AUTO,
	width: 800,
	height: 640,
	scale: {
		mode: Phaser.Scale.FIT,
		// ...
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			// debug: true
		}
	},
	scene: [Preloader, Game, GameOver]
}

export default new Phaser.Game(config)
