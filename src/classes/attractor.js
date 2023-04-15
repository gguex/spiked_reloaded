class Attractor extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y) {
        
        super(scene, x, y, 'attractor');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(constants.AFFECTS_BULLET_SCALE);
        this.body.setCircle(this.body.width / 2);
        this.setCollideWorldBounds(true);
        this.setBounce(constants.BOUNCE);
        this.setDrag(constants.DRAG);
        this.depth = -1000;

        this.play('attractorAnim');

        this.fireFrom = undefined;
        this.captured = undefined;

        this.lifespan = constants.AFFECTS_LIFESPAN;

    }

    capture(object){
        if(this.captured){} else {
            this.captured = object;
            this.setVelocity(this.captured.velocity);
            this.setPosition(this.captured.x, this.captured.y);
            this.setCollideWorldBounds(false);
            this.setScale(constants.ATTRACTOR_SCALE);
        }
    }

    update(){
        if(this.captured){
            if(this.fireFrom != this.captured){
                if(this.captured.body){
                    this.setPosition(this.captured.x, this.captured.y);
                    let directionX = (this.fireFrom.x - this.captured.x);
                    let directionY = (this.fireFrom.y - this.captured.y);
                    directionX *= constants.ATTRACTOR_STRENGTH/Math.sqrt(directionX**2 + directionY**2);
                    directionY *= constants.ATTRACTOR_STRENGTH/Math.sqrt(directionX**2 + directionY**2);
                    this.captured.body.velocity.x += directionX;
                    this.captured.body.velocity.y += directionY;
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

}

