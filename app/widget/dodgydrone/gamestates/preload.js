var preload = function(game){};

preload.prototype = {
    preload: function(){

        this.load.crossOrigin = 'Anonymous';

        var loadingBar = this.add.sprite(game.world.centerX,game.world.centerY,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);

        var logo = game.add.sprite(game.world.centerX, game.world.centerY - 35, 'logo');
        logo.anchor.setTo(0.5,0.5);

        game.load.image('sky', 'assets/sky.png');

        game.load.image('sky-parralax', 'assets/_Asset - Tileable Buildings@2x.png', 320, 130);

        game.load.image('hover', 'assets/hoverButton.png');
        game.load.spritesheet('hover-icon', 'assets/Hover SpriteSheet.png', 50, 50);
        game.load.image('lift-button', 'assets/Click To Lift Button.png');
        game.load.image('pause-button', 'assets/Pause Button.png');
        game.load.image('play-button', 'assets/Play Button.png');
        game.load.image('paused', 'assets/Paused.png');
        game.load.image('trophy', 'assets/Trophy.png');
        game.load.image('playagain-button', 'assets/Play Again.png');
        game.load.image('help', 'assets/Help.png');

        game.load.image('obstacle-top-1', 'assets/_Asset - Building1 - Top@2x.png',50,50);
        game.load.image('obstacle-top-2', 'assets/_Asset - Building2 - Top@2x.png');
        game.load.image('obstacle-top-3', 'assets/_Asset - Building3 - Top@2x.png');
        game.load.image('obstacle-top-4', 'assets/_Asset - Building4 - Top@2x.png');
        game.load.image('obstacle-top-5', 'assets/_Asset - Building5 - Top@2x.png');

        game.load.image('obstacle-bottom-1', 'assets/_Asset - Building1 - Bottom@2x.png');
        game.load.image('obstacle-bottom-2', 'assets/_Asset - Building2 - Bottom@2x.png');
        game.load.image('obstacle-bottom-3', 'assets/_Asset - Building3 - Bottom@2x.png');
        game.load.image('obstacle-bottom-4', 'assets/_Asset - Building4 - Bottom@2x.png');
        game.load.image('obstacle-bottom-5', 'assets/_Asset - Building5 - Bottom@2x.png');

        game.load.spritesheet('pigeon', 'assets/_SpriteSheet - Pidgeon@2x.png', 128, 128);
        game.load.spritesheet('player', 'assets/_Spritesheet-Drone@2x.png', 130, 128);

        game.load.image('ui-bg', 'assets/_Asset - UI BG.png');
        game.load.image('icon-heart', 'assets/Icon - Heart@2x.png');
        game.load.image('icon-heart-empty', 'assets/Icon - Heart Empty@2x.png');
        game.load.image('icon-feather', 'assets/Icon - Feather@2x.png');
        game.load.image('icon-cursor', 'assets/Icon - Cursor@2x.png');

        game.load.image('cloud', 'assets/cloud1.png');

        console.log("%cPreload Complete.", "color:white; background:red");
    },

    create: function(){
        game.state.start("Demo");
    }
}
