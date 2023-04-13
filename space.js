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

    }

    create() {

        gameState.hud1 = this.add.image(20, 20, 'hud').setScale(0.5);
        gameState.hud2 = this.add.image(constants.WIDTH-20, constants.HEIGHT-20, 'hud').setScale(0.5);
        gameState.hud1.depth = 1000;

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
        gameState.player = new Player(this, constants.WIDTH/4, constants.HEIGHT/4);
        // The spike
        gameState.spike = new Spike(this, constants.WIDTH/2, constants.HEIGHT/2);
        // Group for asteroids
        gameState.asteroids = this.add.group({classType: Asteroid});
        // Group for bullets
        gameState.bullets = this.add.group({classType: Bullet, runChildUpdate: true});
        // Group for gifts
        gameState.gifts = this.add.group({classType: Gift})

        // Function to create an asteroid 
        function asteroidGen(){
            let roll = Math.random()
            if(roll > 0.94 ){
                let posX = Math.random() * constants.WIDTH;
                let posY = Math.random() * constants.HEIGHT;
                let speedX = Math.random() * 300;
                let speedY = Math.random() * 300;
                let explosion = gameState.explosions.create(posX, posY);
                explosion.on('animationcomplete', () => {
                    let roll2 = Math.random();
                    if(roll2 > 0.5){
                        let asteroid = gameState.asteroids.create(posX, posY);
                        asteroid.setVelocity(speedX, speedY);
                    } else {
                        let gift = gameState.gifts.create(posX, posY);
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

        // Fill the bullets
        gameState.bullets.createMultiple({
            repeat: 10,
            key: 'bullet',
            active: false,
            visible: false
        });

        // Time to count the last bullet fired
        gameState.lastFired = 0;

        // Explosions
        gameState.explosions = this.add.group({classType: Explosion, runChildUpdate: true})

        // The keys
        gameState.cursors = this.input.keyboard.createCursorKeys();
        gameState.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Colliders
        this.physics.add.collider(gameState.player, gameState.asteroids);
        this.physics.add.collider(gameState.player, gameState.bullets);
        this.physics.add.collider(gameState.player, gameState.spike);
        this.physics.add.overlap(gameState.player, gameState.gifts, (player, gift) => {
            gift.destroy();
        }, null, this);
        this.physics.add.collider(gameState.asteroids, gameState.asteroids);
        this.physics.add.collider(gameState.asteroids, gameState.bullets);
        this.physics.add.collider(gameState.asteroids, gameState.gifts);
        this.physics.add.collider(gameState.asteroids, gameState.spike, (asteroid, spike) => {
            gameState.explosions.create(asteroid.x, asteroid.y);
            asteroid.destroy();
        }, null, this);
        this.physics.add.collider(gameState.spike, gameState.bullets);
        this.physics.add.overlap(gameState.spike, gameState.gifts, (spike, gift) => {
            gameState.explosions.create(gift.x, gift.y);
            gift.destroy();
        }, null, this);
        this.physics.add.collider(gameState.gifts, gameState.gifts);
        this.physics.add.overlap(gameState.gifts, gameState.bullets, (gift, bullet) => {
            gameState.explosions.create(gift.x, gift.y);
            gift.destroy(); 
        }, null, this);
       

    }

    update(time) { 

        // Turning controls
		if (gameState.cursors.left.isDown) {
            gameState.player.turnCounterClockwise();
		} else if (gameState.cursors.right.isDown) {
            gameState.player.turnClockwise();
        } else {
            gameState.player.turnStop();
        }

        // Thrust controls
        if (gameState.cursors.up.isDown) {
            gameState.player.thrust(this);
        } else {
            gameState.player.thrustStop();
        }

        // Firing controls
        if (gameState.spacebar.isDown  && time > gameState.lastFired){
            let bullet = gameState.bullets.getFirstDead(false);
            if(bullet){
                bullet.fireFrom(this, gameState.player); 
                gameState.lastFired = time + constants.FIRING_DELAY;
            }
        }

        
	}
    


}