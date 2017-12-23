
var _ui;

window.onload = function init() 
{
	_ui = new UserInterface();
	_ui.init();
	
};

var CANVAS_WIDTH = 128;
var CANVAS_HEIGHT = 128;


// Symbols used to mark special rooms
var ROOM_ORB = '$';
var ROOM_RUNE = '#';
var ROOM_TRAP = '&';

var MAX_DISTANCE = 99;

function UserInterface() 
{
}

// Map of all known room IDs
var _map_room_ids =
[
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '']
];

// Mas of all known room exits
var _map_room_exits =
[
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '']
];


// List of all the ID's already discovered
var _assigned_ids = [];


// Array used to track the distance from one room to all the other rooms
// Each rooms needs to have 2 distances because of the overlap rooms
// Normal rooms will have the same value on both values, overlap rooms
// will have different values depending if you enter then by NS or EW
var _map_room_distance =
[
    [[99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99]],
    [[99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99]],
    [[99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99]],
    [[99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99]],
    [[99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99]],
    [[99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99]],
    [[99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99]],
    [[99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99], [99, 99]]
];


// Load all the images used in the UI
var image_1_exit=document.createElement("img");
image_1_exit.src="images/1_exit.svg";
var image_2_exit_straight=document.createElement("img");
image_2_exit_straight.src="images/2_exit_straight.svg";
var image_2_exit_turn=document.createElement("img");
image_2_exit_turn.src="images/2_exit_turn.svg";
var image_3_exit=document.createElement("img");
image_3_exit.src="images/3_exit.svg";
var image_4_exit=document.createElement("img");
image_4_exit.src="images/4_exit.svg";

var image_death=document.createElement("img");
image_death.src="images/death.png";
var image_rune=document.createElement("img");
image_rune.src="images/rune.svg";
var image_orb=document.createElement("img");
image_orb.src="images/orb.svg";
var image_valid=document.createElement("img");
image_valid.src="images/valid.svg";


// Path used to store the best way to move between two specified rooms
var _target_path = "";


// Initializez the main UI of the program
UserInterface.prototype.init = function()
{

	var x, y;
	var html = 
		// Main container for the whole page
		"<div id='div_main_ui'>"+
			// Header div in the top right corner
			//"<input type='text' id='text_path' value='SWSESEESSSSSWWSSSS'></input>"+
			//"<input type='text' id='text_path' value='SWWSSEEEESSSSSENNEESSW'></input>"+
			//"<input type='text' id='text_path' value='SWWSSEENWNWSSEEEESSSSSENNEESSW'></input>"+
			//"<input type='text' id='text_path' value='$ASWSESEESSSSSWWNNWNWWSSSWSEEENNNESSSSSS$A'></input>"+
			//"<textarea id='text_path'>#YSWWSSEEEEN$GSSSS#RSSWWNNWS$PSSWWWNENN#BSSSSWWW$RN$YESSSWN#GENNNW#PWWNEEENEESSW#Y</textarea>"+
			//"<textarea id='text_path'>#YSWWSSEEEEN$GSSSS#RSSWWNNWS$PSSWWWNENN#BSSSSWWW$R\n$RN$YESSSWN#GENNNW#PWWNEEENEESSW#Y</textarea>"+
			//"<textarea id='text_path'>#YSWWSSEEEEN$GSSSS#RSSWWNNWS$PSSWWWNENN#BSSSSWWW$R\n$RN$YENW#P\n#PWWNEEENEESSW#Y</textarea>"+
			//"<textarea id='text_path'>#YNNNE&T\n#YSWWSSEEEEN$GSSSS#RSSWWNNWS$PSSWWWNENN#BSSSSWWW$R\n$RN$YENW#P\n#PWWNEEENEESSW#Y</textarea>"+
			//"<textarea id='text_path'>#YNNNE&T\n$RN$YENW#P\nWNNEEN#YSWWSSEEEEN$GSSSS#RSSWWNNWS$PSSWWWNENN#BSSSSWWW$R\n#PWWNEEENEESSW#Y</textarea>"+
			//"<textarea id='text_path'>#YSSSSWSWW#GWSWS$PESWSWW#G\n$GSEENNEEEEE$PNESSWSWW#G\n#GSEESSSS$RWSEEEEE$P\n$RNNWWNEEEEENESSSWWSE\n$GSEEEE#BS#P\n#PENEEEESENNNNESSWWWSSSS#Y\n#YSSWS$PWWSE$BWNWWWSESE#B\n#BWWWWSSSNNNN$GN#REW#RS$GE$YSS&T</textarea>"+
			"<textarea id='text_path'>S#RSEEEE#GENWW$YSSEN#GSWW$GNNN#BEESSSEEEEEEEN$PWNENWWNNEENNEENE&T\nNNNNWWWWNNNNWWWWNNNNWWWWS#PS&T\nSSSSEEEEEEEN$PSSSSSSE$RWWN&T\nEEEN$T\nE#GWWWWN#REE\n#RNW</textarea>"+


			"<input type='button' id='button_process' value='Process Data'></input>"+
			"<div id='header_div'>"+
				"<table id='le_maze'>"+
				"<tr><td></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td></td></tr>"
				for (y=1; y<=8; y++) 
				{
					html += "<tr><td>"+String.fromCharCode("A".charCodeAt(0)+y-1)+"</td>";
					for (x=1; x<=8; x++) 
					{
						html += "<td id='cell_"+x+"_"+y+"' onclick='tracePath({x:"+x+", y:"+y+"})'>"+
						"<canvas id='canvas_"+x+"_"+y+"' class='room_canvas' width='"+CANVAS_WIDTH+"' height='"+CANVAS_HEIGHT+"'></canvas>"+
						"</td>";
					}
					html += "<td>"+String.fromCharCode("A".charCodeAt(0)+y+(y>4? -5: +3))+"</td></tr>";
				}

				html +="<tr><td></td><td>5</td><td>6</td><td>7</td><td>8</td><td>1</td><td>2</td><td>3</td><td>4</td><td></td></tr>"
			
				"</table>"+
			"</div>"+
		"</div>";
	$('#solver_div').html(html);

	// Capture the mouse scrollwheel for a custom callback function
	$('#main_canvas').bind('mousewheel', null);
	

	// Disable dragging the mouse to select an area
	$(document).on("dragstart", function(event){return false;});

	$(window).on('resize', _ui.resizeWindow);		

	$('#button_process').click( function() { findValidSquares();} );

	findValidSquares();
};


