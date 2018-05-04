var gameloop = function(game){

};

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

var clickToLiftButton;

var pigeonKillCount = 0;
var pigeonHighKillCount = 0;
var pigeonScoreText;
var pigeonsTillNextHeart = 20;
var lives = 3;

var obstacleCooldown = 100;

gameloop.prototype = {

    init: function(highscorePassed, pigeonHighKillCountPassed){
        if(highscorePassed) {
            highscore = highscorePassed;
        } else {
            highscore = 0;
        }
        if(pigeonHighKillCountPassed) {
            pigeonHighKillCount = pigeonHighKillCountPassed;
        } else {
            pigeonHighKillCount = 0;
        }
    },

    create: function () {

        console.log("%cGame Loop Started.", "color:white; background:red");

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
        pauseButton.events.onInputOver.add(this.overPause, this);
        pauseButton.events.onInputOut.add(this.offPause, this);

        playButton = game.add.button(game.world.width - 45, game.world.height - 45, 'play-button', this.clickToPauseButtonAction, this);
        // Adds to events to track if we're pausing, this is used to disable payer input when trying to pause.
        playButton.events.onInputOver.add(this.overPause, this);
        playButton.events.onInputOut.add(this.offPause, this);
        playButton.visible = false;

        pausedIcon = game.add.sprite(game.world.width / 2, game.world.height / 2, 'paused');
        pausedIcon.anchor.setTo(0.5,0.5);
        pausedIcon.visible = false;

       this.resetGameState();

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

        this.registerInput();

        this.checkObstacles();

        this.checkpigeons();

        this.checkClouds();

        this.checkSkylines();


    },


    render: function () {

    },



// FUNCTIONS

    registerInput: function () {
        if(game.input.activePointer.isDown){
            if ( playerClickCooldown <= 0 && playerDieing === false && cursorOverPauseButton === false) {

                if(playerHasClickedYet === false) {
                    playerHasClickedYet = true;
                    player.body.moves = true;
                    player.body.gravity.y = 600;
                }

                //  Pushes player up.
                player.body.velocity.y = -300;

                // Click cooldown is to prevent the user from accidental double click and to add some difficulty to timing.
                playerClickCooldown = 18;
                player.animations.play('increase-height');
            }
        }

        if (player.body.velocity.y >= 0 && playerDieing === false &&  player.animations.name !== 'normal') {
            player.animations.play('normal');
        }

        // Lower cooldown if there is one.
        if (playerClickCooldown > 0) {
            playerClickCooldown -= 1;
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
        cursorOverPauseButton = true;
    },

    offPause: function() {
        cursorOverPauseButton = false;
    },

    clickToLiftButtonAction: function() {
    },

    clickToPauseButtonAction: function() {
        if(game.paused === true) {
            playButton.visible = false;
            pauseButton.visible = true;
            pauseBackground.visible = false;
            game.paused = false;
            pausedIcon.visible = false;
        } else {
            pauseButton.visible = false;
            playButton.visible = true;
            pauseBackground.visible = true;
            game.paused = true;
            cursorOverPauseButton = false;
            pausedIcon.visible = true;

        }
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
            this.game.state.start("GameOver", false, false, score, highscore, pigeonKillCount, pigeonHighKillCount );
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

    sendPostMessageToIgloo: function(postObject, maxLoops) {
        // Initialize variables
        var postWindows = [window];
        var currentWindow = window;
        var currentLoop = 0;
        maxLoops = typeof maxLoops === 'undefined' ? 10 : maxLoops;
        // Build all of the windows to send the message to igloo
        try {
            // Loop through all of the windows
            while (currentLoop++ < maxLoops && currentWindow !== window.top) {
                // Move up a layer
                currentWindow = currentWindow.parent;
                // Add to the postMessage array
                postWindows.push(currentWindow);
            }
        } catch (e) {}

        // Send the post messages
        for (var i = 0; i < postWindows.length; i++) {
            postWindows[i].postMessage(postObject, '*');
        }
    },

    revivePlayer: function () {
        //send igloo event to swap ads here
        playerHasClickedYet = false;
        player.reset(20, 215);
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

        if(pigeonKillCount > pigeonHighKillCount){
            pigeonHighKillCount = pigeonKillCount;
        }

        pigeonScoreText.text = pigeonKillCount;

        pigeon.kill();
        pigeon.body.moves = true;
        pigeon.isExploding = false;
        pigeon.position.x = 320;
        this.addScore(10);

        if(pigeonsTillNextHeart === 0) {
            pigeonsTillNextHeart = 20;
            if(lives < 3) {
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
    }

};
