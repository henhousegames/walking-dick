import * as Phaser from "phaser";

import PreloadScene from './scenes/preloadScene'
import LevelScene from './scenes/levelScene'
import GameScene from './scenes/gameScene'
import GameOverScene from "./scenes/gameOverScene";
import VictoryScene from "./scenes/victoryScene";

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "phaser-example",
    width: 1000,
    height: 600,
    min: {
      width: 1000,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1500 },
      debug: false,
    },
  },
  scene: [PreloadScene, LevelScene, GameScene, GameOverScene, VictoryScene],
};

const game = new Phaser.Game(config);
