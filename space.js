class Space extends Phaser.Scene {
    constructor() {
        super({ key: 'Space' })
    }

    preload() {

        this.load.image('ship', 'src/img/ship.png');
        this.load.image('bullet', 'src/img/bullet.png');
        this.load.atlas('asteroid', 'src/img/asteroid.png', 'src/img/asteroid.json');
        this.load.atlas('spike', 'src/img/spike.png', 'src/img/spike.json');

    }

    create() {
        
        // The player
        gameState.player = new Player(this, 200, 300);

        // Animation for the asteroid
        let asteroidFrames = this.anims.generateFrameNames('asteroid', {
            start: 0, end: 29, prefix: 'asteroid-', suffix: '.png'
        });
        this.anims.create({key: 'asteroidAnim', frames: asteroidFrames,
            frameRate: 15, repeat: -1
        });

        // Animation for the spike
        let spikeFrames = this.anims.generateFrameNames('spike', {
            start: 1, end: 16, prefix: 'spike_'
        });
        this.anims.create({key: 'spikeAnim', frames: spikeFrames,
            frameRate: 15, repeat: -1
        });

        // Group for asteroids
        gameState.asteroids = this.add.group({
            classType: Asteroid
        });
        // One asteroid
        gameState.asteroids.create(600, 300)

        // The spike
        gameState.spike = new Spike(this, 400, 300);


        // Bullets
        gameState.bullets = this.add.group({classType: Bullet, runChildUpdate: true});

        gameState.bullets.createMultiple({
            repeat: 10,
            key: 'bullet',
            active: false,
            visible: false
        });

        gameState.lastFired = 0;


        // The keys
        gameState.cursors = this.input.keyboard.createCursorKeys();
        gameState.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Colliders
        this.physics.add.collider(gameState.player, gameState.asteroids);
        this.physics.add.collider(gameState.asteroids, gameState.asteroids);
        this.physics.add.collider(gameState.player, gameState.bullets);
        this.physics.add.collider(gameState.asteroids, gameState.bullets);

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