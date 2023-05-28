import * as Phaser from "phaser";
class Example extends Phaser.Scene {
  scoreText;
  score = 0;
  cursors;
  platforms;
  stars;
  player;

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/ground.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/dick.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
  }

  create() {
    this.add.image(500, 300, "sky");

    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(50, 575, "ground");
    this.platforms.create(150, 575, "ground");
    this.platforms.create(250, 575, "ground");
    this.platforms.create(350, 575, "ground");
    this.platforms.create(450, 575, "ground");
    this.platforms.create(450, 525, "ground");
    this.platforms.create(550, 575, "ground");
    this.platforms.create(650, 575, "ground");
    this.platforms.create(750, 575, "ground");
    this.platforms.create(850, 575, "ground");
    this.platforms.create(950, 575, "ground");

    this.player = this.physics.add.sprite(100, 450, "dude");

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

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

    this.scoreText = this.add.text(16, 16, "score: 0", { fontSize: "32px" });

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);

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
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}

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
  scene: Example,
};

const game = new Phaser.Game(config);