function showInitialTest()
{
	$('#text_path').html("#YSSSSWSWW#G");
	findValidSquares();
}

function showSecondTest()
{
	$('#text_path').html("#YSSSSWSWW#GWSWS$PESWSWW#G\n$GSEENNEEEEE$PNESSWSWW#G");
	findValidSquares();
}

function showSolvedMazeTest()
{
	$('#text_path').html("#YSSSSWSWW#GWSWS$PESWSWW#G\n$GSEENNEEEEE$PNESSWSWW#G\n#GSEESSSS$RWSEEEEE$P\n$RNNWWNEEEEENESSSWWSE\n$GSEEEE#BS#P");
	findValidSquares();
}

function showCompleteMazeTest()
{
	$('#text_path').html("#YSSSSWSWW#GWSWS$PESWSWW#G\n$GSEENNEEEEE$PNESSWSWW#G\n#GSEESSSS$RWSEEEEE$P\n$RNNWWNEEEEENESSSWWSE\n$GSEEEE#BS#P\n#PENEEEESENNNNESSWWWSSSS#Y\n#YSSWS$PWWSE$BWNWWWSESE#B\n#BWWWWSSSNNNN$GN#REW#RS$GE$YSS&T");
	findValidSquares();
}

function showTestPath()
{
	$('#text_path').html("#YSSSSWSWW#GWSWS$PESWSWW#G\n$GSEENNEEEEE$PNESSWSWW#G\n#GSEESSSS$RWSEEEEE$P\n$RNNWWNEEEEENESSSWWSE\n$GSEEEE#BS#P\n#PENEEEESENNNNESSWWWSSSS#Y\n#YSSWS$PWWSE$BWNWWWSESE#B\n#BWWWWSSSNNNN$GN#REW#RS$GE$YSS&T");
	findValidSquares();

	_path_start_position = {x:4, y:6};
	tracePath({x:1, y:7});
}


var _correct_position = null;
var _valid_solutions = 0;

