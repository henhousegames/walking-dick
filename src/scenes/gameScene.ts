import * as Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  levelText;
  scoreText;
  score = 0;
  cursors;
  platforms;
  stars;
  thorns;
  stones;
  player;
  level;
  flags;
  private deathLine: number; // y-coordinate value beyond which player is considered dead
  mountain: Phaser.GameObjects.TileSprite;
  cloud: Phaser.GameObjects.TileSprite;
  tree: Phaser.GameObjects.TileSprite;
  sky: Phaser.GameObjects.TileSprite;

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

    this.load.image("sky", "assets/backgrounds/sky.png");
    this.load.image("mountains", "assets/backgrounds/mountains.png");
    this.load.image("clouds", "assets/backgrounds/clouds.png");
    this.load.image("trees", "assets/backgrounds/trees.png");
    this.load.image("ground", "assets/ground.png");
    this.load.image("ground-filler", "assets/ground-filler.png");
    this.load.image("star", "assets/star.png");
    this.load.image("thorn", "assets/thorn.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.image("stones", "assets/stones.png");
    this.load.spritesheet("flag", "assets/flag.png", {
      frameWidth: 33,
      frameHeight: 50,
    });
    this.load.spritesheet("dude", "assets/dick.png", {
      frameWidth: 70,
      frameHeight: 80,
    });
  }

  create() {
    this.physics.world.setBounds(0, 0, 8250, 1125); // assuming the size of your world

    // Adding tile sprites at respective depths
    this.sky = this.add.tileSprite(0, 0, 1000, 600, "sky");
    this.sky.setOrigin(0, 0);
    this.sky.setScrollFactor(0);

    // Adding tile sprites at respective depths
    this.mountain = this.add.tileSprite(0, 250, 1303, 350, "mountains");
    this.mountain.setOrigin(0, 0);
    this.mountain.setScrollFactor(0);

    this.cloud = this.add.tileSprite(0, 32, 1000, 299, "clouds");
    this.cloud.setOrigin(0, 0);
    this.cloud.setScrollFactor(0);

    this.tree = this.add.tileSprite(0, 350, 1000, 250, "trees");
    this.tree.setOrigin(0, 0);
    this.tree.setScrollFactor(0);

    this.anims.create({
      key: "flagging",
      frames: this.anims.generateFrameNumbers("flag", { start: 0, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });

    // Assuming these assets have been loaded in preload() function
    this.platforms = this.physics.add.staticGroup();
    this.flags = this.physics.add.staticGroup();
    this.thorns = this.physics.add.staticGroup();
    this.stars = this.physics.add.staticGroup();
    this.stones = this.physics.add.staticGroup();

    let levelData = this.cache.json.get(this.level);

    let groundCreated = new Array(levelData.items[0].length).fill(false);

    // Create Level
    for (let j = 0; j < levelData.items[0].length; j++) {
      for (let index = 0; index < levelData.items.length; index++) {
        const element = levelData.items[index][j];
        let x = 50 + j * 100;
        let y = 250 + index * 50;

        if (element === 1) {
          if (!groundCreated[j]) {
            this.platforms.create(x, y, "ground");
            groundCreated[j] = true;
          } else {
            if (levelData.items[index - 1][j] === 1) {
              this.platforms.create(x, y, "ground-filler");
            } else {
              this.platforms.create(x, y, "ground");
            }
          }
        } else if (element === 2) {
          let flag = this.flags.create(x, y, "flag");
          flag.play("flagging");
        } else if (element === 3) {
          let star = this.stars.create(x, y, "star");
        } else if (element === 4) {
          let thorn = this.thorns.create(x, y, "thorn");
          // thorn.image.setOffset(20, 20);
          // thorn.body.setOffset(0, -5);
        } else if (element === 5) {
          let stone = this.stones.create(x, y, "stones");
        }
      }
    }

    // Define the y-coordinate death line, beyond which the player will be considered dead
    // Here it's set to the bottom of the world bounds, but you can adjust to suit your game design
    this.deathLine = this.physics.world.bounds.height - 75;

    this.player = this.physics.add.sprite(100, 450, "dude");

    this.tweens.add({
      targets: this.flags.getChildren(),
      scale: { start: 1, to: 1.1 }, // Slightly increase the size of the sprite
      duration: 500,
      ease: "Linear",
      repeat: -1, // Repeat forever
      yoyo: true,
    });

    //this.flags.anims.play("flagging", true);

    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    this.player.body.setOffset(0, -5);

    this.cameras.main.setBounds(0, 0, 8250, 975); // set camera bounds
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1); // make camera follow player

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 9 }),
      frameRate: 20,
      repeat: -1,
    });

    // this.anims.create({
    //   key: "turn",
    //   frames: [{ key: "dude", frame: 2 }],
    //   frameRate: 20,
    // });

    // this.anims.create({
    //   key: "right",
    //   frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 9 }),
    //   frameRate: 10,
    //   repeat: -1,
    // });

    this.cursors = this.input.keyboard.createCursorKeys();

    // this.stars = this.physics.add.group({
    //   key: "star",
    //   repeat: 11,
    //   setXY: { x: 12, y: 0, stepX: 70 },
    // });

    // this.stars.children.iterate((child) => {
    //   child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    // });

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
    this.physics.add.collider(
      this.player,
      this.stones,
      this.onPlayerHitStone,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.flags,
      this.reachFlag,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.thorns,
      this.gameOver,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );
  }

  update() {
    // Scrolling each layer at a different speed for parallax effect
    this.mountain.tilePositionX = this.cameras.main.scrollX * 0.1; // slow
    this.cloud.tilePositionX = this.cameras.main.scrollX * 0.3; // medium
    this.tree.tilePositionX = this.cameras.main.scrollX * 0.5; // fast
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
  reachFlag(player, flag) {
    flag.disableBody(true, true); // Optional: remove the flag after the player reaches it

    // You can put some kind of victory animation or sound effect here

    // Stop the current scene and start the victory scene
    this.scene.start("VictoryScene", { score: this.score });
  }
  onPlayerHitStone(player, stonePlatform) {
    let stoneX = stonePlatform.x;
    let stoneY = stonePlatform.y;

    // Remove the stone platform from the static group
    this.stones.remove(stonePlatform, true, true);

    // Create a new stone platform as a dynamic body at the same position
    let fallingStone = this.physics.add.sprite(stoneX, stoneY, "stones");
    fallingStone.setGravityY(200); // Adjust this value to change the speed of falling
    fallingStone.setCollideWorldBounds(false);
  }
}
