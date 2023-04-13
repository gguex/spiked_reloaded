class Space extends Phaser.Scene {
    constructor() {
        super({ key: 'Space' })
    }

    preload() {

        this.load.image('ship', 'src/img/ship.png');
        this.load.image('bullet', 'src/img/bullet.png');
        this.load.atlas('asteroid', 'src/img/asteroid.png', 'src/img/asteroid.json');
        this.load.spritesheet('spike', 'src/img/spike.png', {frameWidth: 32, frameHeight: 32, endFrame: 16});
        this.load.spritesheet('explosion', 'src/img/explosion.png', {frameWidth: 64, frameHeight: 64, endFrame: 23});
        this.load.image('gift', 'src/img/box.png');
        this.load.image('hud', 'src/img/hud.png');
        this.load.image('heavyBullet', 'src/img/heavyBullet.png');

    }

    create() {

        // Huds
        this.hud1 = this.add.image(20, 20, 'hud').setScale(0.5);
        this.hud2 = this.add.image(constants.WIDTH-20, constants.HEIGHT-20, 'hud').setScale(0.5);
        this.weaponDisplay1 = this.add.image(20, 20, 'hud').setScale(0.5);
        this.hud1.depth = 1000;
        this.hud2.depth = 1000;
        this.weaponDisplay1.depth = 1200;

        // Animation for asteroids
        let asteroidFrames = this.anims.generateFrameNames('asteroid', {
            start: 0, end: 29, prefix: 'asteroid-', suffix: '.png'
        });
        this.anims.create({key: 'asteroidAnim', frames: asteroidFrames,
            frameRate: 15, repeat: -1
        });
        // Animation for the spike
        this.anims.create({key: 'spikeAnim', frames: 'spike',
            frameRate: 15, repeat: -1
        });
        // Animation for explosions
        this.anims.create({key: 'explosionAnim', frames: 'explosion',
            frameRate: 15
        });

        // The player
        this.player = new Player(this, constants.WIDTH/4, constants.HEIGHT/4);
        // The spike
        this.spike = new Spike(this, constants.WIDTH/2, constants.HEIGHT/2);
        // Group for asteroids
        this.asteroids = this.add.group({classType: Asteroid});
        // Group for bullets
        this.bullets = this.add.group({classType: Bullet, runChildUpdate: true});
        // Group for gifts
        this.gifts = this.add.group({classType: Gift})
        // Group for heavyBullets
        this.heavyBullets = this.add.group({classType: HeavyBullet});

        // Function to create an asteroid 
        function asteroidGen(){
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
                        let gift = this.gifts.create(posX, posY);
                        gift.setVelocity(speedX, speedY);
                    }
                });
            }
        }

        // Event for the asteroid 
        const astroidGenLoop = this.time.addEvent({
            delay: 500,
            callback: asteroidGen,
            callbackScope: this,
            loop: true,
        });

        // Explosions
        this.explosions = this.add.group({classType: Explosion, runChildUpdate: true})

        // The keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Colliders
        this.physics.add.collider(this.player, this.asteroids);
        this.physics.add.collider(this.player, this.bullets);
        this.physics.add.collider(this.player, this.heavyBullets);
        this.physics.add.collider(this.player, this.spike);
        this.physics.add.overlap(this.player, this.gifts, (player, gift) => {
            gift.destroy();
            player.addItem('heavyBullet');
        }, null, this);
        this.physics.add.collider(this.asteroids, this.asteroids);
        this.physics.add.collider(this.asteroids, this.bullets);
        this.physics.add.collider(this.asteroids, this.heavyBullets);
        this.physics.add.collider(this.asteroids, this.gifts);
        this.physics.add.collider(this.asteroids, this.spike, (asteroid, spike) => {
            this.explosions.create(asteroid.x, asteroid.y);
            asteroid.destroy();
        }, null, this);
        this.physics.add.collider(this.spike, this.bullets);
        this.physics.add.collider(this.spike, this.heavyBullets, (spike, heavyBullet) => {
            this.explosions.create(heavyBullet.x, heavyBullet.y);
            heavyBullet.destroy();
        }, null, this);
        this.physics.add.overlap(this.spike, this.gifts, (spike, gift) => {
            this.explosions.create(gift.x, gift.y);
            gift.destroy();
        }, null, this);
        this.physics.add.collider(this.gifts, this.gifts);
        this.physics.add.overlap(this.gifts, this.bullets, (gift, bullet) => {
            this.explosions.create(gift.x, gift.y);
            gift.destroy(); 
        }, null, this);
        this.physics.add.overlap(this.gifts, this.heavyBullets, (gift, heavyBullet) => {
            this.explosions.create(gift.x, gift.y);
            gift.destroy(); 
        }, null, this);
        this.physics.add.collider(this.bullets, this.heavyBullets);
       

    }

    update(time) { 

        // Turning controls
		if (this.cursors.left.isDown) {
            this.player.turnCounterClockwise();
		} else if (this.cursors.right.isDown) {
            this.player.turnClockwise();
        } else {
            this.player.turnStop();
        }

        // Thrust controls
        if (this.cursors.up.isDown) {
            this.player.thrust(this);
        } else {
            this.player.thrustStop();
        }

        // Switch item
        if (this.cursors.down.isDown) {
            this.player.switchItem(this);
        }

        // Firing controls
        if (this.spacebar.isDown){
            this.player.fire(this);
        }

        // Image of weapon
        if (this.player.items[this.player.itemsPointer - 1]){
            if(this.player.items[this.player.itemsPointer - 1] == "heavyBullet"){
                this.weaponDisplay1.setTexture('heavyBullet');
            }
        } else {
            this.weaponDisplay1.setTexture('hud');
        }
        
	}
    


}