function findValidSquares()
{
	_valid_solutions = 0;

	clearMap();

	// Enable this for debug testing a single starting cell
	var test_single_square = false;
	var single_square = {x:5, y:8};

	// Check is all the paths are valid using each cell as a possible starting position
	for (var x=1; x<=8; x++) 
	{
		for (var y=1; y<=8; y++) 
		{
			{
				// Id debug mode test only 1 single cell
				if (test_single_square) 
				{
					x = single_square.x;
					y = single_square.y;
				}

				var canvas_id = "#canvas_"+x+"_"+y;
				var ctx = $(canvas_id)[0].getContext('2d');
				var current_position = {x:x, y:y};

				// Check if all the paths are compatible with this starting position
				if (testPaths(current_position))
				{
					canvasDrawImage(ctx, image_valid, 0);
					console.log("VALID: "+canvas_id);
					_correct_position = current_position;
					_valid_solutions++;
				}
				else
				{
					canvasClear(ctx);
				}

				if (test_single_square) return;
			}
		}
	}
	console.log("Found "+_valid_solutions+" possible positions");

	// We only found 1 solution, this is it!!!
	if (_valid_solutions == 1)
	{
		testPaths(_correct_position);
		paintMap(_correct_position);
	} 
	// We found no solutions, there must be a problem with the input
	else if (_valid_solutions == 0)
	{
		alert("No solutions could be found... There must be an error in the input data! :(");
	}
}


function canvasPaintBackground(context, color)
{
	context.beginPath();
	context.fillStyle = color;
	context.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, );
	context.fill();
}


function canvasDrawImage(context, image, angle)
{
    // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    context.save();

    // move to the center of the canvas
    context.translate(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);

    // rotate the canvas to the specified degrees
    context.rotate(angle*Math.PI/180);

    // draw the image
    // since the context is rotated, the image will be rotated also
    context.drawImage(image,-CANVAS_WIDTH/2,-CANVAS_HEIGHT/2, CANVAS_WIDTH, CANVAS_HEIGHT);

    // we’re done with the rotating so restore the unrotated context
    context.restore();
}


function canvasClear(context)
{
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}


function clearMap()
{	
	for (var x=0; x<8; x++) 
	{
		for (var y=0; y<8; y++) 
		{
			var canvas_id = "#canvas_"+(x+1)+"_"+(y+1);
			//console.log(canvas_id);

			var ctx = $(canvas_id)[0].getContext('2d');
			canvasClear(ctx);
		}
	}
}


// Paint the whole map with the currently known information
function paintMap(start_position)
{	
	clearMap();

	testPaths(start_position);
	//console.log(_map_room_ids);
	//console.log(_map_room_exits);
	//console.log(_map_room_exits[start_position.x-1][start_position.y-1]);

	for (x=0; x<8; x++) 
	{
		for (y=0; y<8; y++) 
		{
			var canvas_id = "#canvas_"+(x+1)+"_"+(y+1);
			var ctx = $(canvas_id)[0].getContext('2d');

			var id = _map_room_ids[x][y];

			// In the room is known but is not a special room or it's the trap room, paint it gray
			if (id == 'K' || id == '&T') canvasPaintBackground(ctx, '#AAAAAA');

			// Is the room a special room?
			if (id.charAt(0) == '$' || id.charAt(0) == '#' || id.charAt(0) == '&')
			{
				// Paint it in a different color depending on the orb/rune color
				switch(id.charAt(1))
				{
					case 'R': canvasPaintBackground(ctx, '#FF3546'); break;
					case 'G': canvasPaintBackground(ctx, '#2DB534'); break;
					case 'B': canvasPaintBackground(ctx, '#1C7CB2'); break;
					case 'Y': canvasPaintBackground(ctx, '#FFDE4F'); break;
					case 'P': canvasPaintBackground(ctx, '#B200FF'); break;
				}				

				// Draw an image indicating is the coom containg an orb, a rune or a trap
				switch(id.charAt(0))
				{
					case '$': canvasDrawImage(ctx, image_orb, 0); break;
					case '#': canvasDrawImage(ctx, image_rune, 0); break;
					case '&': canvasDrawImage(ctx, image_death, 0); break;
				}				
			}

			// Now we draw all the known exits for the room
			var north = _map_room_exits[x][y].north;
			var south = _map_room_exits[x][y].south;
			var east = _map_room_exits[x][y].east;
			var west = _map_room_exits[x][y].west;


			// Single exit rooms
				 if (  north &&  !south && !east && !west ) canvasDrawImage(ctx, image_1_exit, 0);
			else if ( !north &&   south && !east && !west ) canvasDrawImage(ctx, image_1_exit, 180);
			else if ( !north &&  !south &&  east && !west ) canvasDrawImage(ctx, image_1_exit, 90);
			else if ( !north &&  !south && !east &&  west ) canvasDrawImage(ctx, image_1_exit, 270);

			// Straight lines
			else if (  north &&   south && !east && !west ) canvasDrawImage(ctx, image_2_exit_straight, 0);
			else if ( !north &&  !south &&  east &&  west ) canvasDrawImage(ctx, image_2_exit_straight, 90);

			// Curve rooms
			else if (  north && !south &&  east && !west ) canvasDrawImage(ctx, image_2_exit_turn, 0);
			else if ( !north &&  south &&  east && !west ) canvasDrawImage(ctx, image_2_exit_turn, 90);
			else if ( !north &&  south && !east &&  west ) canvasDrawImage(ctx, image_2_exit_turn, 180);
			else if (  north && !south && !east &&  west ) canvasDrawImage(ctx, image_2_exit_turn, 270);

			// Fork rooms
			else if (  north &&  south &&  east && !west ) canvasDrawImage(ctx, image_3_exit, 0);
			else if ( !north &&  south &&  east &&  west ) canvasDrawImage(ctx, image_3_exit, 90);
			else if (  north &&  south && !east &&  west ) canvasDrawImage(ctx, image_3_exit, 180);
			else if (  north && !south &&  east &&  west ) canvasDrawImage(ctx, image_3_exit, 270);

			// Overlap room
			else if (  north &&  south &&  east &&  west ) canvasDrawImage(ctx, image_4_exit, 0);
		}
	}
}


