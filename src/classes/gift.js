 class Gift extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y) {
        
        super(scene, x, y, 'gift');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(constants.GIFT_SCALE);
        this.body.setCircle(this.body.width / 2);
        this.setCollideWorldBounds(true);
        this.setBounce(constants.BOUNCE);
        this.setDrag(constants.DRAG);
        this.setAngularVelocity((Math.random() - 0.5)*400);

    }

}

