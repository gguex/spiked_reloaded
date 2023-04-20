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
        this.load.image('heart', 'src/images/heart.png');
        this.load.spritesheet('weakSpike', 'src/images/weakSpike.png', {frameWidth: 32, frameHeight: 32, endFrame: 16});

        this.load.bitmapFont('ice', 'src/bitmapTexts/iceicebaby.png', 'src/bitmapTexts/iceicebaby.xml');

        this.load.audio('menuMusic', 'src/sounds/fato_shadow_-_stardust_protector.mp3');

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

        // Music
        this.menuMusic = this.sound.add('menuMusic');
        this.menuMusic.play();

        // Title
        this.titleText = this.add.bitmapText(constants.WIDTH/2, constants.HEIGHT/10, 'ice', "SPIKED RELOADED", 64).setOrigin(0.5, 0.5);

        // Start Text
        this.startText = this.add.text(constants.WIDTH/2, 7.4*constants.HEIGHT/8, "Click to start the game",
            {fontStyle: 'italic', fill: '#FFFFFF', fontSize: 16, align: 'center'}).setOrigin(0.5, 0.5);
        this.tweens.addCounter({from: 0.3, to: 1, duration: 1000, yoyo: true, loop: -1,
            onUpdate: (tween) => {this.startText.setAlpha(tween.getValue());}
        });

        // Player 1
        this.add.image(constants.WIDTH/5, 4*constants.HEIGHT/16, 'player1').setScale(constants.PLAYER_SCALE).setAngle(-90);
        this.add.text(constants.WIDTH/5 + 50, 4*constants.HEIGHT/16, 
                      "Turn clockwise: D \nTurn counterclockwise: A\nThrust: W\nFire: Q\nSwitch weapon: S", {fill: '#FFFFFF', fontSize: 12}).setOrigin(0, 0.5);

        // Player 2
        this.add.image(3*constants.WIDTH/5, 4*constants.HEIGHT/16, 'player2').setScale(constants.PLAYER_SCALE).setAngle(-90);
        this.add.text(3*constants.WIDTH/5 + 50, 4*constants.HEIGHT/16, 
                      "Turn clockwise: →\nTurn counterclockwise: ←\nThrust: ↑\nFire: [space]\nSwitch weapon: ↓", {fill: '#FFFFFF', fontSize: 12}).setOrigin(0, 0.5);

        // Spike
        this.spikeImg = this.add.sprite(2*constants.WIDTH/6, 7*constants.HEIGHT/16, 'spike').setScale(constants.SPIKE_SCALE);
        this.spikeImg.play('spikeAnimStart');
        this.add.text(2*constants.WIDTH/6, 7*constants.HEIGHT/16 + 50, 
                      "The Spike, it kills you", {fill: '#FFFFFF', fontSize: 12}).setOrigin(0.5, 0.5);
                      
        // Asteroids
        this.asteroidImg = this.add.sprite(4*constants.WIDTH/6, 7*constants.HEIGHT/16, 'spike').setScale(constants.ASTEROID_SCALE);
        this.asteroidImg.play('asteroidAnimStart');
        this.add.text(4*constants.WIDTH/6, 7*constants.HEIGHT/16 + 50, 
                      "Asteroid, annoyance", {fill: '#FFFFFF', fontSize: 12}).setOrigin(0.5, 0.5);

        // Gift1
        this.add.sprite(3*constants.WIDTH/12 - 25, 10*constants.HEIGHT/16, 'heavyBulletGift').setScale(constants.GIFT_SCALE);
        this.add.sprite(3*constants.WIDTH/12 + 25, 10*constants.HEIGHT/16, 'heavyBullet').setScale(constants.HEAVY_BULLET_SCALE);
        this.add.text(3*constants.WIDTH/12, 10*constants.HEIGHT/16 + 40, 
                      "Heavy bullet", {fill: '#FFFFFF', fontSize: 12}).setOrigin(0.5, 0.5);
        
        // Gift2
        this.add.sprite(6*constants.WIDTH/12 - 25, 10*constants.HEIGHT/16, 'freezerGift').setScale(constants.GIFT_SCALE);
        this.freezer = this.add.sprite(6*constants.WIDTH/12 + 25, 10*constants.HEIGHT/16, 'freezer').setScale(0.16);
        this.freezer.play('freezerAnimStart');
        this.add.text(6*constants.WIDTH/12, 10*constants.HEIGHT/16 + 40, 
                      "Freezer", {fill: '#FFFFFF', fontSize: 12}).setOrigin(0.5, 0.5);

        // Gift3
        this.add.sprite(9*constants.WIDTH/12 - 25, 10*constants.HEIGHT/16, 'attractorGift').setScale(constants.GIFT_SCALE);
        this.attractor = this.add.sprite(9*constants.WIDTH/12 + 25, 10*constants.HEIGHT/16, 'attractor').setScale(0.2);
        this.attractor.play('attractorAnimStart');
        this.add.text(9*constants.WIDTH/12, 10*constants.HEIGHT/16 + 40, 
                      "Attractor", {fill: '#FFFFFF', fontSize: 12}).setOrigin(0.5, 0.5);

        // Gift4
        this.add.sprite(4.5*constants.WIDTH/12 - 25, 12*constants.HEIGHT/16, 'spikeGift').setScale(constants.GIFT_SCALE);
        this.spikeBullet = this.add.sprite(4.5*constants.WIDTH/12 + 25, 12*constants.HEIGHT/16, 'weakSpike').setScale(1);
        this.spikeBullet.play('weakSpikeAnimStart');
        this.add.text(4.5*constants.WIDTH/12, 12*constants.HEIGHT/16 + 40, 
                      "Spiker", {fill: '#FFFFFF', fontSize: 12}).setOrigin(0.5, 0.5);

        // Gift5
        this.add.sprite(7.5*constants.WIDTH/12 - 25, 12*constants.HEIGHT/16, 'lifeGift').setScale(constants.GIFT_SCALE);
        this.add.sprite(7.5*constants.WIDTH/12 + 25, 12*constants.HEIGHT/16, 'heart').setScale(0.2);
        this.add.text(7.5*constants.WIDTH/12, 12*constants.HEIGHT/16 + 40, 
                      "Life", {fill: '#FFFFFF', fontSize: 12}).setOrigin(0.5, 0.5);

        // To start
        this.input.on('pointerdown', () => {
            this.menuMusic.stop();
			this.scene.stop('Start');
			this.scene.start('Space');
		});

    }

}