// Test if all the paths are valid for the specified starting position
function testPaths(start_position)
{
	var maze_data = $('#text_path').val();

	var paths = maze_data.split('\n');

	// Reset all the map information before starting to process a new possible starting position
	var x, y;
	for (x=0; x<8; x++) 
	{
		for (y=0; y<8; y++) 
		{
			_map_room_ids[x][y] = '';
			_map_room_exits[x][y] = {north:false, south:false, east:false, west:false};
		}
	}
	_assigned_ids = [];

	var initial_path = true;
	var retry_counter = 0;
	while (paths.length > 0) 
	{
		next_path = paths.shift().trim();
		console.log("Testing path:"+next_path);
		// Start in the initial position
		var position = { x:start_position.x, y:start_position.y };

		// If we're not in the initial path, we need to calculate the initial position of the path	
		if (!initial_path)
		{			
			position = getInitialRoomPosition(next_path);
		}

		// If we dont't have an initial position, it means we're testing a path starting at
		// an unknown position, so let's put it to the bottom of the list to try again later
		if (position == null)
		{
			paths.push(next_path);
			retry_counter++;

			// Make sure we don't get stuck on a endless loop
			if (retry_counter > 20) return true;
		}
		else
		{
			var next_path_start_id = _map_room_ids[position.x-1][position.y-1] ;
			//console.log(next_path_start_id);

			var result = testSinglePath(position, next_path, next_path_start_id);

			// Is a single path returns an error, then the current startiing position is not valid!
			if (!result) return false;
		}
		initial_path = false;
	}

	// If we tested all the possible paths and none presented any inconsistency, we have a valid start position
	return true;
}


// Returns the coordinates of a specific id
function getRoomPosition(id)
{
	// Now let's see if it appears in the previously known rooms
	for (x=0; x<8; x++) 
	{
		for (y=0; y<8; y++) 
		{
			// We found the matching room!!! Yay!
			if (_map_room_ids[x][y] == id)
			{
				return {x:x+1, y:y+1};
			}
		}
	}
	return null;
}


// Returns the coordinates of the initial position of a given path
function getInitialRoomPosition(path)
{
	var index = 0;
	var backtrack_path = [];
	//console.log(_map_room_ids);
	while (index<path.length)
	{
		var next_char = path.charAt(index++);
		// If the next char is not the beginning of an ID, it must be a movement
		if (next_char != '$' && next_char != '#' && next_char != '&')
		{
			// We save the opposite movement in the backtrach path so we can find the way back
			var reverse;
			if (next_char=='N') reverse = 'S';
			else if (next_char=='S') reverse = 'N';
			else if (next_char=='E') reverse = 'W';
			else if (next_char=='W') reverse = 'E';
			// This only happens if there's an error in the string
			else
			{
				console.err("Error in path string!!!");
				return null;
			}
			backtrack_path.push(reverse);
		}

		// If the char IS the beginning of an id, let's process it
		else
		{
			// Get the complete id for the special square
			var id = next_char+path.charAt(index++);
			
			//console.log("testing id "+id+" at index "+(index-2) )

			// Let's see if it's known...
			var pos = getRoomPosition(id);

			if (pos != null)
			{
				console.log("Found match at index:"+(index-2));

				// If the room is the first room of the path, we just return it's position
				if ( index == 2 )
				{
					return pos;
				}
				// If the room is in the middle of the path, we need to fint the way to the first room
				else
				{
					while (backtrack_path.length>0)
					{
						//console.log("backtracking...");
						pos = moveInDirection(pos, backtrack_path.pop());
					}
					return pos;
				}			
			}

		}

	}
	// We tested and didn't find a match, return null
	return null;
}


