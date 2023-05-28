
import * as Phaser from "phaser";
export default class GameOverScene extends Phaser.Scene {
  private score: number;
  private level: number;
  
    constructor() {
      super({ key: 'GameOverScene' });
    }
    init(data) {
      this.level = data.level || 1; // default to level 1 if not provided
      this.score = data.score || 0; // default to 0 if not provided

    }
    create() {
      this.add.text(100, 100, 'Game Over', { fontSize: '32px', color: '#ff0000' });
      this.add.text(100, 150, 'Score: ' + this.score, { fontSize: '26px', color: '#ffffff' });

      let playAgainButton = this.add.text(100, 200, 'Play Again', { fontSize: '20px', color: '#ffffff' });
      playAgainButton.setInteractive();
      playAgainButton.on('pointerdown', () => { 
        this.scene.start('GameScene', { level: this.level }); 
      });
  
      let backToMenuButton = this.add.text(100, 300, 'Back to Menu', { fontSize: '20px', color: '#ffffff' });
      backToMenuButton.setInteractive();
      backToMenuButton.on('pointerdown', () => { 
        this.scene.start('LevelScene'); 
      });
    }
  }
  