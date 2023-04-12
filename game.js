const gameState = {
};

const constants = {
  WIDTH: 800,
  HEIGHT: 600,
  ANGULAR_VELOCITY: 200,
  ACCELERATION: 400,
  BOUNCE: 0.8, 
  ASTEROID_SCALE: 0.7,
  PLAYER_SCALE: 1.5,
  SPIKE_SCALE: 2.5,
  EXPLOSION_SCALE: 1.5,
  DRAG: 1,
  BULLET_MASS: 1,
  BULLET_SCALE: 1,
  BULLET_SPEED: 400,
  FIRING_DELAY: 400, 
  BULLET_LIFESPAN: 80,
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
