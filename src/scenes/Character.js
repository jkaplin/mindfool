import Phaser from "phaser";

export class Character {
    constructor (name, imgURL, physics = null, spawn = { x: 0, y: 0 }) {
        this.name = name;
        this.imgURL = imgURL;
        this.physics = physics;
        
        if (physics)
        {
            this.physics.setBounce(0.2); // our player will bounce from items
            this.physics.setCollideWorldBounds(true); // don't go out of the map
        }

        this.deaths = 0;
        this.score = 0;
        this.lifeTime = 0;
        this.won = false;

        this.x = spawn.x;
        this.y = spawn.y;
    }

    refresh() {
        this.lifeTime = 0;
        this.deaths = 0;
    }

    died() {
        this.deaths++;
    }

    addScore(score) {
        this.score += score;
    }

    addTime(time) {
        this.lifeTime += time;
    }

    hasWon() {
        this.won = true;
    }

    moveLeft() {
        if (this.physics.body.velocity.x > -200) {
            this.physics.body.setVelocityX(this.physics.body.velocity.x - 10);
          }
          this.physics.flipX = true; // flip the sprite to the left
    }

    moveRight() {
        if (this.physics.body.velocity.x < 200) {
            this.physics.body.setVelocityX(this.physics.body.velocity.x + 10);
          }
          this.physics.flipX = false; // use the original sprite looking to the right
    }

    moveUp() {
        if (this.physics.body.velocity.y > -200) {
            this.physics.body.setVelocityY(this.physics.body.velocity.y - 10);
        }
    }

    moveDown() {
        if (this.physics.body.velocity.y < 200) {
            this.physics.body.setVelocityY(this.physics.body.velocity.y + 10);
        }
    }

    stopMove() {
        this.physics.body.setVelocityX(0);
        this.physics.body.setVelocityY(0);
    }

    respawn(x = this.x, y = this.y) {
        this.physics.setX(x);
        this.physics.setY(y);
        this.physics.setVelocityX(0);
        this.physics.setVelocityY(0);
    }

    setPhysics(physics)
    {
        this.physics = physics;

        this.physics.setBounce(0.2); // our player will bounce from items
        this.physics.setCollideWorldBounds(true); // don't go out of the map
    }

    calcScore(level) {
        this.score = (1 / this.lifeTime) * 100 - this.deaths * 10;
        return this.score;
    }
}