// Test if a given path is compatible with all the previously known information known about
// the maze, for a given starting position
function testSinglePath(position, path, start_id)
{
	var current_square_id = null;
	var new_square = true;

	// If the starting id is still black, we've never been is this room before
	if (start_id == '')
	{
		current_square_id = 'K';
		new_square = true;
	}
	else
	{
		current_square_id = start_id;
		new_square = false;
	}

	console.log("Starting at ("+position.x+","+position.y+")");

	var expecting_id = false;

	var index = 0;
	while ( index<path.length )
	{
		//console.log("now at ("+position.x+","+position.y+")");
		var next_char = path.charAt(index);
		index++;
		if (next_char == ' ') continue;

		// Do we have a special square?
		if (next_char == '$' || next_char == '#' || next_char == '&')
		{
			// Create the square ID
			var new_square_id = next_char+path.charAt(index);
			index ++;

			// If does not have an ID yet, let's see if we can add it
			if (current_square_id == 'K')
			{
				// Is the square supposed to be empty?
				if (!new_square)
				{
					console.log("Fail ("+position.x+","+position.y+"): Trying to assign ID to a square that should be empty");
					return false;
				}

				// Was the ID already assigned to another square?
				if (_assigned_ids.includes(new_square_id))
				{
					console.log("Fail ("+position.x+","+position.y+"): Trying to assign ID do a different square!");
					return false;
				}

				// The id is new, let's save it and assign to this square
				_map_room_ids[position.x-1][position.y-1] = new_square_id;
				_assigned_ids.push(new_square_id);
			}
			// The square already has a previous ID...
			else
			{
				// Is it different than what it should be?
				if (current_square_id != new_square_id)
				{
					console.log("Fail ("+position.x+","+position.y+"): ID mismatch, expected '"+current_square_id+"' got '"+new_square_id+"'");
					return false;
				}
			}
			
			expecting_id = false;
		}
		// Do we have a direction?
		else if (next_char == 'N' || next_char == 'S' || next_char == 'E' || next_char == 'W')
		{
			// If we got a direction but were expecting an id, it's a fail
			if (expecting_id)
			{
				console.log("Fail ("+position.x+","+position.y+"): Expecting ID '"+current_square_id+"', got none...");
				return false;
			}

			position = moveInDirection(position, next_char);

			// Get the current square id for the square we are processing
			current_square_id = _map_room_ids[position.x-1][position.y-1];

			// Mark all the squares we pass as known
			if (current_square_id == '')
			{
				_map_room_ids[position.x-1][position.y-1] = 'K';
				current_square_id = 'K';
				new_square = true;
			}
			else
			{
				new_square = false;
			}

			// If we landed on a square with an ID, we need to receive it correctly now
			if (current_square_id != 'K') expecting_id = true;

			//console.log("expecting_id: "+expecting_id);
		}
		// If we got here, it means the input string in wrong... :S
		else
		{
			console.log("Error in input string!!!");
			return false;
		}
	}

	//console.log("Finished at ("+position.x+","+position.y+")");


	// If we found no possible failure points, return true! YAY!
	return true;
}



// Variables used for the step-by-step animation when tracing the best path between two rooms
var _path_timer = null;
var _current_pos = null;
var _current_pos_index = 0;
var _current_step = 0;


var _path_start_position = null;
var _path_end_position = null;



