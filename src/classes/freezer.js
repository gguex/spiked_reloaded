class Freezer extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y) {
        
        super(scene, x, y, 'freezer');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(constants.AFFECTS_BULLET_SCALE);
        this.body.setCircle(this.body.width / 2);
        this.setCollideWorldBounds(true);
        this.setBounce(constants.BOUNCE);
        this.setDrag(constants.DRAG);
        this.depth = -1000;

        this.play('freezerAnim');

        this.captured = undefined;

        this.lifespan = constants.AFFECTS_LIFESPAN;

    }

    capture(object, sound){
        if(this.captured){} else {
            sound.play();
            this.captured = object;
            this.captured.setVelocity(0);
            this.setVelocity(0);
            this.setPosition(this.captured.x, this.captured.y);
            this.setCollideWorldBounds(false);
            this.setScale(constants.FREEZER_SCALE);
        }
    }

    update(){
        if(this.captured){
            if(this.captured.body){
                this.setPosition(this.captured.x, this.captured.y);
                if(this.captured.constructor.name == "Player"){
                    this.captured.thrustStop();
                }
                this.lifespan -= 1;
                if(this.lifespan < 0){
                    this.destroy();
                }
            } else {
                this.destroy();
            }
        }
    }

}

