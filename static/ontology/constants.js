var GREEN = "#81c784";
var BLUE = "#1976d2";
var RED = "#d32f2f";
var GRAY = "#455a64";
var WHITE = "#fafafa";
var BROWN = "#6d4c41";
var BLACK = "#37474f";
var ORANGE = "#e65100";
var YELLOW = "#fff59d";
var PINK = "#ff8a80";
var GOLD = "#ffc400";
var LIGHTRED = "#ff5252";
var LIGHTORANGE = "#ff7043";
var LIGHTBLUE = "#90caf9";
var LIGHTGREEN = "#b9f6ca";
var LIGHTGRAY = "#cfd8dc";
var DARKGRAY = "#455a64";
var DARKBLUE = "#01579b";
var PURPLE = "#5c6bc0";


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