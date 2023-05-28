import * as Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  levelText;
  scoreText;
  score = 0;
  cursors;
  platforms;
  stars;
  player;
  level;
  flag;
  private deathLine: number; // y-coordinate value beyond which player is considered dead

  constructor() {
    super({ key: "GameScene" });
  }

  init(data) {
    this.level = data.level || 1; // default to level 1 if not provided
  }

  preload() {
    console.log("preload", this.level);
    let path = `levels/${this.level}.json`;
    console.log("path", path);
    this.load.json(this.level, path);

    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/ground.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("flag", "assets/Flag.png", {
      frameWidth: 33,
      frameHeight: 50,
    });
    this.load.spritesheet("dude", "assets/dick.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
  }

  create() {
    this.physics.world.setBounds(0, 0, 8000, 600); // assuming the size of your world

    this.add.image(500, 300, "sky");

    this.platforms = this.physics.add.staticGroup();

    let levelData = this.cache.json.get(this.level);

    // Create Level
    for (let index = levelData.items.length - 1; index >= 0; index--) {
      const row = levelData.items[index];

      console.log("row", row);
      for (let j = 0; j < row.length; j++) {
        const element = row[j];
        if (element === 1) {
          let x = 50 + j * 100;
          let y = 575 + (index - (levelData.items.length - 1)) * 50;
          console.log("x: ", x, "y: ", y);
          this.platforms.create(x, y, "ground");
        }
      }
    }
    // Define the y-coordinate death line, beyond which the player will be considered dead
    // Here it's set to the bottom of the world bounds, but you can adjust to suit your game design
    this.deathLine = this.physics.world.bounds.height - 50;

    this.player = this.physics.add.sprite(100, 450, "dude");

    this.flag = this.physics.add.sprite(900, 200, "flag");
    this.flag.setCollideWorldBounds(true);
    this.flag.setBounce(0);
    this.anims.create({
      key: "flagging",
      frames: this.anims.generateFrameNumbers("flag", { start: 0, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });

    this.flag.anims.play("flagging", true);


    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0, 0, 8000, 600); // set camera bounds
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05); // make camera follow player

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 2 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Add score text to the UI Camera
    this.scoreText = this.add.text(16, 16, "score: 0", { fontSize: "32px" });
    this.scoreText.setScrollFactor(0); // This will fix the position of the text to the camera.

    // Add level text to the UI Camera
    this.levelText = this.add.text(
      this.cameras.main.width - 100,
      16,
      "level: " + this.level,
      { fontSize: "32px" }
    );
    this.levelText.setScrollFactor(0); // This will fix the position of the text to the camera.

    // Use setOrigin to adjust the alignment of the text
    // (0,0) is the top left, (1,1) is the bottom right.
    // For the level text, we align it to the top right.
    this.levelText.setOrigin(1, 0);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.flag, this.platforms);

    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );
  }

  update() {
    var pointer = this.input.activePointer;
    // Auto Move Player
    this.player.setVelocityX(160);
    this.player.anims.play("left", true);
    if (
      this.player.body.touching.down &&
      (pointer.isDown || this.cursors.up.isDown)
    ) {
      this.player.setVelocityY(-800);
      console.log("test");
    }
    // Check if player has fallen into a hole
    if (this.player.y > this.deathLine) {
      this.gameOver();
    }
  }

  gameOver() {
    // Switch to GameOverScene
    this.scene.start("GameOverScene", { level: this.level, score: this.score });
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}
