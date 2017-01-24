var assert = require("assert");
var read = require('read-file');
// var gamejs = require('../src/gamejs.js');	

describe("Testing parser", function() {
  it('test import', function () {
    var vgdl_parser = require("../vgdl/core/vgdl-parser.js");
    var VGDLParser = vgdl_parser();


    var game_txt = read.sync('vgdl_tests/test_game/game.txt').toString();
    var level_txt = read.sync('vgdl_tests/test_game/level.txt').toString();
    VGDLParser.playGame(game_txt, level_txt);

  });
});

