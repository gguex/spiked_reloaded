const constants = {
  WIDTH: 800,
  HEIGHT: 600,
  ANGULAR_VELOCITY: 200,
  ACCELERATION: 400,
  BOUNCE: 0.9, 
  ASTEROID_SCALE: 0.7,
  PLAYER_SCALE: 1.5,
  SPIKE_SCALE: 2.5,
  EXPLOSION_SCALE: 1.5,
  GIFT_SCALE: 1,
  BULLET_SCALE: 1,
  HEAVY_BULLET_SCALE: 1,
  FREEZER_BULLET_SCALE: 0.2,
  FREEZER_SCALE: 0.5,
  ATTRACTOR_SCALE: 0.7,
  DRAG: 0.1,
  BULLET_MASS: 1,
  HEAVY_BULLET_MASS: 1,
  BULLET_SPEED: 400,
  HEAVY_BULLET_SPEED: 1500,
  FIRING_DELAY: 400, 
  BULLET_LIFESPAN: 80,
  FREEZER_LIFESPAN: 2000,
  STARTING_LIFE: 3,
  ATTRACTOR_STRENGTH: 3
};

const config = {
    type: Phaser.AUTO,
    width: constants.WIDTH,
    height: constants.HEIGHT,
    backgroundColor: "000000",
    physics: {
		default: 'arcade',
		arcade: {
			enableBody: true,
      debug: false
		}
    },
    scene: [Space]
};

const game = new Phaser.Game(config);
