class AppearingExplosion extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'appearingExplosion');
        scene.add.existing(this);
        this.setScale(constants.APPEARING_EXPLOSION_SCALE);

        this.lifespan = 500;
        this.play('appearingExplosionAnim');
    }

    update(){
        this.lifespan -= 1;
        if(this.lifespan < 0){
            this.destroy()
        }
    }
} 