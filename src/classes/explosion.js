class Explosion extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'explosion');
        scene.add.existing(this);

        this.lifespan = 100;
        this.play('explosionAnim');
    }

    update(){
        this.lifespan -= 1;
        if(this.lifespan < 0){
            this.destroy()
        }
    }
} 