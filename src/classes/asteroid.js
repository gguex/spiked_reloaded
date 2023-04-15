 class Asteroid extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y) {
        
        super(scene, x, y, 'asteroid');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(constants.ASTEROID_SCALE);
        this.body.setCircle(this.body.width / 2);
        this.setCollideWorldBounds(true);
        this.setBounce(constants.BOUNCE);
        this.setDrag(constants.DRAG);
        this.play('asteroidAnim');
        this.attractor = undefined;
    }

}

