class Space extends Phaser.Scene {
    constructor() {
        super({ key: 'Space' })
    }

    preload() {

        this.load.image('player1', 'src/img/player1.png');
        this.load.image('player2', 'src/img/player2.png');
        this.load.image('bullet', 'src/img/bullet.png');
        this.load.atlas('asteroid', 'src/img/asteroid.png', 'src/img/asteroid.json');
        this.load.spritesheet('spike', 'src/img/spike.png', {frameWidth: 32, frameHeight: 32, endFrame: 16});
        this.load.spritesheet('explosion', 'src/img/explosion.png', {frameWidth: 64, frameHeight: 64, endFrame: 23});
        this.load.image('hud1', 'src/img/hud1.png');
        this.load.image('hud2', 'src/img/hud2.png');
        this.load.image('heavyBullet', 'src/img/heavyBullet.png');
        this.load.spritesheet('attractor', 'src/img/attractor.png', {frameWidth: 192, frameHeight: 192, endFrame: 31});
        this.load.spritesheet('freezer', 'src/img/freezer.png', {frameWidth: 192, frameHeight: 192, endFrame: 31});
        this.load.image('heavyBulletGift', 'src/img/blueGift.png');
        this.load.image('freezerGift', 'src/img/greenGift.png');

    }

    create() {

        // Animations
        let asteroidFrames = this.anims.generateFrameNames('asteroid', {
            start: 0, end: 29, prefix: 'asteroid-', suffix: '.png'
        });
        this.anims.create({key: 'asteroidAnim', frames: asteroidFrames,
            frameRate: 15, repeat: -1
        });
        this.anims.create({key: 'spikeAnim', frames: 'spike',
            frameRate: 15, repeat: -1
        });
        this.anims.create({key: 'explosionAnim', frames: 'explosion',
            frameRate: 15
        });
        this.anims.create({key: 'attractorAnim', frames: 'attractor',
            frameRate: 30, repeat: -1
        });
        this.anims.create({key: 'freezerAnim', frames: 'freezer',
            frameRate: 30, repeat: -1
        });

        // Game objects
        this.player1 = new Player(this, constants.WIDTH/4, constants.HEIGHT/4, 'player1');
        this.player2 = new Player(this, 3*constants.WIDTH/4, 3*constants.HEIGHT/4, 'player2').setAngle(180);
        this.spike = new Spike(this, constants.WIDTH/2, constants.HEIGHT/2);
        this.asteroids = this.add.group({classType: Asteroid});
        this.bullets = this.add.group({classType: Bullet, runChildUpdate: true});
        this.gifts = this.add.group({classType: Gift})
        this.heavyBullets = this.add.group({classType: HeavyBullet});
        this.freezers = this.add.group({classType: Freezer, runChildUpdate: true});
        this.explosions = this.add.group({classType: Explosion, runChildUpdate: true})

        // Hud
        this.hud1 = this.add.image(20, 20, 'hud1').setScale(0.5);
        this.hud2 = this.add.image(constants.WIDTH-20, constants.HEIGHT-20, 'hud2').setScale(0.5);
        this.weaponDisplay1 = this.add.sprite(20, 20, 'hud1').setScale(0.5);
        this.weaponDisplay2 = this.add.sprite(constants.WIDTH-20, constants.HEIGHT-20, 'hud2').setScale(0.5);
        this.hud1.depth = 1000;
        this.hud2.depth = 1000;
        this.weaponDisplay1.depth = 1200;
        this.weaponDisplay2.depth = 1200;
        this.lifeDisplay1 = this.add.text(40, 20, this.player1.life, { fontSize: '15px', fill: 'lightblue' });
        this.lifeDisplay2 = this.add.text(constants.WIDTH-40, constants.HEIGHT-20, this.player2.life, { fontSize: '15px', fill: 'Bisque', rtl: true});

        // Objects creation
        function objectGen(){
            let roll = Math.random()
            if(roll > 0.9 ){
                let posX = Math.random() * constants.WIDTH;
                let posY = Math.random() * constants.HEIGHT;
                let speedX = Math.random() * 300;
                let speedY = Math.random() * 300;
                let explosion = this.explosions.create(posX, posY);
                explosion.on('animationcomplete', () => {
                    let roll2 = Math.random();
                    if(roll2 > 0.5){
                        let asteroid = this.asteroids.create(posX, posY);
                        asteroid.setVelocity(speedX, speedY);
                    } else {
                        let roll3 = Math.random();
                        let giftname = 'heavyBulletGift';
                        if(roll3 > 0.5){
                            giftname = 'freezerGift';
                        }
                        let gift = this.gifts.create(posX, posY, giftname);
                        gift.setVelocity(speedX, speedY);
                    }
                });
            }
        }
        const objectGenLoop = this.time.addEvent({
            delay: 500,
            callback: objectGen,
            callbackScope: this,
            loop: true,
        });

        // The keys
        this.leftP1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.rightP1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.thrustP1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.fireP1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.switchP1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.leftP2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightP2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.thrustP2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.fireP2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.switchP2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Colliders
        this.physics.add.collider(this.player1, this.player2)
        this.physics.add.collider(this.player1, this.asteroids);
        this.physics.add.collider(this.player1, this.bullets);
        this.physics.add.collider(this.player1, this.heavyBullets);
        this.physics.add.overlap(this.player1, this.freezers, (player, freezer) => {
            freezer.capture(player);
        });
        this.physics.add.collider(this.player1, this.spike, (player, spike) => {
            this.explosions.create(player.x, player.y);
            player.kill(constants.WIDTH/4, constants.HEIGHT/4, 0);
            this.lifeDisplay1.setText(this.player1.life);
        });
        this.physics.add.overlap(this.player1, this.gifts, (player, gift) => {
            player.addItem(gift.giftType);
            gift.destroy();
        });
        this.physics.add.collider(this.player2, this.asteroids);
        this.physics.add.collider(this.player2, this.bullets);
        this.physics.add.collider(this.player2, this.heavyBullets);
        this.physics.add.overlap(this.player2, this.freezers, (player, freezer) => {
            freezer.capture(player);
        });
        this.physics.add.collider(this.player2, this.spike, (player, spike) => {
            this.explosions.create(player.x, player.y);
            player.kill(3*constants.WIDTH/4, 3*constants.HEIGHT/4, 180);
            this.lifeDisplay2.setText(this.player2.life);
        });
        this.physics.add.overlap(this.player2, this.gifts, (player, gift) => {
            player.addItem(gift.giftType);
            gift.destroy();
        });
        this.physics.add.collider(this.asteroids, this.asteroids);
        this.physics.add.collider(this.asteroids, this.bullets);
        this.physics.add.collider(this.asteroids, this.heavyBullets);
        this.physics.add.overlap(this.asteroids, this.freezers, (asteroid, freezer) => {
            freezer.capture(asteroid);
        });
        this.physics.add.collider(this.asteroids, this.gifts);
        this.physics.add.collider(this.asteroids, this.spike, (asteroid, spike) => {
            this.explosions.create(asteroid.x, asteroid.y);
            asteroid.destroy();
        });
        this.physics.add.collider(this.spike, this.bullets);
        this.physics.add.collider(this.spike, this.heavyBullets, (spike, heavyBullet) => {
            this.explosions.create(heavyBullet.x, heavyBullet.y);
            heavyBullet.destroy();
        });
        this.physics.add.overlap(this.spike, this.freezers, (spike, freezer) => {
            freezer.capture(spike);
        });
        this.physics.add.overlap(this.spike, this.gifts, (spike, gift) => {
            this.explosions.create(gift.x, gift.y);
            gift.destroy();
        });
        this.physics.add.collider(this.gifts, this.gifts);
        this.physics.add.overlap(this.gifts, this.bullets, (gift, bullet) => {
            this.explosions.create(gift.x, gift.y);
            gift.destroy(); 
        });
        this.physics.add.overlap(this.gifts, this.heavyBullets, (gift, heavyBullet) => {
            this.explosions.create(gift.x, gift.y);
            gift.destroy(); 
        });
        this.physics.add.overlap(this.gifts, this.heavyBullets, (gift, freezer) => {
            freezer.capture(gift);
        });
        this.physics.add.collider(this.heavyBullets, this.heavyBullets);
        this.physics.add.overlap(this.heavyBullets, this.freezers, (heavyBullet, freezer) => {
            freezer.capture(heavyBullet);
        });
        this.physics.add.collider(this.heavyBullets, this.bullet);
       

    }

