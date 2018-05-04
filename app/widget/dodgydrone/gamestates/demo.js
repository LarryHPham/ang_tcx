var demo = function(game){};

var player;
var playerClickCooldown = 0;
var platforms;
var topPlatforms;
var botPlatforms;
var playerDieing = false;

var clouds;
var skylines;
var pigeons;
var score = 0;
var highscore = 0;
var skyline1;
var skyline2;
var sky;
var cursorOverPauseButton = false;
var playerHasClickedYet = false;
var emitter;
var gameStarting = false;


//UI
var uiHeart1;
var scoreText;
var uiHeart2;
var uiHeart3;
var uiBackground;
var interfaceBackground;
var pauseBackground;
var pauseButton;
var playButton;
var featherIcon;
var help;
var hoverImage;

var clickToLiftButton;

var pigeonKillCount = 0;
var pigeonHighKillCount = 0;
var pigeonScoreText;
var pigeonsTillNextHeart = 20;
var lives = 3;

var obstacleCooldown = 100;

demo.prototype = {

    create: function () {

        console.log("%cDemo Started.", "color:white; background:red");

        obstacleCooldown = 100;

        //  The game background.
        sky = game.add.sprite(0, 0, 'sky');

        // billboard = game.add.sprite(300, 100, 'billboard-mock');

        // Create our new groups.
        clouds = game.add.group();
        skylines = game.add.group();
        platforms = game.add.group();
        topPlatforms = game.add.group();
        botPlatforms = game.add.group();
        pigeons = game.add.group();

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;
        topPlatforms.enableBody = true;
        botPlatforms.enableBody = true;
        pigeons.enableBody = true;
        clouds.enableBody = true;
        skylines.enableBody = true;

        skyline1 = skylines.create(0, game.world.height - 100, 'sky-parralax');
        skyline1.anchor.x = 0.5;
        skyline1.anchor.y = 0.5;

        skyline2 = skylines.create(game.world.width, game.world.height - 100, 'sky-parralax');
        skyline2.anchor.x = 0.5;
        skyline2.anchor.y = 0.5;

        this.createPlayer();

        this.createInitialObstacles();

        uiBackground = game.add.sprite(0, 0, 'ui-bg');
        uiHeart1 = game.add.sprite(5, 5, 'icon-heart');
        uiHeart1.scale.setTo(0.65, 0.65);
        uiHeart2 = game.add.sprite(30, 5, 'icon-heart');
        uiHeart2.scale.setTo(0.65, 0.65);
        uiHeart3 = game.add.sprite(55, 5, 'icon-heart');
        uiHeart3.scale.setTo(0.65, 0.65);

        help = game.add.sprite(150, 30, 'help');
        help.anchor.setTo(0.5,0.5);
        help.scale.setTo(.8, .8);

        scoreText = game.add.text(game.world.width / 2, 16, score, {font: 'bold 20px Lato', fill: '#44ad26'});
        scoreText.anchor.setTo(0.5, 0.5);
        this.setScore(0);

        featherIcon = game.add.sprite(game.world.width - 10, 3, 'icon-feather');
        featherIcon.scale.setTo(0.65, 0.65);

        pigeonScoreText = game.add.text(game.world.width - 18, 16, pigeonKillCount, {
            font: 'bold 20px Lato',
            fill: '#3879ba'
        });
        pigeonScoreText.anchor.setTo(1.0, 0.5);

        interfaceBackground = game.add.sprite(0, game.world.height - 50, 'ui-bg');
        interfaceBackground.scale.setTo(1, 2);

        // Purely cosmetic, used to give the player an idea of what to do and an area to click that does not obfuscate the view.
        clickToLiftButton = game.add.button(5, game.world.height - 45, 'lift-button', this.clickToLiftButtonAction, this);

        pauseBackground = game.add.sprite((game.world.width / 2), (game.world.height / 2), 'ui-bg');
        pauseBackground.anchor.setTo(0.5,0.5);
        pauseBackground.scale.setTo(1, 15);
        pauseBackground.alpha = 0.5;
        pauseBackground.visible = false;

        pauseButton = game.add.button(game.world.width - 45, game.world.height - 45, 'pause-button', this.clickToPauseButtonAction, this);
        // Adds to events to track if we're pausing, this is used to disable payer input when trying to pause.

        hoverImage = this.game.add.sprite(0,300,"hover");
        hoverImage.inputEnabled = true;
        hoverImage.events.onInputOver.add(this.gameCountDown, this);

        hoverIcon = game.add.sprite(35, 300, 'hover-icon');
        hoverIcon.animations.add('play', [0,1,2,3], 4, true);
        hoverIcon.animations.play('play');

        this.resetGameState();

        gameStarting = false;

    },


    update: function () {

        //  Checks to see if the player overlaps with any of the pigeons, if he does call the collectPigeon function
        game.physics.arcade.overlap(player, pigeons, this.collectpigeon, null, this);
        // Kill player if they hit an obstacle.
        game.physics.arcade.overlap(player, topPlatforms, this.playerDeath, null, this);
        game.physics.arcade.overlap(player, botPlatforms, this.playerDeath, null, this);

        // Kill player if they get to low to the ground or touch the ceiling.
        if (player.body.position.y >= (game.canvas.height - 50) || player.body.position.y <= (20)) {
            this.playerDeath(player);
        }

        this.aiClickCheck();

        this.checkObstacles();

        this.checkpigeons();

        this.checkClouds();

        this.checkSkylines();


        // Shows Timer Overlay when ready.
        if(this.timer) {
            var timeLeft = this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));
            if(timeLeft > 0) {
                this.countdown.setText(this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000)));
            } else {
                this.countdown.setText('Play!');
                if(timeLeft > 3) {
                    this.countdown.setText('Ready?');
                }
            }
        }


    },


    render: function () {

    },



