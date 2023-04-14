class Freezer extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y) {
        
        super(scene, x, y, 'heavyBullet');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(constants.FREEZER_BULLET_SCALE);
        this.body.setCircle(this.body.width / 2);
        this.setCollideWorldBounds(true);
        this.setBounce(constants.BOUNCE);
        this.setDrag(constants.DRAG);
        this.depth = -1000;

        this.play('freezerAnim');

        this.captured = undefined;

        this.lifespan = constants.FREEZER_LIFESPAN;

    }

    capture(object){
        if(this.captured){} else {
            this.captured = object;
            this.setCollideWorldBounds(false);
            this.captured.setVelocity(0);
            this.setScale(constants.FREEZER_SCALE);
        }
    }

    update(){
        if(this.captured){
            this.setPosition(this.captured.x, this.captured.y);
            if(this.captured.constructor.name == "Player"){
                this.captured.thrustStop();
            }
            this.lifespan -= 1;
            if(this.lifespan < 0){
                this.destroy();
            }
        }
    }

}

