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
        this.lifespan = constants.BULLET_LIFESPAN;

    }
    
    update(time, delta){
        this.lifespan -= 1;
        if(this.lifespan < 0){
            this.destroy();
        }
    }

}

