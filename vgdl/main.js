/**
 * @fileoverview
 * Draw lines, polygons, circles, etc on the screen.
 * Render text in a certain font to the screen.
 */

var gamejs = require('gamejs');
var vgdl_parser = VGDLParser(gamejs);

var game_txt = `
BasicGame
   SpriteSet    
      pad > Immovable color=BLUE 
      avatar > MovingAvatar
            
   TerminationSet
      SpriteCounter stype=pad win=True      
           
   InteractionSet
      avatar EOS > stepBack
      avatar wall > stepBack
      pad avatar > killSprite

   LevelMapping
      G > pad`;

var level_txt = `
wwwwwwwwwwwwwwwwwwwwww
w        w    w      w
w           www      w
w             w     ww
w           G        w
w   w                w
w    www          w  w
w      wwwwwww  www  w
w              ww    w
w  G            w    w
w  ww  G           G w
wA    wwwwww         w
wwwwwwwwwwwwwwwwwwwwww`;

gamejs.ready(vgdl_parser.playGame(examples.predictions1.game, 
   examples.predictions1.level));

// function main() {
//    console.log('hello');

// };

// // gamejs.ready will call your main function
// // once all components and resources are ready.
// gamejs.ready(main);


