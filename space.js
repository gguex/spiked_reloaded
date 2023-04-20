class Space extends Phaser.Scene {

    constructor() {
        super({ key: 'Space' })
    }

    preload() {

        // Images
        this.load.image('player1', 'src/images/player1.png');
        this.load.image('player2', 'src/images/player2.png');
        this.load.image('bullet', 'src/images/bullet.png');
        this.load.atlas('asteroid', 'src/images/asteroid.png', 'src/images/asteroid.json');
        this.load.spritesheet('spike', 'src/images/spike.png', {frameWidth: 32, frameHeight: 32, endFrame: 16});
        this.load.spritesheet('explosion', 'src/images/explosion.png', {frameWidth: 64, frameHeight: 64, endFrame: 23});
        this.load.spritesheet('appearingExplosion', 'src/images/appearingExplosion.png', {frameWidth: 32, frameHeight: 32, endFrame: 20});
        this.load.image('hud1', 'src/images/hud1.png');
        this.load.image('hud2', 'src/images/hud2.png');
        this.load.image('heavyBullet', 'src/images/heavyBullet.png');
        this.load.spritesheet('attractor', 'src/images/attractor.png', {frameWidth: 192, frameHeight: 192, endFrame: 31});
        this.load.spritesheet('freezer', 'src/images/freezer.png', {frameWidth: 192, frameHeight: 192, endFrame: 31});
        this.load.image('heavyBulletGift', 'src/images/blueGift.png');
        this.load.image('freezerGift', 'src/images/greenGift.png');
        this.load.image('attractorGift', 'src/images/purpleGift.png');
        this.load.image('lifeGift', 'src/images/woodGift.png');
        this.load.image('spikeGift', 'src/images/redGift.png');
        this.load.spritesheet('weakSpike', 'src/images/weakSpike.png', {frameWidth: 32, frameHeight: 32, endFrame: 16});

        // Sounds
        this.load.audio('appearanceSound', 'src/sounds/muffledExplosion.wav');
        this.load.audio('destroySound', 'src/sounds/bigExplosion.mp3');
        this.load.audio('bulletFireSound', 'src/sounds/bulletFire.ogg');
        this.load.audio('lifeSound', 'src/sounds/life.ogg');
        this.load.audio('metalReboundSound', 'src/sounds/metalRebound.wav');
        this.load.audio('specialFireSound', 'src/sounds/specialFire.wav');
        this.load.audio('getObjectSound', 'src/sounds/getObject.ogg');
        this.load.audio('freezeSound', 'src/sounds/freeze.ogg');
        this.load.audio('attractSound', 'src/sounds/attract.ogg');
        this.load.audio('newSpikeSound', 'src/sounds/newSpike.ogg');
    }

    create() {

        // Animations
        let asteroidFrames = this.anims.generateFrameNames('asteroid', {
            start: 0, end: 29, prefix: 'asteroid-', suffix: '.png'
        });
        this.anims.create({key: 'asteroidAnim', frames: asteroidFrames, frameRate: 15, repeat: -1});
        this.anims.create({key: 'spikeAnim', frames: 'spike', frameRate: 15, repeat: -1});
        this.anims.create({key: 'explosionAnim', frames: 'explosion', frameRate: 15});
        this.anims.create({key: 'appearingExplosionAnim', frames: 'appearingExplosion', frameRate: 15});
        this.anims.create({key: 'freezerAnim', frames: 'freezer', frameRate: 30, repeat: -1});
        this.anims.create({key: 'attractorAnim', frames: 'attractor', frameRate: 30, repeat: -1});
        this.anims.create({key: 'weakSpikeAnim', frames: 'weakSpike', frameRate: 15, repeat: -1});

        // Sounds
        this.appearanceSound = this.sound.add('appearanceSound');
        this.destroySound = this.sound.add('destroySound');
        this.bulletFireSound = this.sound.add('bulletFireSound');
        this.lifeSound = this.sound.add('lifeSound');
        this.metalReboundSound = this.sound.add('metalReboundSound');
        this.specialFireSound = this.sound.add('specialFireSound');
        this.getObjectSound = this.sound.add('getObjectSound');
        this.freezeSound = this.sound.add('freezeSound');
        this.attractSound = this.sound.add('attractSound');
        this.newSpikeSound = this.sound.add('newSpikeSound');

        // Game objects
        this.player1 = new Player(this, constants.WIDTH/4, constants.HEIGHT/4, 'player1');
        this.player2 = new Player(this, 3*constants.WIDTH/4, 3*constants.HEIGHT/4, 'player2').setAngle(180);
        this.spike = new Spike(this, constants.WIDTH/2, constants.HEIGHT/2);
        this.asteroids = this.add.group({classType: Asteroid});
        this.bullets = this.add.group({classType: Bullet, runChildUpdate: true});
        this.gifts = this.add.group({classType: Gift})
        this.heavyBullets = this.add.group({classType: HeavyBullet});
        this.freezers = this.add.group({classType: Freezer, runChildUpdate: true});
        this.attractors = this.add.group({classType: Attractor, runChildUpdate: true});
        this.spikeBullets = this.add.group({classType: SpikeBullet});
        this.weakSpikes = this.add.group({classType: WeakSpike, runChildUpdate: true});
        this.explosions = this.add.group({classType: Explosion, runChildUpdate: true});
        this.appearingExplosions = this.add.group({classType: AppearingExplosion, runChildUpdate: true});

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
            if(roll > 0.9){
                let posX = Math.random() * constants.WIDTH;
                let posY = Math.random() * constants.HEIGHT;
                let speedX = Math.random() * 300;
                let speedY = Math.random() * 300;
                let appearingExplosion = this.appearingExplosions.create(posX, posY);
                this.appearanceSound.play();
                appearingExplosion.on('animationcomplete', () => {
                    let roll2 = Math.random();
                    if(roll2 > 0.6){
                        let asteroid = this.asteroids.create(posX, posY);
                        asteroid.setVelocity(speedX, speedY);
                    } else {
                        let roll3 = Math.random();
                        let giftname = 'heavyBulletGift';
                        if (roll3 > (1 - constants.APPEARING_CHANCES)){
                            giftname = 'lifeGift';
                        } else if (roll3 > 0.675){
                            giftname = 'spikeGift';
                        } else if (roll3 > 0.45){
                            giftname = 'freezerGift';
                        } else if (roll3 > 0.225){
                            giftname = 'attractorGift';
                        }
                        let gift = this.gifts.create(posX, posY, giftname);
                        gift.setVelocity(speedX, speedY);
                    }
                });
            }
        }
        this.objectGenLoop = this.time.addEvent({
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
        this.physics.add.collider(this.player1, this.player2, () => this.metalReboundSound.play())
        this.physics.add.collider(this.player1, this.asteroids, () => this.metalReboundSound.play());
        this.physics.add.collider(this.player1, this.bullets, () => this.metalReboundSound.play());
        this.physics.add.collider(this.player1, this.heavyBullets, () => this.metalReboundSound.play());
        this.physics.add.overlap(this.player1, this.freezers, (player, freezer) => {
            freezer.capture(player, this.freezeSound);
        });
        this.physics.add.overlap(this.player1, this.attractors, (player, attractor) => {
            attractor.capture(player, this.attractSound);
        });
        this.physics.add.overlap(this.player1, this.spikeBullets, (player, spikeBullet) => {
            spikeBullet.destroy();
        });
        this.physics.add.collider(this.player1, this.spike, (player, spike) => {
            this.explosions.create(player.x, player.y);
            this.destroySound.play();
            player.kill(constants.WIDTH/4, constants.HEIGHT/4, 0);
            this.lifeDisplay1.setText(this.player1.life);

            if (this.player1.life < 1){
                this.objectGenLoop.destroy();
                this.physics.pause();
                console.log(this.objectGenLoop)
                this.add.image(constants.WIDTH/2 - 90, constants.HEIGHT/2, 'player2').setScale(3).setAngle(-90);
                this.add.text(constants.WIDTH/2 + 10, constants.HEIGHT/2 - 30, "Won!", {fill: '#FFFFFF', fontSize: 64});
                this.add.text(constants.WIDTH/2, constants.HEIGHT/2 + 100, "Click to continue", {fontStyle: 'italic', fill: '#FFFFFF', fontSize: 16}).setOrigin(0.5, 0.5);
                this.input.on('pointerdown', () => {
                    this.scene.stop('Space');
                    this.scene.start('Start');
                });
            }
    
        });
        this.physics.add.collider(this.player1, this.weakSpikes, (player, weakSpike) => {
            this.explosions.create(player.x, player.y);
            this.destroySound.play();
            player.kill(constants.WIDTH/4, constants.HEIGHT/4, 0);
            this.lifeDisplay1.setText(this.player1.life);
        });
        this.physics.add.overlap(this.player1, this.gifts, (player, gift) => {
            if(gift.giftType == 'lifeGift'){
                player.life += 1;
                this.lifeDisplay1.setText(this.player2.life);
                this.lifeSound.play();
            } else {
                player.addItem(gift.giftType);
            }
            gift.destroy();
        });
        this.physics.add.collider(this.player2, this.asteroids, () => this.metalReboundSound.play());
        this.physics.add.collider(this.player2, this.bullets, () => this.metalReboundSound.play());
        this.physics.add.collider(this.player2, this.heavyBullets, () => this.metalReboundSound.play());
        this.physics.add.overlap(this.player2, this.freezers, (player, freezer) => {
            freezer.capture(player, this.freezeSound);
        });
        this.physics.add.overlap(this.player2, this.attractors, (player, attractor) => {
            attractor.capture(player, this.attractSound);
        });
        this.physics.add.overlap(this.player2, this.spikeBullets, (player, spikeBullet) => {
            spikeBullet.destroy();
        });
        this.physics.add.collider(this.player2, this.spike, (player, spike) => {
            this.explosions.create(player.x, player.y);
            this.destroySound.play();
            player.kill(3*constants.WIDTH/4, 3*constants.HEIGHT/4, 180);
            this.lifeDisplay2.setText(this.player2.life);

            if (this.player2.life < 1){
                this.objectGenLoop.destroy();
                this.physics.pause();
                console.log(this.objectGenLoop)
                this.add.image(constants.WIDTH/2 - 90, constants.HEIGHT/2, 'player1').setScale(3).setAngle(-90);
                this.add.text(constants.WIDTH/2 + 10, constants.HEIGHT/2 - 30, "Won!", {fill: '#FFFFFF', fontSize: 64});
                this.add.text(constants.WIDTH/2, constants.HEIGHT/2 + 100, "Click to continue", {fontStyle: 'italic', fill: '#FFFFFF', fontSize: 16}).setOrigin(0.5, 0.5);
                this.input.on('pointerdown', () => {
                    this.scene.stop('Space');
                    this.scene.start('Start');
                });
            }

        });
        this.physics.add.collider(this.player2, this.weakSpikes, (player, weakSpike) => {
            this.explosions.create(player.x, player.y);
            this.destroySound.play();
            player.kill(3*constants.WIDTH/4, 3*constants.HEIGHT/4, 180);
            this.lifeDisplay2.setText(this.player2.life);
        });
        this.physics.add.overlap(this.player2, this.gifts, (player, gift) => {
            if(gift.giftType == 'lifeGift'){
                this.lifeSound.play();
                player.life += 1;
                this.lifeDisplay2.setText(this.player2.life);
            } else {
                this.getObjectSound.play();
                player.addItem(gift.giftType);
            }
            gift.destroy();
        });
        this.physics.add.collider(this.asteroids, this.asteroids);
        this.physics.add.collider(this.asteroids, this.bullets,  () => this.metalReboundSound.play());
        this.physics.add.collider(this.asteroids, this.heavyBullets, () => this.metalReboundSound.play());
        this.physics.add.overlap(this.asteroids, this.freezers, (asteroid, freezer) => {
            freezer.capture(asteroid, this.freezeSound);
        });
        this.physics.add.overlap(this.asteroids, this.attractors, (asteroid, attractor) => {
            attractor.capture(asteroid, this.attractSound);
            asteroid.attractor = attractor;
        });
        this.physics.add.overlap(this.asteroids, this.spikeBullets, (asteroid, spikeBullet) => {
            spikeBullet.destroy();
            this.newSpikeSound.play();
            let weakSpike = this.weakSpikes.create(asteroid.x, asteroid.y);
            if(asteroid.attractor){
                asteroid.attractor.captured = weakSpike;
            }
            asteroid.destroy();
        });
        this.physics.add.collider(this.asteroids, this.gifts);
        this.physics.add.collider(this.asteroids, this.spike, (asteroid, spike) => {
            this.explosions.create(asteroid.x, asteroid.y);
            this.destroySound.play();
            asteroid.destroy();
        });
        this.physics.add.collider(this.asteroids, this.weakSpikes, (asteroid, weakSpike) => {
            this.explosions.create(asteroid.x, asteroid.y);
            this.destroySound.play();
            asteroid.destroy();
        });
        this.physics.add.collider(this.spike, this.bullets, () => this.metalReboundSound.play());
        this.physics.add.collider(this.spike, this.heavyBullets, (spike, heavyBullet) => {
            this.explosions.create(heavyBullet.x, heavyBullet.y);
            this.destroySound.play();
            heavyBullet.destroy();
        });
        this.physics.add.overlap(this.spike, this.freezers, (spike, freezer) => {
            freezer.capture(spike, this.freezeSound);
        });
        this.physics.add.overlap(this.spike, this.attractors, (spike, attractor) => {
            attractor.capture(spike, this.attractSound);
        });
        this.physics.add.overlap(this.spike, this.spikeBullets, (spike, spikeBullet) => {
            spikeBullet.destroy();
        });
        this.physics.add.overlap(this.spike, this.gifts, (spike, gift) => {
            this.explosions.create(gift.x, gift.y);
            this.destroySound.play();
            gift.destroy();
        });
        this.physics.add.overlap(this.spike, this.weakSpikes, (spike, weakSpike) => {
            this.explosions.create(weakSpike.x, weakSpike.y);
            this.destroySound.play();
            weakSpike.destroy();
        });
        this.physics.add.collider(this.gifts, this.gifts);
        this.physics.add.overlap(this.gifts, this.bullets, (gift, bullet) => {
            this.explosions.create(gift.x, gift.y);
            this.destroySound.play();
            gift.destroy(); 
        });
        this.physics.add.overlap(this.gifts, this.heavyBullets, (gift, heavyBullet) => {
            this.explosions.create(gift.x, gift.y);
            this.destroySound.play();
            gift.destroy(); 
        });
        this.physics.add.overlap(this.gifts, this.freezers, (gift, freezer) => {
            freezer.capture(gift, this.freezeSound);
        });
        this.physics.add.overlap(this.gifts, this.attractors, (gift, attractor) => {
            attractor.capture(gift, this.attractSound);
        });
        this.physics.add.overlap(this.gifts, this.spikeBullets, (gift, spikeBullet) => {
            spikeBullet.destroy();
        });
        this.physics.add.overlap(this.gifts, this.weakSpikes, (gift, weakSpike) => {
            this.explosions.create(gift.x, gift.y);
            this.destroySound.play();
            gift.destroy();
        });
        this.physics.add.collider(this.weakSpikes, this.bullets, () => this.metalReboundSound.play());
        this.physics.add.collider(this.weakSpikes, this.heavyBullets, (weakSpike, heavyBullet) => {
            this.explosions.create(heavyBullet.x, heavyBullet.y);
            this.destroySound.play();
            heavyBullet.destroy();
        }); 
        this.physics.add.overlap(this.weakSpikes, this.freezers, (weakSpike, freezer) => {
            freezer.capture(weakSpike, this.freezeSound);
        });
        this.physics.add.overlap(this.weakSpikes, this.attractors, (weakSpike, attractor) => {
            attractor.capture(weakSpike, this.attractSound);
        });
        this.physics.add.overlap(this.weakSpikes, this.spikeBullets, (weakSpike, spikeBullet) => {
            spikeBullet.destroy();
        });
        this.physics.add.collider(this.heavyBullets, this.heavyBullets, () => this.metalReboundSound.play());
        this.physics.add.overlap(this.heavyBullets, this.freezers, (heavyBullet, freezer) => {
            freezer.capture(heavyBullet, this.freezeSound);
        });
        this.physics.add.overlap(this.heavyBullets, this.attractors, (heavyBullet, attractor) => {
            attractor.capture(heavyBullet, this.attractSound);
        });
        this.physics.add.overlap(this.heavyBullets, this.spikeBullets, (heavyBullet, spikeBullet) => {
            spikeBullet.destroy();
        });
        this.physics.add.collider(this.heavyBullets, this.bullets, () => this.metalReboundSound.play());
        this.physics.add.collider(this.weakSpikes, this.weakSpikes, () => this.metalReboundSound.play());

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

        // Endgame conditions
        if (this.player1.life < 1){
        } 
        if (this.player2.life < 1){
        }

        // Hud display player 1
        switch(this.player1.items[this.player1.itemsPointer - 1]){
            case 'heavyBulletGift':
                this.weaponDisplay1.setScale(0.8);
                this.weaponDisplay1.setTexture('heavyBullet');
                break;
            case 'freezerGift':
                this.weaponDisplay1.setScale(0.16);
                if(this.weaponDisplay1.anims.currentAnim){
                    if(this.weaponDisplay1.anims.currentAnim.key != 'freezerAnim'){
                        this.weaponDisplay1.play('freezerAnim');
                    }
                } else {
                    this.weaponDisplay1.play('freezerAnim');
                } 
                break;
            case 'attractorGift':
                this.weaponDisplay1.setScale(0.2);
                if(this.weaponDisplay1.anims.currentAnim){
                    if(this.weaponDisplay1.anims.currentAnim.key != 'attractorAnim'){
                        this.weaponDisplay1.play('attractorAnim');
                    }
                } else {
                    this.weaponDisplay1.play('attractorAnim');
                } 
                break;
            case 'spikeGift':
                this.weaponDisplay1.setScale(1);
                if(this.weaponDisplay1.anims.currentAnim){
                    if(this.weaponDisplay1.anims.currentAnim.key != 'weakSpikeAnim'){
                        this.weaponDisplay1.play('weakSpikeAnim');
                    }
                } else {
                    this.weaponDisplay1.play('weakSpikeAnim');
                } 
                break;
            default:
                this.weaponDisplay1.setScale(0.5);
                this.weaponDisplay1.setTexture('hud1');
        }

        // Hud display player 2
        switch(this.player2.items[this.player2.itemsPointer - 1]){
            case 'heavyBulletGift':
                this.weaponDisplay2.setScale(0.8);
                this.weaponDisplay2.setTexture('heavyBullet');
                break;
            case 'freezerGift':
                this.weaponDisplay2.setScale(0.16);
                if(this.weaponDisplay2.anims.currentAnim){
                    if(this.weaponDisplay2.anims.currentAnim.key != 'freezerAnim'){
                        this.weaponDisplay2.play('freezerAnim');
                    }
                } else {
                    this.weaponDisplay2.play('freezerAnim');
                } 
                break;
            case 'attractorGift':
                this.weaponDisplay2.setScale(0.2);
                if(this.weaponDisplay2.anims.currentAnim){
                    if(this.weaponDisplay2.anims.currentAnim.key != 'attractorAnim'){
                        this.weaponDisplay2.play('attractorAnim');
                    }
                } else {
                    this.weaponDisplay2.play('attractorAnim');
                } 
                break;
            case 'spikeGift':
                this.weaponDisplay2.setScale(1);
                if(this.weaponDisplay2.anims.currentAnim){
                    if(this.weaponDisplay2.anims.currentAnim.key != 'weakSpikeAnim'){
                        this.weaponDisplay2.play('weakSpikeAnim');
                    }
                } else {
                    this.weaponDisplay2.play('weakSpikeAnim');
                } 
                break;
            default:
                this.weaponDisplay2.setScale(0.5);
                this.weaponDisplay2.setTexture('hud2');
        }

	}

}