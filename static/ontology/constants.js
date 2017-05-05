var BLUE = '#0000c8';
var GRAY = '#5a5a5a';
var GOLD = '#fad400';
var BROWN = '#8c7864';
var DARKBLUE = '#141464';
var DARKGRAY = '#1e1e1e';
var LIGHTGRAY = '#969696';
var YELLOW = '#fafa00';
var LIGHTGREEN = '#32fa32';
var LIGHTORANGE = '#fac864';
var PURPLE = '#8c148c';
var GREEN = '#00c800';
var PINK = '#fac8c8';
var LIGHTRED = '#fa3232';
var ORANGE = '#faa000';
var BLACK = '#000000';
var WHITE = '#fafafa';
var LIGHTBLUE = '#3264fa';
var RED = '#c80000';

var UP = [0, -1]
var DOWN = [0, 1]
var LEFT = [-1, 0]
var RIGHT = [1, 0]

var BASEDIRS = [this.UP, this.LEFT, this.DOWN, this.RIGHT]

var colorDict = {
'#0000c8' : 'BLUE',
'#5a5a5a' : 'GRAY',
'#fad400' : 'GOLD',
'#8c7864' : 'BROWN',
'#141464' : 'DARKBLUE',
'#1e1e1e' : 'DARKGRAY',
'#969696' : 'LIGHTGRAY',
'#fafa00' : 'YELLOW',
'#32fa32' : 'LIGHTGREEN',
'#fac864' : 'LIGHTORANGE',
'#8c148c' : 'PURPLE',
'#00c800' : 'GREEN',
'#fac8c8' : 'PINK',
'#fa3232' : 'LIGHTRED',
'#faa000' : 'ORANGE',
'#000000' : 'BLACK',
'#fafafa' : 'WHITE',
'#3264fa' : 'LIGHTBLUE',
'#c80000' : 'RED'
}

try {
	module.exports = Constants;
} catch (e) {
	
}