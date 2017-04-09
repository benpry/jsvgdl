/**
 * @fileoverview
 * Draw lines, polygons, circles, etc on the screen.
 * Render text in a certain font to the screen.
 */

// var gamejs = require('gamejs');
var vgdl_parser = VGDLParser(gamejs);
var vgdl_game = examples.aliens;

gamejs.ready(vgdl_parser.playGame(vgdl_game.game, vgdl_game.level));

// // gamejs.ready will call your main function
// // once all components and resources are ready.
// gamejs.ready(main);


