class Player extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y) {
        super(scene, x, y, 'ship');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(constants.PLAYER_SCALE);
        this.body.setCircle(this.body.width / 2);
        this.setCollideWorldBounds(true);
        this.setBounce(constants.BOUNCE);
        this.setDrag(constants.DRAG);
        
    }

    turnClockwise() {
        this.setAngularVelocity(constants.ANGULAR_VELOCITY);
    }

    turnCounterClockwise() {
        this.setAngularVelocity(-constants.ANGULAR_VELOCITY);
    }

    turnStop() {
        this.setAngularVelocity(0);
    }

    thrust(scene) {
        scene.physics.velocityFromRotation(this.rotation, constants.ACCELERATION, this.body.acceleration);
    }

    thrustStop() {
        this.setAcceleration(0);
    }
}