    update() { 

        // Turning controls
		if (this.leftP1.isDown) {
            this.player1.turnCounterClockwise();
		} else if (this.rightP1.isDown) {
            this.player1.turnClockwise();
        } else {
            this.player1.turnStop();
        }
        if (this.leftP2.isDown) {
            this.player2.turnCounterClockwise();
		} else if (this.rightP2.isDown) {
            this.player2.turnClockwise();
        } else {
            this.player2.turnStop();
        }

        // Thrust controls
        if (this.thrustP1.isDown) {
            this.player1.thrust(this);
        } else {
            this.player1.thrustStop();
        }
        if (this.thrustP2.isDown) {
            this.player2.thrust(this);
        } else {
            this.player2.thrustStop();
        }

        // Switch item
        if (this.switchP1.isDown) {
            this.player1.switchItem(this);
        }
        if (this.switchP2.isDown) {
            this.player2.switchItem(this);
        }

        // Firing controls
        if (this.fireP1.isDown){
            this.player1.fire(this);
        }
        if (this.fireP2.isDown){
            this.player2.fire(this);
        }

        // Hud display
        switch(this.player1.items[this.player1.itemsPointer - 1]){
            case 'heavyBulletGift':
                this.weaponDisplay1.setScale(0.5);
                this.weaponDisplay1.setTexture('heavyBullet');
                break;
            case 'freezerGift':
                this.weaponDisplay1.setScale(0.1);
                if(!(this.weaponDisplay1.anims.isPlaying)){
                    this.weaponDisplay1.play('freezerAnim');
                }
                break;
            default:
                this.weaponDisplay1.setScale(0.5);
                this.weaponDisplay1.setTexture('hud1');
        }
        switch(this.player2.items[this.player2.itemsPointer - 1]){
            case 'heavyBulletGift':
                this.weaponDisplay2.setScale(0.5);
                this.weaponDisplay2.setTexture('heavyBullet');
                break;
            case 'freezerGift':
                this.weaponDisplay2.setScale(0.1);
                if(!(this.weaponDisplay2.anims.isPlaying)){
                    this.weaponDisplay2.play('freezerAnim');
                }
                break;
            default:
                this.weaponDisplay2.setScale(0.5);
                this.weaponDisplay2.setTexture('hud2');
        }
        
	}
    


}