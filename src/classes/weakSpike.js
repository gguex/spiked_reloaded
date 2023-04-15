 class WeakSpike extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y) {
        
        super(scene, x, y, 'weakSpike');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(constants.WEAK_SPIKE_SCALE);
        this.body.setCircle(this.body.width / 3.5, 7, 7);
        this.setCollideWorldBounds(true);
        this.setBounce(constants.BOUNCE);
        this.setDrag(constants.DRAG);

        this.play('weakSpikeAnim');

    }

}

