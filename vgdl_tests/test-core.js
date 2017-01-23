var assert = require("assert");
var read = require('read-file');
// var gamejs = require('../src/gamejs.js');	

describe("Testing core", function() {
  it('test import', function () {
    var core = require("../vgdl/core.js")();
    var tools = require('../vgdl/tools.js')();

    var VGDLParser = core.VGDLParser();

    var game_txt = read.sync('vgdl_tests/test_game/game.txt').toString();
    var level_txt = read.sync('vgdl_tests/test_game/level.txt').toString()
    VGDLParser.playGame(game_txt, level_txt);

  });
});

