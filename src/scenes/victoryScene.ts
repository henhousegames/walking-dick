import * as Phaser from "phaser";

export default class VictoryScene extends Phaser.Scene {
  private score: number;

    constructor() {
        super('VictoryScene');
    }
    init(data) {
        this.score = data.score || 0; // default to 0 if not provided
  
      }
    create() {
        const victoryText = 'You Won!';
        this.add.text(400, 300, victoryText, { fontSize: '64px', color: '#fff' }).setOrigin(0.5);
        this.add.text(400, 350, 'Score: ' + this.score, { fontSize: '26px', color: '#ffffff' }).setOrigin(0.5);

        const backButton = this.add.text(400, 400, 'Back to Menu', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
        backButton.setInteractive();
        backButton.on('pointerdown', () => { this.scene.start('LevelScene'); });

        const playAgainButton = this.add.text(400, 450, 'Play Again', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
        playAgainButton.setInteractive();
        playAgainButton.on('pointerdown', () => { this.scene.start('GameScene'); });
    }
}
