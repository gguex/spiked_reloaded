class Bullet extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y) {
        
        super(scene, x, y, 'bullet');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(constants.BULLET_SCALE);
        this.body.setCircle(this.body.width / 2);
        this.setCollideWorldBounds(true);
        this.setBounce(constants.BOUNCE);
        this.setDrag(constants.DRAG);
        this.body.setMass(constants.BULLET_MASS); 

    } 

    fireFrom(scene, player) {
        this.rotation = player.rotation; 
        let bulletDirection = scene.physics.velocityFromRotation(this.rotation, 1);
        this.body.reset(player.x + bulletDirection.x*player.body.width/1.5, player.y + bulletDirection.y*player.body.width/1.5 );
        this.setActive(true);
        this.setVisible(true);
        this.lifespan = constants.BULLET_LIFESPAN;
        this.setVelocity(
            bulletDirection.x * constants.BULLET_SPEED + player.body.velocity.x, 
            bulletDirection.y * constants.BULLET_SPEED + player.body.velocity.y
        );
    }
 
    update(time, delta){
        this.lifespan -= 1;
        if(this.lifespan < 0){
            this.setActive(false);
            this.setVisible(false);  
            this.body.reset(-1000, -1000); 
        }
    }

}