// Calculate and show the shortest path from between any two rooms
function tracePath(position)
{
	// Doesn't work in we don't know the currect starting position for the maze
	if (_correct_position == null)
	{
		console.log("Error: No correct position found!");
		return;
	}


	if (_valid_solutions != 1)
	{
		console.log("Error: The number of valid solutions is not 1!");
		return;		
	}

	// If both rooms were already set we reset them both and start again
	if ( _path_start_position != null && _path_end_position != null )
	{
		_path_start_position = null;
		_path_end_position = null;
	}

	// If we don't hava an initial position, set it up and end for now
	if (_path_start_position == null)
	{
		console.log("Starting position set!");
		_path_start_position = position;
		return;
	}
	// If we already had an initial position, set the one we just received as the final position and calculate the best path
	else
	{
		_path_end_position = position;
	}

	// Re-paint the map so we clear the numbers from any previous paths
	paintMap(_correct_position);

	// Reset the distance for all rooms
	for (x=0; x<8; x++) 
	{
		for (y=0; y<8; y++) 
		{
			_map_room_distance[x][y] = [MAX_DISTANCE, MAX_DISTANCE];
		}
	}

	// Now we set the distance to 0 in the initial room and expand the search to all possible rooms untill we find the target room
	_map_room_distance[_path_start_position.x-1][_path_start_position.y-1] = [0, 0];

	// Starting distance of the expansion
	var distance = 0;	
	// List of rooms to be expanded in the next iteration
	var expand_rooms = [_path_start_position];
	// List of rooms to be expanded in two iterations
	var next_expand_rooms = [];
	while (true)
	{
		// Expand the search path for all the current rooms at he current distance
		for(var i=0; i<expand_rooms.length; i++)
		{
			expandRoom(expand_rooms[i], distance, next_expand_rooms);
		}

		// Now let's see in any of the rooms of the expansion match the desired target room
		for(var i=0; i<next_expand_rooms.length; i++)
		{
			if ( next_expand_rooms[i].x == _path_end_position.x && next_expand_rooms[i].y == _path_end_position.y)
			{
				//console.log("Found it!!!");
				showPath();
				return;
			}
		}

		distance++;
		console.log("-------- distance:"+distance+" --------");
		//console.log(next_expand_rooms);

		expand_rooms = next_expand_rooms;
		next_expand_rooms = [];

		if (distance>MAX_DISTANCE) break;
	}

}


// Try to move from one room to all adjacent room with a known path
// All the rooms that haven't been reached before in this expansion 
// will be added to the expansion rooms for the next iteration
function expandRoom(expand_room, distance, next_expand_rooms)
{
	console.log(expand_room);
	var exits = _map_room_exits[expand_room.x-1][expand_room.y-1];

	// Check if the next room is an overlap room 
	var overlap = exits.north && exits.south && exits.east && exits.west;

	// If it's NOT an overlap room, expand the possible paths to all the possible exits of the room
	if (!overlap)
	{
		console.log("Non-overlapping room");
		if (exits.north) expandRoomInDirection(expand_room, 'N', distance, next_expand_rooms)
		if (exits.south) expandRoomInDirection(expand_room, 'S', distance, next_expand_rooms)
		if (exits.east) expandRoomInDirection(expand_room, 'E', distance, next_expand_rooms)
		if (exits.west) expandRoomInDirection(expand_room, 'W', distance, next_expand_rooms)		
	}
	// If it is an overlap room, we expand only horizontally or vertically
	else
	{
		console.log("Overlapping room!!! DANGER!");

		// For overlapping rooms we need to check if either the vertical or horizontal distances
		// match the current expansion distance, and expand only that direction
		if (_map_room_distance[expand_room.x-1][expand_room.y-1][0] == distance)
		{
			console.log("Expanding vertically");
			expandRoomInDirection(expand_room, 'N', distance, next_expand_rooms);
			expandRoomInDirection(expand_room, 'S', distance, next_expand_rooms);
		}
		if (_map_room_distance[expand_room.x-1][expand_room.y-1][1] == distance)
		{
			console.log("Expanding horizontally");
			expandRoomInDirection(expand_room, 'E', distance, next_expand_rooms);
			expandRoomInDirection(expand_room, 'W', distance, next_expand_rooms);				
		}
	}
}


