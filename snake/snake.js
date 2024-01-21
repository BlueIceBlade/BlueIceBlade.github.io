let snakeSettings = {
    gridX: 25,
    gridY: 25,
    gameContainer: '.game',
    scoreContainer: '.score',
    speed: 4
};
let snakeBody = new Array();
let snakeHead = {};
let egg = {};
let grid;
let interval;
let gameStarted = false;
let score = 0;
const Snake = {
    //Start game
    start: () => {
        //Generate grid
        Snake.generateGrid();

        //Place snake in random position
        Snake.init();

        //Start moving
        Snake.move();

    },
    generateGrid: () => {
        let gridContainer = $('<ul></ul>');
        let block;

        //Loop through Y-axis first and then X-axis
        for (let y=1; y <= snakeSettings.gridY; y++) {
            for (let x=1; x <= snakeSettings.gridX; x++) {
                //Create block
                block = $('<li data-y="'+y+'" data-x="'+x+'"></li>');

                //Mark first block in the row
                if (x == 1) {
                    block.addClass('first');
                }

                //Append block
                gridContainer.append(block);
            }
        }

        //Replace contents of game container with grid
        $(snakeSettings.gameContainer).html(gridContainer);

        //Assign selector to var
        grid = $(snakeSettings.gameContainer);
    },
    init: () => {
        //Work out random position for the head 5 block towards the inside
        snakeHead = {
            x: Math.floor(Math.random() * (snakeSettings.gridX - 5)) + 5,
            y: Math.floor(Math.random() * (snakeSettings.gridY - 5)) + 5,
            d: Math.floor(Math.random() * 4)
        }

        //Reset snake body
        snakeBody = [];

        //Place head and set direction
        grid.find('li[data-x="'+snakeHead.x+'"][data-y="'+snakeHead.y+'"]').addClass('head').attr('data-dir', snakeHead.d);

        //Place egg in random position
        Snake.placeEgg();

        //Set score to 0
        score = 0;
        Snake.score(0);

        //Set game as started
        gameStarted = true;
    },
    placeEgg: () => {
        //Work out random position for the egg
        egg = {
            x: Math.floor(Math.random() * snakeSettings.gridX) + 1,
            y: Math.floor(Math.random() * snakeSettings.gridY) + 1,
        }

        //Make sure new egg doesn't fall on the head
        if (egg.x == snakeHead.x && egg.y == snakeHead.y) {
            Snake.placeEgg();
            return false;
        }

        //Make sure new egg doesn't fall on body
        for (let bodyPart of snakeBody) {
            if (egg.x == bodyPart.x && egg.y == bodyPart.y) {
                Snake.placeEgg();
                return false;
            }
        }

        //Place Egg
        grid.find('.egg').removeClass('egg');
        grid.find('li[data-x="'+egg.x+'"][data-y="'+egg.y+'"]').addClass('egg');
    },
    move: () => {
        let currentSpeed = 1000/snakeSettings.speed;
        clearTimeout(interval);
        interval = setTimeout(() => {
            let oldHead = structuredClone(snakeHead);

            //Increment head value based on direction
            switch(snakeHead.d) {
                case 0: {
                    console.log('go up');
                    snakeHead.y -= 1;
                    break;
                }
                case 1: {
                    console.log('go right');
                    snakeHead.x += 1;
                    break;
                }
                case 2: {
                    console.log('go down');
                    snakeHead.y += 1;
                    break;
                }
                case 3: {
                    console.log('go left');
                    snakeHead.x -= 1;
                    break;
                }
            }

            //Check if snake died
            if (Snake.isDead()) {
                alert('You died...');
                return false;
            }

            //Check if snake ate something
            if (snakeHead.x == egg.x && snakeHead.y == egg.y) {
                Snake.eat();

                //Extend body without removing a segment
                snakeBody.push({x:oldHead.x, y:oldHead.y});
            }
            else {
                //Remove first segment and add old head as new segment to move the snake
                snakeBody.shift();
                snakeBody.push({x:oldHead.x, y:oldHead.y});
            }

            //Remove old head position and set new one
            grid.find('.head').removeAttr('data-dir').removeClass('head');
            grid.find('li[data-x="'+snakeHead.x+'"][data-y="'+snakeHead.y+'"]').addClass('head').attr('data-dir', snakeHead.d);

            //Move body
            grid.find('.body').removeClass('body');
            for (let bodyPart of snakeBody) {
                grid.find('li[data-x="'+bodyPart.x+'"][data-y="'+bodyPart.y+'"]').addClass('body');
            }

            //Continue movement
            Snake.move();
        }, currentSpeed);
    },
    eat: () => {
        //Set a new egg
        Snake.placeEgg();

        //Add Score
        Snake.score();
    },
    score: (num=1) => {
        //Add score
        score += num;

        //Update score number
        $(snakeSettings.scoreContainer).text(score);
    },
    isDead: () => {
        //Check if head touched the walls
        if (snakeHead.x <= 0 || snakeHead.x > snakeSettings.gridX || snakeHead.y <= 0 || snakeHead.y > snakeSettings.gridY) {
            gameStarted =  false;
            return true;
        }

        //Check if snake bit itself
        for (let bodyPart of snakeBody) {
            if (snakeHead.x == bodyPart.x && snakeHead.y == bodyPart.y) {
                gameStarted =  false;
                return true;
            }
        }
        if (snakeHead.x <= 0 || snakeHead.x > snakeSettings.gridX || snakeHead.y <= 0 || snakeHead.y > snakeSettings.gridY) {
            gameStarted =  false;
            return true;
        }

        //Snake is fine
        return false;
    },

}

//Bind controls
$(document).on('keyup', function(e) {
    if (!gameStarted) {
        return false;
    }

    switch (e.keyCode) {
        case 38: {
            //Move up
            snakeHead.d = snakeHead.d != 2 ? 0 : snakeHead.d;
            break;
        }
        case 39: {
            //Move right
            snakeHead.d = snakeHead.d != 3 ? 1 : snakeHead.d;
            break;
        }
        case 40: {
            //Move down
            snakeHead.d = snakeHead.d != 0 ? 2 : snakeHead.d;
            break;
        }
        case 37: {
            //Move left
            snakeHead.d = snakeHead.d != 1 ? 3 : snakeHead.d;
        }
    }
});