class Player extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, texture) {

        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(constants.PLAYER_SCALE);
        this.body.setCircle(this.body.width / 2);
        this.setCollideWorldBounds(true);
        this.setBounce(constants.BOUNCE);
        this.setDrag(constants.DRAG);

        this.lastFired = 0;

        this.items = [];
        this.itemsPointer = 0;

        this.lastSwitch = 0;

        this.life = constants.STARTING_LIFE;
        
    }

    turnClockwise() {
        this.setAngularVelocity(constants.ANGULAR_VELOCITY);
    }
    turnCounterClockwise() {
        this.setAngularVelocity(-constants.ANGULAR_VELOCITY);
    }
    turnStop() {
        this.setAngularVelocity(0);
    }

    thrust(scene) {
        scene.physics.velocityFromRotation(this.rotation, constants.ACCELERATION, this.body.acceleration);
    }
    thrustStop() {
        this.setAcceleration(0);
    }

    fire(scene){
        
        if(scene.time.now > this.lastFired + constants.FIRING_DELAY){

            this.lastFired = scene.time.now;

            switch(this.items[this .itemsPointer - 1]){
                case 'heavyBulletGift':
                    let heavyBullet = scene.heavyBullets.create();
                    let heavyBulletDirection = scene.physics.velocityFromRotation(this.rotation, 1);
                    heavyBullet.setPosition (
                        this.x + heavyBulletDirection.x*this.body.width/1.5, 
                        this.y + heavyBulletDirection.y*this.body.width/1.5
                    );
                    heavyBullet.setVelocity(
                        heavyBulletDirection.x * constants.SPECIAL_BULLET_SPEED + this.body.velocity.x, 
                        heavyBulletDirection.y * constants.SPECIAL_BULLET_SPEED + this.body.velocity.y
                    );
                    this.items.splice(this.itemsPointer - 1, 1);
                    this.itemsPointer -= 1;
                    break;
                case 'freezerGift':
                    let freezer = scene.freezers.create();
                    let freezerDirection = scene.physics.velocityFromRotation(this.rotation, 1);
                    freezer.setPosition (
                        this.x + freezerDirection.x*this.body.width/1.5, 
                        this.y + freezerDirection.y*this.body.width/1.5
                    );
                    freezer.setVelocity(
                        freezerDirection.x * constants.SPECIAL_BULLET_SPEED + this.body.velocity.x, 
                        freezerDirection.y * constants.SPECIAL_BULLET_SPEED + this.body.velocity.y
                    );
                    this.items.splice(this.itemsPointer - 1, 1);
                    this.itemsPointer -= 1;
                    break;
                case 'attractorGift':
                    let attractor = scene.attractors.create();
                    attractor.fireFrom = this;
                    let attractorDirection = scene.physics.velocityFromRotation(this.rotation, 1);
                    attractor.setPosition (
                        this.x + attractorDirection.x*this.body.width/1.5, 
                        this.y + attractorDirection.y*this.body.width/1.5
                    );
                    attractor.setVelocity(
                        attractorDirection.x * constants.SPECIAL_BULLET_SPEED + this.body.velocity.x, 
                        attractorDirection.y * constants.SPECIAL_BULLET_SPEED + this.body.velocity.y
                    );
                    this.items.splice(this.itemsPointer - 1, 1);
                    this.itemsPointer -= 1;
                    break;
                default:
                    let bullet = scene.bullets.create();
                    let bulletDirection = scene.physics.velocityFromRotation(this.rotation, 1);
                    bullet.setPosition(
                        this.x + bulletDirection.x*this.body.width/1.5, 
                        this.y + bulletDirection.y*this.body.width/1.5
                    );
                    bullet.setVelocity(
                        bulletDirection.x * constants.BULLET_SPEED + this.body.velocity.x, 
                        bulletDirection.y * constants.BULLET_SPEED + this.body.velocity.y
                    );
            }

        }
    }

    addItem(item) {
        this.itemsPointer = this.items.push(item);
    }

    switchItem(scene) {
        if(scene.time.now > this.lastSwitch + constants.FIRING_DELAY){

            this.lastSwitch = scene.time.now;
            this.itemsPointer += 1;
            if(this.itemsPointer > this.items.length){
                this.itemsPointer = 0;
            }
        }
    }

    kill(posX, posY, angle){
        this.life -= 1;
        this.setPosition(posX, posY);
        this.setVelocity(0);
        this.setAngle(angle)
    }

}