// Calculate the expansion from a room into a specific direction
function expandRoomInDirection(expand_room, direction, distance, next_expand_rooms)
{
	console.log("expandRoomInDirection:"+direction);

	// Calculate the room coordinate when moving to the next room
	var next_room = moveInDirection(expand_room, direction);

	// Never process paths going through trap rooms
	if (_map_room_ids[next_room.x-1][next_room.y-1] == '&T') return;

	var exits = _map_room_exits[next_room.x-1][next_room.y-1];

	// Check if the next room is an overlap room 
	var overlap = exits.north && exits.south && exits.east && exits.west;

	// Most rooms are not overlap rooms, so the distance is unique and in position 0
	var current_distance = _map_room_distance[next_room.x-1][next_room.y-1][0];

	// If we do have an overlap room, we need to check if the movement is horizontal or vertical
	// Vertical distances (N and S) and in pos [0] and horizontal (E and W) are in pos [1], so if the
	// movement is horizontal we need to change the value
	if (overlap && (direction=='E' || direction=='W'))
	{
		current_distance = _map_room_distance[next_room.x-1][next_room.y-1][1];
	}

	// If this room wasn't reached yet, add it to the expansion list for the next iteration
	if ( current_distance == MAX_DISTANCE)
	{
		next_expand_rooms.push(next_room);

		// If it's not an overlap room or it's a vertical expansion, set the distance at pos [0]
		if (!overlap || direction=='N' || direction=='S') 
		{
			_map_room_distance[next_room.x-1][next_room.y-1][0] = distance+1;
			//drawRoomDistance(next_room, 'N');
		}
		// If it's an overlap room with an horizontal expansion, set the distance at pos [1]
		else
		{
			_map_room_distance[next_room.x-1][next_room.y-1][1] = distance+1;
			//drawRoomDistance(next_room, 'E');
		}
	}
}


// Draw the distance from a specific room to the initial room of the path
function drawRoomDistance(pos, direction)
{
	var canvas_id = "#canvas_"+pos.x+"_"+pos.y;
	var ctx = $(canvas_id)[0].getContext('2d');
	ctx.fillStyle = "white";
	ctx.font = "bold 40px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline="middle"; 

	var vertical_distance = _map_room_distance[pos.x-1][pos.y-1][0];
	var horizontal_distance = _map_room_distance[pos.x-1][pos.y-1][1];

	var exits = _map_room_exits[pos.x-1][pos.y-1];

	// Check if the next room is an overlap room 
	var overlap = exits.north && exits.south && exits.east && exits.west;

	// Overlap rooms have 2 value, for the vertical and horizontal paths
	if (overlap)
	{
		// Draw the value only for the direction we're considering now
		if ( direction=='N' || direction == 'S' ) ctx.fillText( vertical_distance , CANVAS_WIDTH/2, 30);
		if ( direction=='E' || direction == 'W' ) ctx.fillText(  horizontal_distance, 20, CANVAS_HEIGHT/2);
	}
	else
	{
		ctx.fillText( vertical_distance , CANVAS_WIDTH/2, CANVAS_HEIGHT/2);		
	}

}


// Test if we we can move from a specific room in s apecidif direction and reach a room with a specific distance
// from the starting position. We need to take into account the last movent so that if we get into an overlap room
// we know in which direction we were mofing
function tryDirection(room, direction, distance, last_direction)
{
	//console.log(room);
	//console.log("tryDirection:"+direction);

	// Check if the current room is an overlap room 
	var exits = _map_room_exits[room.x-1][room.y-1];

	// Check if the given direction is a valid exit for the current room
	switch(direction)
	{
		case 'N': if (!exits.north) {console.log("can't go north"); return false;}; break;
		case 'S': if (!exits.south) {console.log("can't go south"); return false;}; break;
		case 'E': if (!exits.east) {console.log("can't go east"); return false;}; break;
		case 'W': if (!exits.west) {console.log("can't go west"); return false;}; break;
	}

	// Check if the starting room is an overlap room
	var overlap = exits.north && exits.south && exits.east && exits.west;

	// If we have an overlap room, check we are maintaining the direction of the movement
	if (overlap)
	{
		if ( (last_direction == 'N' || last_direction == 'S') && (direction == 'E' || direction == 'W') )
		{
			console.log("can't go horizontal"); 
			return false;		
		}
		if ( (last_direction == 'E' || last_direction == 'W') && (direction == 'N' || direction == 'S') )
		{
			console.log("can't go vertical"); 
			return false;		
		}

	}

	// The exit is valid, le't try to move...
	var next_room = moveInDirection(room, direction);

	exits = _map_room_exits[next_room.x-1][next_room.y-1];

	// Check if the next room is an overlap room 
	var overlap = exits.north && exits.south && exits.east && exits.west;

	// Get the correct distance depending if it's an overlapping room or not
	var new_distance;
	if (!overlap || direction=='N' || direction=='S')
	{
		new_distance = _map_room_distance[next_room.x-1][next_room.y-1][0];
	}
	else
	{
		new_distance = _map_room_distance[next_room.x-1][next_room.y-1][1];
	}

	//console.log("new_distance :"+new_distance);

	// If the distance is the desired distance, this is a valid path!!!
	if (new_distance == distance)
	{
		room.x = next_room.x;
		room.y = next_room.y;
		//console.log("yay :"+direction);
		return true;
	}
	else 
	{
		//console.log("nay :"+direction);
		return false;
	}
}


