var gameover = function(game){};

gameover.prototype = {
    init: function (score, highscore, pidgeonKillCount, pidgeonHighKillCount) {

        this.endScore = score;
        this.endHighScore = highscore;
        this.endPidgeonKillCount = pidgeonKillCount;
        this.endPidgeonHighKillCount = pidgeonHighKillCount;

    },

    create: function () {

        var localHighScoreJson = localStorage.getItem("highscores");

        if (localHighScoreJson) {
            var localHighScoresArray = JSON.parse(localHighScoreJson);
        }

        if (!localHighScoresArray) {
            var localHighScoresArray = new Array;
        }

        localHighScoresArray.push({highScore: this.endScore});

        // Sort All Local Scores with the Players Score.
        localHighScoresArray.sort(function (a, b) {
            return b.highScore - a.highScore
        });

        // Remove any duplicates.
        var temp = new Array;
        for (i = 0; i < localHighScoresArray.length; i++) {
            if (localHighScoresArray[i + 1]) {
                if (localHighScoresArray[i].highScore === localHighScoresArray[i + 1].highScore) {
                    continue
                }
            }
            temp.push({highScore: localHighScoresArray[i].highScore});
        }
        localHighScoresArray = temp;

        // Save the new highscore array.
        localStorage.setItem("highscores", JSON.stringify(localHighScoresArray));

        var placeScore = new Array;
        placeScore[1] = (localHighScoresArray[0] ? localHighScoresArray[0].highScore : 0);
        placeScore[2] = (localHighScoresArray[1] ? localHighScoresArray[1].highScore : 0);
        placeScore[3] = (localHighScoresArray[2] ? localHighScoresArray[2].highScore : 0);
        placeScore[4] = (localHighScoresArray[3] ? localHighScoresArray[3].highScore : 0);
        placeScore[5] = (localHighScoresArray[4] ? localHighScoresArray[4].highScore : 0);


        this.interfaceBackground = game.add.sprite(0, 25, 'ui-bg');
        this.interfaceBackground.scale.setTo(1, 15);
        this.interfaceBackground.alpha = .8;

        this.scoreText1 = game.add.text(150, 55, "GAME OVER", {
            font: 'bold 24px Lato',
            fill: '#ff0000',
            align: 'center'
        });
        this.scoreText1.anchor.setTo(0.5, 0.5);

        this.scoreText2 = game.add.text(150, 100, "SCORE: " + this.endScore, {
            font: '32px Lato',
            fill: '#ffffff',
            align: 'center'
        });
        this.scoreText2.anchor.setTo(0.5, 0.5);

        this.gotNewHighScore = false;
        for (var i = 1; i <= 5; i++) {
            if (placeScore[i] === this.endScore && this.endScore > 0) {
                this.gotNewHighScore = true;
                this.highScoreSprite = game.add.sprite(70, 138, 'trophy');
                this.highScoreSprite.anchor.setTo(0.5, 0.5);
                this.scoreText3 = game.add.text(80, 142, "NEW HIGH SCORE!", {
                    font: 'bold 16px Lato',
                    fill: '#c9aa02',
                    align: 'center'
                });
                this.scoreText3.anchor.setTo(0, 0.5);
            }
        }

        this.highScoreList = game.add.text(150, 175, "ALL TIME HIGH SCORES", {
            font: '16px Lato',
            fill: '#ffffff',
            align: 'center'
        });
        this.highScoreList.anchor.setTo(0.5, 0.5);

        this.highScoreList1 = game.add.text(150, 200, "1. " + placeScore[1], {
            font: '16px Lato',
            fill: '#ffffff',
            align: 'left'
        });
        this.highScoreList1.anchor.setTo(0.5, 0.5);
        if (placeScore[1] === this.endScore && this.endScore > 0) {
            this.highScoreList1.addColor('#c9aa02', 0);
        }

        this.highScoreList2 = game.add.text(150, 222, "2. " + placeScore[2], {
            font: '16px Lato',
            fill: '#ffffff',
            align: 'left'
        });
        this.highScoreList2.anchor.setTo(0.5, 0.5);
        if (placeScore[2] === this.endScore && this.endScore > 0) {
            this.highScoreList2.addColor('#c9aa02', 0);
        }

        this.highScoreList3 = game.add.text(150, 242, "3. " + placeScore[3], {
            font: '16px Lato',
            fill: '#ffffff',
            align: 'left'
        });
        this.highScoreList3.anchor.setTo(0.5, 0.5);
        if (placeScore[3] === this.endScore && this.endScore > 0) {
            this.highScoreList3.addColor('#c9aa02', 0);
        }

        this.highScoreList4 = game.add.text(150, 262, "4. " + placeScore[4], {
            font: '16px Lato',
            fill: '#ffffff',
            align: 'left'
        });
        this.highScoreList4.anchor.setTo(0.5, 0.5);
        if (placeScore[4] === this.endScore && this.endScore > 0) {
            this.highScoreList4.addColor('#c9aa02', 0);
        }

        this.highScoreList5 = game.add.text(150, 282, "5. " + placeScore[5], {
            font: '16px Lato',
            fill: '#ffffff',
            align: 'left'
        });
        this.highScoreList5.anchor.setTo(0.5, 0.5);
        if (placeScore[5] === this.endScore && this.endScore > 0) {
            this.highScoreList5.addColor('#c9aa02', 0);
        }

        this.playButton = this.game.add.button(150, game.world.height - 25, "playagain-button", this.playTheGame, this);
        this.playButton.anchor.setTo(0.5, 0.5);
    },

    update: function(){
        if(this.gotNewHighScore === true) {
            shootFeatherFireworks = game.rnd.integerInRange(0, 100);
            if (shootFeatherFireworks <= 1) {
                fireworkX = game.rnd.integerInRange(25, 275);
                fireworkY = game.rnd.integerInRange(25, 275);

                emitter = game.add.emitter(fireworkX, fireworkY, 25);
                emitter.makeParticles('icon-feather');
                emitter.maxParticleScale = 0.4;
                emitter.minParticleScale = 0.2;

                emitter.start(true, 8000, null, 25);
                emitter.forEach(function (particle) {
                    particle.tint = Math.random() * 0xffffff;
                    particle.alpha = .6;
                });
            }
        }
    },




    playTheGame: function(){
        this.playButton.destroy();
        this.interfaceBackground.kill();
        this.game.state.start("GameLoop", true, false, this.endHighScore, this.endPidgeonHighKillCount);
    }

};
