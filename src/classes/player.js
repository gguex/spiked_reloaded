class Player extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y) {

        super(scene, x, y, 'ship');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(constants.PLAYER_SCALE);
        this.body.setCircle(this.body.width / 2);
        this.setCollideWorldBounds(true);
        this.setBounce(constants.BOUNCE);
        this.setDrag(constants.DRAG);

        this.items = [];
        this.itemsPointer = 0;
        
    }

    // Turn methods
    turnClockwise() {
        this.setAngularVelocity(constants.ANGULAR_VELOCITY);
    }
    turnCounterClockwise() {
        this.setAngularVelocity(-constants.ANGULAR_VELOCITY);
    }
    turnStop() {
        this.setAngularVelocity(0);
    }

    // Thrust methods
    thrust(scene) {
        scene.physics.velocityFromRotation(this.rotation, constants.ACCELERATION, this.body.acceleration);
    }
    thrustStop() {
        this.setAcceleration(0);
    }

    // Fire method
    fire(scene){
        let bullet = scene.bullets.create();
        bullet.rotation = this.rotation;
        let bulletDirection = scene.physics.velocityFromRotation(this.rotation, 1);
        bullet.body.reset(
            this.x + bulletDirection.x*this.body.width/1.5, 
            this.y + bulletDirection.y*this.body.width/1.5
        );
        bullet.setVelocity(
            bulletDirection.x * constants.BULLET_SPEED + this.body.velocity.x, 
            bulletDirection.y * constants.BULLET_SPEED + this.body.velocity.y
        );
    }

    addItem(item) {
        this.itemsPointer = this.items.push(item);
        console.log(this.items);
        console.log(this.itemsPointer);
        console.log(this.items[this.itemsPointer - 1]);
    }

    switchItem() {
        this.itemsPointer += 1;
        if(this.itemsPointer > this.items.length){
            this.itemsPointer = 0;
        }
    }
}