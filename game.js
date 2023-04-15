const constants = {
  WIDTH: 800,
  HEIGHT: 600,

  ANGULAR_VELOCITY: 200,
  ACCELERATION: 400,
  BOUNCE: 0.9, 
  DRAG: 0.1,
  BULLET_SPEED: 400,
  SPECIAL_BULLET_SPEED: 1500,
  FIRING_DELAY: 400, 
  BULLET_LIFESPAN: 80,
  AFFECTS_LIFESPAN: 2000,
  STARTING_LIFE: 5,
  ATTRACTOR_STRENGTH: 2,

  ASTEROID_SCALE: 0.7,
  PLAYER_SCALE: 1.5,
  SPIKE_SCALE: 2.5,
  EXPLOSION_SCALE: 1.5,
  GIFT_SCALE: 1,
  BULLET_SCALE: 1,
  HEAVY_BULLET_SCALE: 1,
  AFFECTS_BULLET_SCALE: 0.2,
  FREEZER_SCALE: 0.5,
  ATTRACTOR_SCALE: 0.7
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
      debug: true
		}
    },
    scene: [Space]
};

const game = new Phaser.Game(config);