// FUNCTIONS

    aiClickCheck: function () {
        if (playerDieing === false) {

            //  Pushes player up.
            if (player.position.y >= 250) {
                this.pushPlayerUp(false);
            }

            this.player = player;
            if (botPlatforms) {
                botPlatforms.forEach(function (item) {
                    // We are only checking the bottom obstacles.
                    if(item && item.alive === true && item.body.position.y > 190) {

                        // If we're too close and above an obstacle, lower the check threshold.
                        if (game.physics.arcade.distanceBetween(this.player, item) < 50 && item.body.position.x <= this.player.body.position.x + 50){
                            this.pushPlayerUp(true);
                        }

                        // Normal object detection click.
                        if (game.physics.arcade.distanceBetween(this.player, item) < 100 && item.body.position.x - 50 > this.player.body.position.x){
                            this.pushPlayerUp(false);
                        }

                    }
                }, this);
            }

            if (player.body.velocity.y >= 0 && playerDieing === false ) {
                player.animations.play('normal');
            }


            // Click cooldown is to prevent the user from accidental double click and to add some difficulty to timing.
            // Lower cooldown if there is one.
            if (playerClickCooldown > 0) {
                playerClickCooldown -= 1;
            }
        }
    },


    pushPlayerUp: function (override) {

        if(playerClickCooldown <= 0 || override === true) {
            playerClickCooldown = 50;
            if(override) {
                playerClickCooldown = 55;
            }

            player.body.velocity.y = -300;
            player.animations.play('increase-height');
        }
    },

    resetGameState: function () {

        // Clear all of our groups.
        topPlatforms.forEachAlive(function (platform) {
            platform.kill();
        });
        botPlatforms.forEachAlive(function (platform) {
            platform.kill();
        });
        pigeons.forEachAlive(function (pigeon) {
            pigeon.kill();
        });
        clouds.forEachAlive(function (cloud) {
            cloud.kill();
        });
        skylines.forEachAlive(function (skyline) {
            skyline.kill();
        });

        pigeonKillCount = 0;
        pigeonScoreText.text = pigeonKillCount;
        lives = 3;
        playerClickCooldown = 0;
        cursorOverPauseButton = false;
        playerHasClickedYet = false;
        playerDieing = false;
        pigeonsTillNextHeart = 20;
        obstacleCooldown = 0;

        this.setScore(0);

        this.revivePlayer();


    },

    overPause: function() {
    },

    offPause: function() {
    },

    clickToLiftButtonAction: function() {
    },

    clickToPauseButtonAction: function() {
    },

    createCloud: function (numberOfClouds) {
        cloud = clouds.create(game.world.width + 100, game.rnd.integerInRange(0, game.world.height - 150), 'cloud');
        cloud.anchor.x = 0.5;
        cloud.anchor.y = 0.5;
        cloud.body.gravity.y = 0;
        cloud.body.gravity.x = game.rnd.integerInRange(-2, -10);
        var randomScale = game.rnd.realInRange(0.3, 0.9);
        cloud.scale.setTo(randomScale, randomScale);
    },

    checkClouds: function () {
        clouds.forEach(function (cloud) {
            if (cloud.alive === true) {
                if (cloud.body.position.x < -200) {
                    cloud.reset(game.world.width + 100, game.rnd.integerInRange(0, game.world.height));
                }
            }
        }, this);

        if (clouds.countLiving() < 8) {
            if (game.rnd.integerInRange(1, 300) === 1) {
                this.createCloud();
            }
        }
    },

    addScore: function (newScore) {
        score = score + newScore;
        if (score > highscore) {
            highscore = score;
        }
        scoreText.text = score;
    },

    setScore: function (newScore) {
        score = newScore;
        scoreText.text = score;
    },

    playerDeathAnimationDone: function (sprite, animation) {

        // Heart Loss when you die.
        var heartX;

        if (lives === 0) {

            this.resetGameState();
            uiHeart1 = game.add.sprite(5, 5, 'icon-heart');
            uiHeart1.scale.setTo(0.65, 0.65);
            uiHeart2 = game.add.sprite(30, 5, 'icon-heart');
            uiHeart2.scale.setTo(0.65, 0.65);
            uiHeart3 = game.add.sprite(55, 5, 'icon-heart');
            uiHeart3.scale.setTo(0.65, 0.65);
            //this.game.state.start("GameOver", false, false, score, highscore, pigeonKillCount, pigeonHighKillCount );
        } else {
            // Kill all platforms in the group.
            topPlatforms.forEach(function (item) {
                item.kill();
            }, this);
            botPlatforms.forEach(function (item) {
                item.kill();
            }, this);

            lives--;

            if (lives === 2) {
                uiHeart3.kill();
                uiHeart3 = game.add.sprite(55, 5, 'icon-heart-empty');
                uiHeart3.scale.setTo(0.65, 0.65);
                heartX = 55;
            }
            if (lives === 1) {
                uiHeart2.kill();
                uiHeart2 = game.add.sprite(30, 5, 'icon-heart-empty');
                uiHeart2.scale.setTo(0.65, 0.65);
                heartX = 30;
            }
            if (lives === 0) {
                uiHeart1.kill();
                uiHeart1 = game.add.sprite(5, 5, 'icon-heart-empty');
                uiHeart1.scale.setTo(0.65, 0.65);
                heartX = 5;
            }

            // Make our heart pop off the top bar.
            emitter = game.add.emitter(heartX, 5, 1);
            emitter.makeParticles('icon-heart');
            emitter.maxParticleScale = .65;
            emitter.minParticleScale = .65;
            emitter.minParticleAlpha  = .7;
            emitter.maxParticleAlpha  = .7;

            emitter.start(true, 6000, null, 1);

            playerDieing = false;
            this.revivePlayer();
        }
    },

    createPlayer: function () {
        // Create the player.
        player = game.add.sprite(20, 215, 'player');
        player.animations.add('normal', [2], 10, true);
        player.animations.add('increase-height', [1, 0], 10, false);
        var playerDeathAnim = player.animations.add('death', [3, 4, 5], 10, true);
        playerDeathAnim.onComplete.add(this.playerDeathAnimationDone, this);
        player.animations.play('normal');
        player.scale.setTo(.35, .35);


        //  We need to enable physics on the player
        game.physics.arcade.enable(player);
        player.body.setSize(100, 25, 10, 35);
        playerHasClickedYet = false;
        player.body.bounce.y = 0.0;
        player.body.collideWorldBounds = true;

    },

    revivePlayer: function () {
        playerHasClickedYet = false;
        player.body.moves = true;
        player.body.gravity.y = 600;
        player.reset(20, 150);
    },

    playerDeath: function (player) {
        player.body.moves = false;
        playerDieing = true;
        player.animations.play('death', 10, false, false);
    },

    createInitialObstacles: function () {

        var ledge = botPlatforms.create(game.world.width, 0, 'obstacle-bottom-1');
        ledge.width = 70;
        ledge.height = 195;
        ledge.body.immovable = true;
        ledge.ltype = 'bottom';
        ledge.kill();

        ledge = botPlatforms.create(game.world.width, 0, 'obstacle-bottom-2');
        // Adjust for the smokestack, let's push the colision body down
        ledge.body.setSize(130, 300, 0, 55);
        ledge.width = 70;
        ledge.height = 195;
        ledge.body.immovable = true;
        ledge.ltype = 'bottom';
        ledge.kill();

        ledge = botPlatforms.create(game.world.width, 0, 'obstacle-bottom-3');
        ledge.width = 70;
        ledge.height = 195;
        ledge.body.immovable = true;
        ledge.ltype = 'bottom';
        ledge.kill();

        ledge = botPlatforms.create(game.world.width, 0, 'obstacle-bottom-4');
        ledge.width = 70;
        ledge.height = 195;
        ledge.body.immovable = true;
        ledge.ltype = 'bottom';
        ledge.kill();

        ledge = botPlatforms.create(game.world.width, 0, 'obstacle-bottom-5');
        ledge.width = 70;
        ledge.height = 195;
        ledge.body.immovable = true;
        ledge.ltype = 'bottom';
        ledge.kill();


        var botOffset = 25;

        ledge = topPlatforms.create(game.world.width, 0, 'obstacle-top-1');
        ledge.width = 70;
        ledge.height = 195;
        ledge.body.immovable = true;
        ledge.ltype = 'top';
        ledge.kill();

        ledge = topPlatforms.create(game.world.width,0, 'obstacle-top-2');
        ledge.width = 70;
        ledge.height = 195;
        ledge.body.immovable = true;
        ledge.ltype = 'top';
        ledge.kill();

        ledge = topPlatforms.create(game.world.width, 0, 'obstacle-top-3');
        // Adjust for the smokestack, let's push the colision body down
        ledge.body.setSize(130, 350, 0, 0);
        ledge.width = 70;
        ledge.height = 195;
        ledge.body.immovable = true;
        ledge.ltype = 'top';
        ledge.kill();

        ledge = topPlatforms.create(game.world.width, 0, 'obstacle-top-4');
        ledge.width = 70;
        ledge.height = 195;
        ledge.body.immovable = true;
        ledge.ltype = 'top';
        ledge.kill();

        ledge = topPlatforms.create(game.world.width, 0, 'obstacle-top-5');
        ledge.width = 70;
        ledge.height = 195;
        ledge.body.immovable = true;
        ledge.ltype = 'top';
        ledge.kill();

    },

    spawnObstacles: function () {

        obstacleCooldown = 100;

        var maxGap = game.rnd.integerInRange(165, 175);

        var heightShift = game.rnd.integerInRange(0, 100);

        var botOffset = 35;

        // If it's the first platform, let's make it the same height every time for new players.
        if(topPlatforms.countLiving() + botPlatforms.countLiving() < 2) {
            heightShift = 20;
        }

        topLedge = this.getRandomTop();
        if(topLedge) {
            topLedge.reset(game.world.width, ((((game.world.height / 2)) - (maxGap / 2)) - heightShift - 90) - 40);
        }

        botLedge = this.getRandomBot();
        if(botLedge) {
            botLedge.reset(game.world.width, (((game.world.height / 2) + (maxGap / 2)) - heightShift + botOffset) - 40);
        }

    },

    getRandomTop: function () {
        var ledge = topPlatforms.getRandom(0,4);
        while(ledge.alive === true) {
            ledge = topPlatforms.getRandom(0,4);
        }

        return ledge;
    },

    getRandomBot: function () {
        var ledge = botPlatforms.getRandom(0,4);
        while(ledge.alive === true) {
            ledge = botPlatforms.getRandom(0,4);
        }

        return ledge;
    },

    checkObstacles: function () {
        topPlatforms.forEachAlive(function (item) {
            item.body.position.x -= 2;
            if (item.body.position.x < (item.width) * -1) {
                item.kill();
                this.addScore(5);
            }
        }, this);

        botPlatforms.forEachAlive(function (item) {
            item.body.position.x -= 2;
            if (item.body.position.x < (item.width) * -1) {
                item.kill();
                this.addScore(5);
            }
        }, this);

        // Create new obstacles when count is under 4 (2 per 1 column top and bottom)
        if (botPlatforms.countLiving() + topPlatforms.countLiving() < 4 && obstacleCooldown <= 0) {
            this.spawnObstacles();
        }

        if (obstacleCooldown > 0) {
            obstacleCooldown -= 1;
        }
    },

    checkSkylines: function () {
        skyline1.x -= 1;
        skyline2.x -= 1;
        if (skyline1.x < (skyline1.width / 2) * -1) {
            skyline1.reset(game.world.width + (skyline1.width / 2), game.world.height - 100);
        }
        if (skyline2.x < (skyline2.width / 2) * -1) {
            skyline2.reset(game.world.width + (skyline2.width / 2), game.world.height - 100);
        }
    },

    createpigeons: function (maxpigeons) {

        for (var i = 0; i < maxpigeons; i++) {
            var pigeon = pigeons.create(300, game.rnd.integerInRange(50, game.world.width), 'pigeon');

            pigeon.checkWorldBounds = true;
            pigeon.events.onOutOfBounds.add(this.pigeonOutOfBounds, this);
            pigeon.isExploding = false;

            pigeon.scale.setTo(0.35, 0.35);
            pigeon.body.setSize(75, 75, 25, 25);

            pigeon.body.gravity.y = 300;

            pigeon.body.velocity.y = -150;
            pigeon.body.velocity.x = game.rnd.integerInRange(-100, -50);

            pigeon.animations.add('fly', [0, 1, 2], 10, true);
            var pigeonExplodeAnim = pigeon.animations.add('explode', [3, 4, 5], 10, false);
            pigeonExplodeAnim.onComplete.add(this.pigeonDeathComplete, this);
            pigeon.animations.play('fly');

        }
    },

    pigeonOutOfBounds: function (pigeon) {
        pigeon.kill();
        pigeon.position.x = 320;
    },

    checkpigeons: function () {
        pigeons.forEachAlive(function (pigeon) {
            if (pigeon.isExploding === false) {

                pigeon.body.position.x -= 2;

                // Flap
                var random = game.rnd.integerInRange(1, 25);
                if (random === 1) {
                    pigeon.body.velocity.y = -150;
                }
            }
        }, this);

        // Spawn pigeons
        if (game.rnd.integerInRange(1, 75) === 1) {

            // If we have less than 6 made, make a new one.
            if ((pigeons.countDead() + pigeons.countLiving()) < 6) {
                this.createpigeons(1);
            } else {
                // Otherwise let's grab a dead one and revive him.
                var pigeon = pigeons.getFirstDead();
                if (pigeon) {
                    pigeon.reset(300, game.rnd.integerInRange(50, 200));
                    pigeon.body.moves = true;
                    pigeon.body.gravity.y = 300;
                    pigeon.body.velocity.y = -150;
                    pigeon.body.velocity.x = game.rnd.integerInRange(-100, -50);
                    pigeon.animations.play('fly');
                }
            }
        }

    },

    collectpigeon: function (player, pigeon) {
        if(pigeon.isExploding === false) {
            pigeon.isExploding = true;
            pigeon.body.moves = false;
            pigeon.animations.play('explode', 15, false, false);

            // Feather explosion when you hit a pigeon.
            emitter = game.add.emitter(pigeon.centerX, pigeon.centerY, 5);
            emitter.makeParticles('icon-feather');
            emitter.maxParticleScale = 0.3;
            emitter.minParticleScale = 0.2;

            emitter.start(true, 8000, null, 5);
        }
    },


    pigeonDeathComplete: function (pigeon, animation) {
        pigeonKillCount++;
        pigeonsTillNextHeart--;

        if (pigeonKillCount > pigeonHighKillCount) {
            pigeonHighKillCount = pigeonKillCount;
        }

        pigeonScoreText.text = pigeonKillCount;

        pigeon.kill();
        pigeon.body.moves = true;
        pigeon.isExploding = false;
        pigeon.position.x = 320;
        this.addScore(10);

        if (pigeonsTillNextHeart === 0) {
            pigeonsTillNextHeart = 20;
            if (lives < 3) {
                if (lives === 2) {
                    uiHeart3.kill();
                    uiHeart3 = game.add.sprite(55, 5, 'icon-heart');
                    uiHeart3.scale.setTo(0.65, 0.65);
                }
                if (lives === 1) {
                    uiHeart2.kill();
                    uiHeart2 = game.add.sprite(30, 5, 'icon-heart');
                    uiHeart2.scale.setTo(0.65, 0.65);
                }
                if (lives === 0) {
                    uiHeart1.kill();
                    uiHeart1 = game.add.sprite(5, 5, 'icon-heart');
                    uiHeart1.scale.setTo(0.65, 0.65);
                }
                lives++;
            }
        }
    },

    gameCountDown: function(){

        if(gameStarting === false) {
            hoverImage.kill();
            hoverIcon.kill();
            gameStarting = true;

            this.interfaceBackground = game.add.sprite((game.world.width / 2), (game.world.height / 2), 'ui-bg');
            this.interfaceBackground.anchor.setTo(0.5,0.5);
            this.interfaceBackground.scale.setTo(1, 15);
            this.interfaceBackground.alpha = 0.8;

            this.timer = game.time.create();
            this.timerEvent = this.timer.add(Phaser.Timer.SECOND * 2, this.playTheGame, this);

            this.countdown = game.add.text(150, 175, this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000)), {
                font: 'bold 128px Lato',
                fill: '#ffffff'
            });
            this.countdown.anchor.setTo(0.5, 0.5);
            this.countdown.style.font = 'bold 128px Lato';

            this.timer.start();
        }
    },

    formatTime: function(s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "" + Math.floor(s / 60);
        var seconds = "" + (s - minutes * 60);
        return seconds.substr(-2);
    },

    playTheGame: function(){
        this.interfaceBackground.kill();
        this.game.state.start("GameLoop", true);
        hoverImage.kill();
    }

};
