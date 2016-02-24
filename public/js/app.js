//Global Variables
var enemyPosition = [ 72, 155, 238];
var enemySpeed = [100, 200, 300, 400, 500];

var gemPositionX = [0, 101, 202, 303, 404];
var gemPositionY = [72, 155, 238];
var gemType = ["images/Gem Blue.png", "images/Gem Green.png", "images/Gem Orange.png"];

var score = [];

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -101;
    this.y = enemyPosition[Math.round(Math.random() * enemyPosition.length)];
    this.speed = enemySpeed[Math.round(Math.random() * enemySpeed.length)];
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + ( dt * this.speed);

    if ( this.x >= player.x + dt - 50 &&
        this.x <= player.x + dt + 101 &&
        this.y == player.y ) {
        player.reset();
        heart.removeHeart();
    };

    if ( this.x >= 909 ) {
        this.x = -101;
        this.y = enemyPosition[Math.round(Math.random() * enemyPosition.length)];
        this.speed = enemySpeed[Math.round(Math.random() * enemySpeed.length)];
        this.render();
    };
}; 

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = 404;
    this.y = 321;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function() {
    if (this.x == gem.x &&
        this.y == gem.y) {
        gem.addScore(gem.sprite);

        if (score.length >= 30) {
            heart.gameOver();
        } else {
            gem.move();
            allEnemies.push(new Enemy());
        }
    };
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.reset = function() {
    this.x = 404;
    this.y = 321;
};

Player.prototype.handleInput = function(allowedKeys) {
    switch(allowedKeys) {
        case 'left':
            if (this.x > 0) {
                this.x -= 101;
            }
            break;
        case 'up':
            if (this.y > 0) {
                this.y -= 83;
                if (this.y < 60) {
                    this.reset();
                    heart.removeHeart();
                };
            }
            break;
        case 'right':
            if (this.x < 404) {
                this.x += 101;
            };

            break;
        case 'down':
            if (this.y < 404) {
                this.y += 83;
            };

            break;
        default:
            break;
    }
};

var Gem = function() {
    this.x = gemPositionX[Math.floor(Math.random() * gemPositionX.length)];;
    this.y = gemPositionY[Math.floor(Math.random() * gemPositionY.length)];
    this.sprite = gemType[Math.floor(Math.random() * gemType.length)];
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Gem.prototype.move = function() {
    this.x = gemPositionX[Math.floor(Math.random() * gemPositionX.length)];
    this.y = gemPositionY[Math.floor(Math.random() * gemPositionY.length)];
    this.sprite = gemType[Math.floor(Math.random() * gemType.length)]
    this.render();
};

Gem.prototype.addScore = function(pickedGemSprite) {
    var x;
    var sprite = pickedGemSprite;

    if (score.length > 0) {
        x = score[score.length-1].locationX + 30;
    } else {
        x = 0;
    };

    ctx.drawImage( Resources.get(sprite), x, 0, 30, 50 );

    score.push({locationX: x});
}

var Heart = function() {
    this.heartImage = "images/Heart.png";
    this.playerLife = 5;
}

Heart.prototype.removeHeart = function() {
    if (this.playerLife > 0) {
        this.playerLife = this.playerLife - 1;
    }
}

Heart.prototype.render = function() {
    var x = 0;
    for (var i = 0; i < this.playerLife; i++) {
        ctx.drawImage( Resources.get(this.heartImage), x, 590, 50, 80 );
        x = x + 50;
    }

    if (this.playerLife <= 0) {
        this.gameOver();
    }
}

Heart.prototype.gameOver = function() {

    ctx.drawImage( Resources.get('images/game-over.png'), 0, 0 );
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "40pt Impact";
    ctx.fillText("You've got " + score.length + " gems.", 454, 424);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var enemy4 = new Enemy();
var allEnemies = [enemy1, enemy2, enemy3, enemy4];

var gem = new Gem();
var heart = new Heart();
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Remove keydown automatic screen scrolling
// ref.: http://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
document.addEventListener('keydown', function(e) {
    if ([37, 38, 39, 40].indexOf(e.keycode) > -1) {
        e.preventDefault();
    };
}, false);