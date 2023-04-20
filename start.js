class Start extends Phaser.Scene {

    constructor() {
        super({ key: 'Start' })
    }

    preload() {

        // Images
        this.load.image('player1', 'src/images/player1.png');
        this.load.image('player2', 'src/images/player2.png');
        this.load.image('bullet', 'src/images/bullet.png');
        this.load.atlas('asteroid', 'src/images/asteroid.png', 'src/images/asteroid.json');
        this.load.spritesheet('spike', 'src/images/spike.png', {frameWidth: 32, frameHeight: 32, endFrame: 16});
        this.load.image('heavyBullet', 'src/images/heavyBullet.png');
        this.load.spritesheet('attractor', 'src/images/attractor.png', {frameWidth: 192, frameHeight: 192, endFrame: 31});
        this.load.spritesheet('freezer', 'src/images/freezer.png', {frameWidth: 192, frameHeight: 192, endFrame: 31});
        this.load.image('heavyBulletGift', 'src/images/blueGift.png');
        this.load.image('freezerGift', 'src/images/greenGift.png');
        this.load.image('attractorGift', 'src/images/purpleGift.png');
        this.load.image('lifeGift', 'src/images/woodGift.png');
        this.load.image('spikeGift', 'src/images/redGift.png');
        this.load.spritesheet('weakSpike', 'src/images/weakSpike.png', {frameWidth: 32, frameHeight: 32, endFrame: 16});

    }

    create() {

        // Animations
        let asteroidFrames = this.anims.generateFrameNames('asteroid', {
            start: 0, end: 29, prefix: 'asteroid-', suffix: '.png'
        });
        this.anims.create({key: 'asteroidAnimStart', frames: asteroidFrames, frameRate: 15, repeat: -1});
        this.anims.create({key: 'spikeAnimStart', frames: 'spike', frameRate: 15, repeat: -1});
        this.anims.create({key: 'explosionAnimStart', frames: 'explosion', frameRate: 15});
        this.anims.create({key: 'appearingExplosionAnimStart', frames: 'appearingExplosion', frameRate: 15});
        this.anims.create({key: 'freezerAnimStart', frames: 'freezer', frameRate: 30, repeat: -1});
        this.anims.create({key: 'attractorAnimStart', frames: 'attractor', frameRate: 30, repeat: -1});
        this.anims.create({key: 'weakSpikeAnimStart', frames: 'weakSpike', frameRate: 15, repeat: -1});

        // Title
        this.titleText = this.add.text(constants.WIDTH/2, constants.HEIGHT/8, "Spiked RELOADED",
        {
            fontStyle: 'bold',
            fill: '#FFFFFF',
            fontSize: 32, 
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // Start Text
        this.startText = this.add.text(constants.WIDTH/2, 6*constants.HEIGHT/8, "Click to start the game",
        {
            fontStyle: 'italic',
            fill: '#FFFFFF',
            fontSize: 16, 
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // To start
        this.input.on('pointerdown', () => {

			this.scene.stop('Start');
			this.scene.start('Space');

		});

    }

}
