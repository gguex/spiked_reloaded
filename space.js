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

    }

    create() {

        // Animation for the asteroid
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
        // Animation for the explosion
        this.anims.create({key: 'explosionAnim', frames: 'explosion',
            frameRate: 15
        });

        // The player
        gameState.player = new Player(this, 200, 300);
        // The spike
        gameState.spike = new Spike(this, 400, 300);
        // Group for asteroids
        gameState.asteroids = this.add.group({
            classType: Asteroid
        });

        // Function to create an asteroid 
        function asteroidGen(){
            let roll = Math.random()
            if(roll > 0.9){
                let posX = Math.random() * constants.WIDTH;
                let posY = Math.random() * constants.HEIGHT;
                let speedX = Math.random() * 300;
                let speedY = Math.random() * 300;
                let explosion = gameState.explosions.create(posX, posY);
                explosion.on('animationcomplete', () => {
                    let asteroid = gameState.asteroids.create(posX, posY);
                    asteroid.setVelocity(speedX, speedY);
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


        // Bullets
        gameState.bullets = this.add.group({classType: Bullet, runChildUpdate: true});
        // Fill the bullets
        gameState.bullets.createMultiple({
            repeat: 10,
            key: 'bullet',
            active: false,
            visible: false
        });

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
        this.physics.add.collider(gameState.asteroids, gameState.asteroids);
        this.physics.add.collider(gameState.asteroids, gameState.bullets);
        this.physics.add.collider(gameState.asteroids, gameState.spike, (asteroid, spike) => {
            gameState.explosions.create(asteroid.x, asteroid.y);
            asteroid.destroy();
        }, 
        null, this);
        this.physics.add.collider(gameState.spike, gameState.bullets);
       

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