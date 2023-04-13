class HeavyBullet extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y) {
        
        super(scene, x, y, 'heavyBullet');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(constants.HEAVY_BULLET_SCALE);
        this.body.setCircle(this.body.width / 2);
        this.setCollideWorldBounds(true);
        this.setBounce(constants.BOUNCE);
        this.setDrag(constants.DRAG);
        this.body.setMass(constants.HEAVY_BULLET_MASS); 

    } 

    fireFrom(scene, player) {
        this.rotation = player.rotation; 
        let bulletDirection = scene.physics.velocityFromRotation(this.rotation, 1);
        this.body.reset(player.x + bulletDirection.x*player.body.width/1.5, player.y + bulletDirection.y*player.body.width/1.5 );
        this.setActive(true);
        this.setVisible(true);
        this.setVelocity(
            bulletDirection.x * constants.HEAVY_BULLET_SPEED + player.body.velocity.x, 
            bulletDirection.y * constants.HEAVY_BULLET_SPEED + player.body.velocity.y
        );
    }

}