// Show the calculated path between two previously chosen rooms
function showPath()
{
	var pos = {x:_path_end_position.x, y:_path_end_position.y};

	// Starting from the desired final position, we need to discover the way back to the initial position
	var distance = _map_room_distance[_path_end_position.x-1][_path_end_position.y-1][0];

	_target_path = "";

	console.log("distance:"+distance);


	var last_direction = ''
	// Keep looking for rooms with distance 1 unit lower each time
	// When we get to the room with distance 0, it's our starting room
	while (distance>0)
	{
			 if (tryDirection(pos, 'N', distance-1, last_direction)) last_direction = 'S';
		else if (tryDirection(pos, 'S', distance-1, last_direction)) last_direction = 'N';
		else if (tryDirection(pos, 'E', distance-1, last_direction)) last_direction = 'W';
		else if (tryDirection(pos, 'W', distance-1, last_direction)) last_direction = 'E';

		_target_path = last_direction + _target_path;
		distance--;
	}

	console.log("_target_path:"+_target_path);

	_current_pos = {x:_path_start_position.x, y:_path_start_position.y};
	_current_pos_index = 0;
	drawRoomDistance(_current_pos, 'N');
	_path_timer = setInterval(takeStep, 200);
}


// Take a step in a specific direction (called on an interval when tracind the best path between two rooms)
function takeStep()
{
	var direction = _target_path.charAt(_current_pos_index);

	//console.log("direction: "+direction);

	_current_pos = moveInDirection(_current_pos, direction);
	//console.log("step ("+_current_pos.x+","+_current_pos.y+")");

	//var cell_id = "#cell_"+_current_pos.x+"_"+_current_pos.y;
	//$(cell_id).html(_current_pos_index);

	_current_pos_index++;
	drawRoomDistance(_current_pos, direction);

	if (_current_pos_index >= _target_path.length) window.clearInterval(_path_timer);
}


// Calculate the coordinate change when warping around the edges
function flipSides(pos)
{
	if (pos < 5) return pos+4; else return pos-4;
}


// Returns the room coordinates resulting in taking a step in a given direction from a starting room
function moveInDirection(initial_position, direction)
{
	// Start in the initial position
	var final_position = { x:initial_position.x, y:initial_position.y } ;

	// Now we move in the desired direction
	switch(direction)
	{
		case 'N': 
			final_position.y--; 
			_map_room_exits[initial_position.x-1][initial_position.y-1].north = true;
		break;
		case 'S': 
			final_position.y++; 
			_map_room_exits[initial_position.x-1][initial_position.y-1].south = true;			
		break;
		case 'E': 
			final_position.x++; 
			_map_room_exits[initial_position.x-1][initial_position.y-1].east = true;
		break;
		case 'W': 
			final_position.x--; 
			_map_room_exits[initial_position.x-1][initial_position.y-1].west = true;
		break;
	}

	// If we went around any on the edges, need to port to the correct side
	if (final_position.y == 0)
	{
		final_position.y = 8;
		final_position.x = flipSides(final_position.x);
	}
	else if (final_position.y == 9)
	{
		final_position.y = 1;
		final_position.x = flipSides(final_position.x);
	}
	if (final_position.x == 0)
	{
		final_position.x = 8;
		final_position.y = flipSides(final_position.y);
	}
	else if (final_position.x == 9)
	{
		final_position.x = 1;
		final_position.y = flipSides(final_position.y);
	}


	// In the final room we activate the passage on the opposite side to the initial room
	switch(direction)
	{
		case 'N': 
			_map_room_exits[final_position.x-1][final_position.y-1].south = true;
		break;
		case 'S': 
			_map_room_exits[final_position.x-1][final_position.y-1].north = true;			
		break;
		case 'E': 
			_map_room_exits[final_position.x-1][final_position.y-1].west = true;
		break;
		case 'W': 
			_map_room_exits[final_position.x-1][final_position.y-1].east = true;
		break;
	}

	//console.log("Moved to ("+final_position.x+","+final_position.y+")");
	//console.log(_map_room_exits[final_position.x-1][final_position.y-1]);

	return final_position;
}
