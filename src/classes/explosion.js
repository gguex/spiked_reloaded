class Explosion extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'explosion');
        scene.add.existing(this);
        this.setScale(constants.EXPLOSION_SCALE);

        this.lifespan = 500;
        this.play('explosionAnim');
    }

    update(){
        this.lifespan -= 1;
        if(this.lifespan < 0){
            this.destroy()
        }
    }
} 