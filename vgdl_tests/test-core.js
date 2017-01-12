var read = require('read-file');
var assert = require("assert");
var tools = require("../vgdl/tools.js");

describe("Testing tools", function() {

  it("vector norm", function() {
    assert(tools.vectNorm([3, 4]) === 5);
  });

  it("unit vector", function () {
    var u = tools.unitVector([2, 0]); 
    assert(u[0] === 1);
    assert(u[1] === 0);
  });

});

describe("Testing node tree tools", function () {

  it('tree parser: hello world', function () {
    var test_string = "hello\n\tworld";
    var tree = tools.indentTreeParser(test_string, tabsize=8);
    assert(tree.children.length === 1);
    var child = tree.children[0];
    assert(child.content == 'hello');
    assert(child.children.length === 1);
    var next_child = child.children[0];
    assert(next_child.children.length === 0);
    assert(next_child.content === 'world'); 
  });

  it('tree parser: test file', function () {
    // fileReader.readAsText(File('./indent-test.txt'));
    var test_string = read.sync('vgdl_tests/indent-test.txt').toString();

    var tree = tools.indentTreeParser(test_string, tabsize=8);
    assert(tree.children.length === 2);
    var child = tree.children[0];
    assert(child.content == 'First');
    assert(child.children.length === 2);
    var first_child = child.children[0];
    assert(first_child.children.length === 0);
    assert(first_child.content === 'Child1');
    var second_child = child.children[1];
    assert(second_child.children.length === 0);
    assert(second_child.content === 'Child2');

    var child2 = tree.children[1];
    assert(child2.content == 'Second');
    assert(child2.children.length === 1);
    assert(child2.children[0].content === 'Hello');
    assert(child2.children[0].children.length === 0);


  });


});

