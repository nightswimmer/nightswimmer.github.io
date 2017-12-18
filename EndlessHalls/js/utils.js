
// ------------------------------ Class inherance ------------------------------
// Modification to the Function prototype to configure default inherance properties
// usage Cow.inheritsFrom(Animal)

Function.prototype.inheritsFrom = function( parentClass )
{ 
    //Normal Inheritance 
    this.prototype = Object.create( parentClass.prototype );
    this.prototype.constructor = this;
};



// Displays a numeris value as a string with 2 decimals
function showValue(value)
{
    return (parseFloat(Math.round(value* 100) / 100).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// Extracts the pixel array from an image
function getImagePixels(image)
{
    //console.log("getImagePixels");
    //console.log(image);

    //console.log(image.width);
    //console.log(image.height);

    // Create a temporary off-screen canvas to draw the mask image
    var aux_canvas = $('<canvas />')[0];
    aux_canvas.width = image.width;
    aux_canvas.height = image.height;

    // Display the mask image on the canvas so we can access the pixels
    var aux_ctx = aux_canvas.getContext('2d');

    aux_ctx.imageSmoothingEnabled = false;

    aux_ctx.canvasDrawImage(image, 0, 0, image.width, image.height);

    return aux_ctx.getImageData(0, 0, image.width, image.height).data;
}


// ------------------------------ Numerical utils ------------------------------

// Genereates a random integer number between a minimum and maximum value
function randomInt (low, high) 
{
    return Math.floor(Math.random() * (high - low + 1) + low);
}


// Pads a string with zeros on the left up to a specified length
function padString (str, length) 
{
    str = str === null ? '' : String(str);
    length = ~~length;
    pad = '';
    padLength = length - str.length;

    while(padLength)
    {
        padLength--;
        pad += '0';
    }

    return pad + str;
}

// Generates a random 32 bit ID
function createId()
{
	return randomInt(0, 4294967296);
}


// Returns a point on the line between initial_point and final_point,
// defined by the state variable 
// ( if state = 0, returns initial_point)
// ( if state = 1, returns final_point)
function movePosition(initial_point, final_point, state)
{
    // Calculate the desired animation coordinates
    return { x: initial_point.x * (1.0-state) + final_point.x * state, 
             y: initial_point.y * (1.0-state) + final_point.y * state };
}


// Returns a copy of a position (x, y) object
function clonePosition(pos)
{
    return { x:pos.x, y:pos.y };
}


// Returns the grid position closest to a given point
function closestGridPosition(x, y, grid_size)
{
    // Adjust the horizontal snap distance

    // Check if we're closer to the left or right vertical grid lines
    var x_adjust = (x % grid_size > grid_size / 2 ? 1 : 0);

    // Adjust to the correct line accordingly
    var grid_x = ( Math.trunc(x / grid_size) + x_adjust ) * grid_size;

    // Adjust the vertical snap distance

    // Check if we're closer to the top or bottom horizontal grid lines
    var y_adjust = (y % grid_size > grid_size / 2 ? 1 : 0);

    // Adjust to the correct line accordingly
    var grid_y = ( Math.trunc(y / grid_size) + y_adjust ) * grid_size;

    // Return the coordinates
    return {x:grid_x, y:grid_y};
}


// ------------------------------ String utils ------------------------------

// Returns a string composed by different elements
// The first parameter in a base string containing special tokens '$'
// Ex: "this is the $ test and this is the $"
// This function replaces all the tokens in the base string by the other parameters
// the function receives after the base string.
// Ex: getComposedString("this is the $ test and this is the $", "first", "second")
// returns "this is the first test and this is the second"
function getComposedString(base)
{
    var tokens = base.split('$');

    var text = "";
    for (var i=0; i<tokens.length; i++)
    {
        text += tokens[i];
        if (arguments.length>i+1) text += arguments[i+1];
    }
    return text;
}


var DATA_CONTEXT_INPUT = 1;
var DATA_CONTEXT_OUTPUT = 2;


// Returns a string representing a data source to be used on a specific context
// This allows he creation of complex sentences that can be combined to describe 
// a complex operation (combining this with the function getComposedString())
// Ex: if the data source is a device, and we use it to supply data, we return 
// "the value read from the Device X", but if we use it to receive data, we return
// "writes to the Device Y".
// Then with getComposedString() these can be combined into something like
// "The node reads the value from the Device X and writes to the Device Y".
function getDataString(data, pos, context)
{
    //console.log("getDataString");
    //console.log(data);

     // Get the data values from the data fields
    var source = data['source_'+pos];
    var value = data['value_'+pos];
    // Make sure we have all we need...
    if (typeof source === 'undefined' || typeof value === 'undefined') return "ERROR";

    // Now we create different string for different data sources
    switch (source)
    {
        // For constants we simply return the value of the constant
        case DATA_SOURCE_TYPE_CONSTANT:
            return value;
        break;

        // For variables we have to return different strings depending on the context
        case DATA_SOURCE_TYPE_VARIABLE:
            switch (context)
            {
                case DATA_CONTEXT_INPUT:
                    return lang['variable_description_input'] + "xpto";
                break;
                case DATA_CONTEXT_OUTPUT:
                    return lang['variable_description_output'] + "otxp";
                break;
            }         
        break;

        // For devices we also return different strings depending on the context
        case DATA_SOURCE_TYPE_DEVICE:
            switch (context)
            {
                case DATA_CONTEXT_INPUT:
                        return lang['device_description_input'] + "xpto";
                break;
                case DATA_CONTEXT_OUTPUT:
                    return lang['device_description_output'] + "otxp";
                break;
            }         
        break;
    }
    return result;
}


// Converts an unsigned 8-bit numerical value to a positive hexadecimal padded value
function padByte(value)
{
    // Parse the value received as a decimal value
    var x = parseInt(value, 10);

    // Convert the final value to hex format
    var str = x.toString(16);
    var pad = "00";
    return pad.substring(0, pad.length - str.length) + str;
}


// Converts a signed 16-bit numerical value to a positive hexadecimal padded value
function padInt(value)
{
    // Parse the value received as a decimal value
    var x = parseInt(value, 10);

    // x = -255

    // If the value is negative, convert it to a positive representation
    if (x<0) x=65535 + x;

    // x = 65280

    // console.log("--------------------------------- "+x);

    // Convert the final value to hex format
    var str = x.toString(16);

    // Add the padding for the desired size
    var pad = "0000";
    return pad.substring(0, pad.length - str.length) + str;
}


// Converts a signed 32-bit numerical value to a positive hexadecimal padded value
function padLong(value)
{
    // Parse the value received as a decimal value
    var x = parseInt(value, 10);

    // If the value is negative, convert it to a positive representation
    if (x<0) x=4294967295 + x;

    //if (x<0) x=2000000000 + x;

    // Convert the final value to hex format
    var str = x.toString(16);

    // Add the padding for the desired size
    var pad = "00000000";
    return pad.substring(0, pad.length - str.length) + str;
}

function packSourceDataHex(data, pos)
{
    console.log("packSourceDataHex");
    console.log(data);

    var source = data['source_'+pos];
    if (typeof source === 'undefined') return "ERROR";

    var value = data['value_'+pos];

    var result = "";

    switch (source)
    {
        case DATA_SOURCE_TYPE_CONSTANT:
            result += packConstDataHex(value);
        break;

        case DATA_SOURCE_TYPE_VARIABLE:
            result += padByte( DATA_SOURCE_TYPE_VARIABLE << 6 ) + 
                padByte( _variable_manager.getVariableNumberById ( value ) );
        break;

        case DATA_SOURCE_TYPE_DEVICE:
            result += padByte( DATA_SOURCE_TYPE_DEVICE << 6 ) +
                padByte( _device_manager.getDeviceNumberById ( value ) );
        break;
    }
    return result;
}


// Packs a constant value into a binary array represented by a hexadecimal string
// The first byte of the array indicates the source and type of the data, and
// also the data value if the type is binary. Other data types require different
// amounts of byter after the first one
// 
// |  b7  |  b6  |  b5  |  b4  |  b3  |  b2  |  b2  |  b0  |
// | source type |      data type     |             |  bit | ...... other data

function packConstDataHex(value)
{
    // First we need to analyze the value and calculate the smallest data
    // type that can hold it

    // Let's start by assuming it's a long (the biggest variable possible)
    var data_type = VARIABLE_TYPE_LONG;

    // If it fits in an int, shrink it!
    if (value>=-32768 && value<=32767) data_type = VARIABLE_TYPE_INT;

    // If it fits in a byte, shrink it!
    if (value>=0 && value<=255) data_type = VARIABLE_TYPE_BYTE;

    // If it fits in a bit, shrink it!
    if (value>=0 && value<=1) data_type = VARIABLE_TYPE_BOOL;

    // Add the bits to the header identifying the data source and data type
    var header = 
        (DATA_SOURCE_TYPE_CONSTANT << 6) |
        (data_type << 3);

    switch(data_type)
    {
        case VARIABLE_TYPE_BOOL:
            header |= value; 
            return padByte(header);
        break;
        case VARIABLE_TYPE_BYTE:
            return padByte(header) + padByte(value);
        break;
        case VARIABLE_TYPE_INT:
            return padByte(header) + padInt(value);
        break;
        case VARIABLE_TYPE_LONG:
            return padByte(header) + padLong(value);
        break;
    }
    return "ERROR";
}


// Searches for an HTML dom element attribute recursively up the DOM
function getHtmlAttr(event, name)
{
    var elem = event.target;
    // Get the device number from the HTML <tr>

    console.log('getHtmlAttr:' + name);
    console.log(event);
    console.log(elem);

    // @ todo improve this loop
    while (true)
    {
        var result = elem.getAttribute(name) ;
        if (result !== null) return result;
        elem = elem.parentNode;
    }
    return null;
}

// ------------------------------ HTML utils ------------------------------

// Animate a div so it expands to the full height of its contents
function expandDiv(div, time)
{
    var height = $('#'+div).height();
    //console.log('height:'+);

    $('#'+div).stop().
              css({height:0, display:'block'}).
              animate( {height:height}, time, function() { $('#'+div).css({height:'auto'}); } );
}


// Animate a div so it shrinks it's height to 0
function collapseDiv(div, time)
{
    var height = $('#'+div).height();
    //console.log('height:'+);

    $('#'+div).stop().
              animate( {height:0}, time, function() { $('#'+div).css({height:height, display:'none'}); } );
}


// Animate a div so it fades in from full transparency to full opacity
function fadeInDiv(div, time)
{
    var height = $('#'+div).height();
    //console.log('height:'+);

    $('#'+div).stop().
              css( {opacity:0.0, display:'block'}).
              animate( {opacity:1.0}, time );
}


// Animate a div so it fades out from full opacity to full transparency
function fadeOutDiv(div, time)
{
    var height = $('#'+div).height();
    //console.log('height:'+);

    $('#'+div).stop().
              animate( {opacity:0.0}, time, function() { $('#'+div).css({display:'none'}); } );
}


// Generates the HTML for a <select> object, with options that are specified in an array
// id and class_id are the values for the 'id' and 'class' attributes of the <select>
// options is the array with the desired options
// we can also optionally specify the default selected option
// Ex of usage:
// createHtmlSelector('my_selector', 'color_selector', 
//      [{value:0, "Red"}, {value:1, "Green"}, {value:2, "Blue"}], 2);

function createHtmlSelector(id, class_id, options, current)
{
    var html = "<select id='"+id+"'";

    if (class_id) html += " class='"+class_id+"'";
    
    html += ">";

    for (i = 0; i < options.length; i++) 
    {
        var selected = (options[i].value == current) ? " selected='true'": "";
        html += "<option value='"+options[i].value+"'"+selected+">" + options[i].name + "</option>";
    }
    html += "</select>";

    //console.log(html);
    return html;
}


// Similar to createHtmlSelector, but the 'name' attribute in the 'options' vector is expected 
// to have a string id from the language translations file, instead of  a fixed text
function createHtmlSelectorTranslated(id, class_id, options, current)
{
    var html = "<select ";

    if (id) html +="id='"+id+"' ";
    if (class_id) html += "class='"+class_id+"'";
    html += ">";

    for (i = 0; i < options.length; i++) 
    {
        var selected = (options[i].value == current) ? " selected='true'": "";
        html += "<option value='"+options[i].value+"'"+selected+">" + lang[options[i].name] + "</option>";
    }
    html += "</select>";

    //console.log(html);
    return html;
}


var DIV_SLIDE_TIME = 500;

// Shows or hides a section (div) of the page when a toggle button is clicked,
// and also changes the toggle button image depending 
// The ids between the headers and divs must be consistent:
// ex: img_toggle_properties -> div_data_properties
// in this View Example img_header_XXXXX is linked to div_data_XXXXX
function toggleSectionVisibility(event)
{
    // Calculate the id of the div from the id of the header
    var id = event.target.id;
    var name = "div_data_" + id.replace("img_toggle_", "");

    // If the matching div is currently visible, hide it
    if ($('#'+name).is(":visible"))
    {
        $('#'+id).attr("src", "images/menus/button_section_expand.svg");
        collapseDiv(name, DIV_SLIDE_TIME);
    }
    // ... otherwise it's not visible, so let's show it
    else
    {
        $('#'+id).attr("src", "images/menus/button_section_collapse.svg");
        expandDiv(name, DIV_SLIDE_TIME);
    }
}


function createHtmlSelectorsDataSource(id, source, value)
{
    //console.log("createHtmlSelectorsDataSource: "+id+", "+source+", "+value);

    // Only show data sources depending on the configuration on the root node:
    // Constant values are always possible
    var data_types = [ {value:0, name:lang['constant']} ];

    // Only show variables as an option if there is at least one variable to select
    if (_variable_manager.variables.length > 0 ) data_types.push( {value:1, name:lang['variable']} );

    // Only show devices as an option if there is at least one device to select
    if (_device_manager.devices.length > 0 ) data_types.push( {value:2, name:lang['device']} );

    var html = "<div id='div_data_selector_"+id+"'>";

    // Selector for the data source
    html += createHtmlSelector(id+"_source", 'selector_data_source', data_types, source);

    html += "<br>"; 

    html += "<div id='div_value_"+id+"'>";

    html += createHtmlSelectorsDataValue(id, source, value);

    html += "</div>";

    //console.log(html);
    return html;
}


function createHtmlSelectorsDataValue(id, source, value)
{
    //console.log("createHtmlSelectorsDataValue: "+id+", "+source+", "+value);

    html = "";
    // Depending on the data source, let's display the necessary extra selectors
    switch(source)
    {
        case DATA_SOURCE_TYPE_CONSTANT:
            html += "<input type='number' id='"+id+"_value' class='selector_data_value' min='-2147483648' max='2147483647' value='"+(value?value:0)+"'></input>";
        break;

        case DATA_SOURCE_TYPE_VARIABLE:
            html += _variable_manager.getVariableSelector(id+'_value', null, value, 'selector_data_value');
        break;

        case DATA_SOURCE_TYPE_DEVICE:

            html += _device_manager.getDeviceSelector(id+'_value', null, value, 'selector_data_value');
        break;
    }

    //console.log(html);
    return html;
}


// Draws a Data Source (Constant, Variable, Device) value in a specific position of the screen
// size is the  
function drawDataSource(ctx, size, pos_x, pos_y, source, value, align, custom_font_color, custom_background_color)
{
    var font_color = (custom_font_color ? custom_font_color : NODE_DESCRIPTION_TEXT_COLOR );
    var background_color = (custom_background_color ? custom_background_color : NODE_DESCRIPTION_BACKGROUND_COLOR );


    var pos_x_fixed = pos_x;

    // Depending on the data source, let's display different content
    switch(source)
    {
        case DATA_SOURCE_TYPE_CONSTANT:
            //console.log("constant!");
            drawTextBox( ctx, value, 14, align, pos_x, pos_y, font_color, background_color);
        break;

        case DATA_SOURCE_TYPE_VARIABLE:
            //console.log("variable!");

            var name = _variable_manager.getVariableNameById(value);
            drawTextBox( ctx, name, 14, align, pos_x, pos_y, font_color, background_color);

        break;

        case DATA_SOURCE_TYPE_DEVICE:
            //console.log("device!");

            var image_size = size*1.4;

            switch (align)
            {
                case DATA_ALIGN_LEFT: pos_x_fixed -= image_size/2; break;
                case DATA_ALIGN_RIGHT: pos_x_fixed += image_size/2; break;
            }
            //console.log(value);

            var image = _device_manager.getDeviceImage(value);
            drawSquareImage( ctx, image, pos_x_fixed, pos_y, image_size);
        
        break;
    }

}


// Parse the input values from the data selector elements and data value fields
// When a data source selector is changed, the matching data selector value field
// is also changed to match the posisbe options on the source types
// Ex: if the data source is a device, the data value is a list of existing devices
function parseInputValues(node_data)
{
    console.log("parseInputValues");

    var data_source;
    var data_value;

    var pos = 1;
    while(true)
    {
        if (pos > 10) break;

        data_source = parseInt( $('#data_'+pos+'_source').val() );
        console.log('#data_'+pos+'_source');

        // Do we have a data source selector for the current element?
        if ( !isNaN(data_source) )
        {
            console.log("Data source in da house:"+pos);

            // Is the data source different from what it was last time?
            if (data_source !== node_data['source_'+pos])
            {
                console.log("Data source CHANGED!!!!!!! ");

                // Since the data source changed, we need to update the selector for the values
                var data_id = 'data_'+pos;
                html = createHtmlSelectorsDataValue(data_id, data_source, null);
                console.log("div:#div_value_"+data_id);
                $('#div_value_'+data_id).html(html);
            }

            // Save the new values to the node data fields
            node_data['source_'+pos] = (data_source ? data_source : 0);
        }
        // If we don't have a data type selector, then the value is a constant by default
        else
        {
            //console.log("constant");
            node_data['source_'+pos] = DATA_SOURCE_TYPE_CONSTANT;
        }

        // The data_value MUST be extracted after we update the selector, since the values will change
        data_value = parseInt( $('#data_'+pos+'_value').val() );

        // If the data value is valid, we save the vakue to the node data field
        if ( !isNaN(data_value) )
        {
            node_data['value_'+pos] = (data_value ? data_value : 0);
        }
        // If it's not... BREAK IT!
        else break;

        console.log("-------------> "+pos+ "  data_source:"+data_source+"  data_value:"+data_value);
        pos++;
    }
    //console.log("------------- DONE!" );
    //console.log(node_data);
}


function getDataSource(data, position)
{
    return { source: data['source_'+position], value: data['value_'+position] };
}


function setDataSource(data, position, element)
{
    if (!element) return;
    data['source_'+position] = element.source;
    data['value_'+position] = element.value;
}


// Create a HTML slector specifically for the High/Low values
function createHtmlSelectorHighLow(id, current)
{
    return createHtmlSelector(id, 'selector_high_low', [{value:0, name:lang['Low']}, {value:1, name:lang['High']}], current);
}


function createHtmlSelectorPins(id, pin_list, current)
{
    //console.log('createSelectorPins');
    //console.log(pin_list);
    var list = [];
    for (var p=0; p<pin_list.length; p++)
    {
        list.push({value:pin_list[p], name:pin_list[p]});
    }    
    //console.log(list);

    return createHtmlSelector(id, 'selector_pins', list, current);
}


function createHtmlInputNumber(id, value)
{
    return "<input type='number' id='"+ id +"' class='small_number selector_data_value' "+
                "min='-2147483648' max='2147483647' value='"+ value +"'></input>";
}


// Fills a linear meter (canvas) up to a certain value
// The value must be a normalized number [0, 1]
function fillLinearMeter( id, value, color)
{
    //console.log("fillLinearMeter:"+value);
    // Get the canvas and the matching context
    var canvas = $('#'+id)[0];
    var context = canvas.getContext("2d");

    if (value > 1.0) value = 1.0;
    // Make the dimension of the canvas area equal to the css dimension
    var width = $('#'+id).width();
    var height = $('#'+id).height();
    $('#'+id).attr('width', width);
    $('#'+id).attr('height', height);

    // Clear the canvas area
    context.clearRect(0, 0, width, height);

    // If the value is positive, adjust it to the canvas dimensions
    if (value>0)
    {
        context.fillStyle = ( color? color: "#00A3D9" );
        context.fillRect(3, 3, (width-6)*value, height-6);
        context.stroke();
    }
}


// calculate the distance between two points
function distanceBetweenPoints(x1, y1, x2, y2) 
{
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}


// Square of a number
function sqr(x) { return x * x; }
// Square of the distance between two points
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y); }
// Distance between a point p and a line segment(defined by two points v and w)
function distToSegment(p, v, w) 
{

    var l2 = dist2(v, w);
    if (l2 === 0) return Math.sqrt(dist2(p, v));
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    if (t < 0) return Math.sqrt(dist2(p, v));
    if (t > 1) return Math.sqrt(dist2(p, w));
    return Math.sqrt(dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) }));
}


//
// canvas drawing functions
//

// Draws a red cross centeres in a specific canvas position
function drawCross(ctx, x, y, size, color)
{
    ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = (color? color: '#FF0000');

        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x + size, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x, y + size);
        ctx.stroke();

    ctx.restore();
}

function addCanvasShadow(ctx, color, blur, offset_x, offset_y)
{
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = offset_x; 
    ctx.shadowOffsetY = offset_y;      
}


function drawCircle(ctx, thisx, thisy, radius, stroke_style, line_width) 
{
    if (stroke_style) ctx.strokeStyle = stroke_style;
    if (line_width) ctx.lineWidth = line_width;

    ctx.beginPath();
    ctx.arc( thisx, thisy, radius, 0, Math.PI*2, true );
    ctx.stroke();
    ctx.closePath();
}

function drawBall(ctx, thisx, thisy, radius, fill_style) 
{
    if (fill_style) ctx.fillStyle = fill_style;

    ctx.beginPath();
    ctx.arc( thisx, thisy, radius, 0, Math.PI*2, true );
    ctx.fill();
    ctx.closePath();
}


function drawText( ctx, text, thisx, thisy, fill_style, font_size ) 
{
    if (fill_style) ctx.fillStyle=fill_style;

    ctx.font= ((font_size? font_size: 14)*_ui.zoom)+"px arial";
    
    // textBaseline aligns text vertically relative to font style
    ctx.textBaseline="top";
    // textAlign aligns text horizontally relative to placement
    ctx.textAlign = 'left';
 
    ctx.fillText(text, thisx, thisy);
}

function drawSquareImage( ctx, image, center_x, center_y, size ) 
{

    var offset = size/2;
    ctx.canvasDrawImage(image, center_x-offset , center_y-offset, size, size);
}


function drawRotatedImage(ctx, image, x, y, width, height, degrees)
{
    // first save the untranslated/unrotated context
    ctx.save();

    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate( x+width/2, y+height/2 );
    // rotate the rect
    ctx.rotate(degrees*Math.PI/180);

    // draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    //       so the rect needs to be offset accordingly when drawn
    ctx.rect( -width/2, -height/2, width,height);

    ctx.canvasDrawImage(image, -width/2, -height/2, width, height);

    // restore the context to its untranslated/unrotated state
    ctx.restore();
}


var DATA_ALIGN_LEFT = 1;
var DATA_ALIGN_CENTER = 2;
var DATA_ALIGN_RIGHT = 3;

function drawTextBox( ctx, text, text_font_size, align, thisx, thisy, custom_font_color, custom_background_color ) 
{
    var font_color = (custom_font_color ? custom_font_color : NODE_DESCRIPTION_TEXT_COLOR );
    var background_color = (custom_background_color ? custom_background_color : NODE_DESCRIPTION_BACKGROUND_COLOR );

    var final_text_font = text_font_size * _ui.zoom;
    var margin = final_text_font * 0.4;

    ctx.font = final_text_font+"px arial";
    var width = ctx.measureText( text ).width + 10 * _ui.zoom;

    //console.log(width);

    var xpos;
    switch (align)
    {
        case DATA_ALIGN_LEFT: xpos = thisx - width; break;
        case DATA_ALIGN_CENTER: xpos = thisx - width/2; break;
        case DATA_ALIGN_RIGHT: xpos = thisx; break;
    }

    ctx.fillStyle = background_color;
    roundRect(ctx, xpos, thisy - (final_text_font/2 + margin), width, final_text_font+margin*2, 5* _ui.zoom);

    ctx.fillStyle=font_color;
    ctx.textBaseline="middle";
    ctx.fillText(text, xpos+5*_ui.zoom, thisy);

    return width;
}


// Draws a rectangle with rounded edges on the canvas
function roundRect(ctx, x, y, width, height, radius, fill) 
{
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}


// requestAnimationFrame polyfill by @rma4ok
!function (window) 
{
    var
    equestAnimationFrame = 'equestAnimationFrame',
    requestAnimationFrame = 'r' + equestAnimationFrame,
     
    ancelAnimationFrame = 'ancelAnimationFrame',
    cancelAnimationFrame = 'c' + ancelAnimationFrame,
     
    expectedTime = 0,
    vendors = ['moz', 'ms', 'o', 'webkit'],
    vendor;
     
    while (!window[requestAnimationFrame] && (vendor = vendors.pop())) 
    {
        window[requestAnimationFrame] = window[vendor + 'R' + equestAnimationFrame];
        window[cancelAnimationFrame] =
        window[vendor + 'C' + ancelAnimationFrame] ||
        window[vendor + 'CancelR' + equestAnimationFrame];
    }
     
    if (!window[requestAnimationFrame]) 
    {
        window[requestAnimationFrame] = function (callback) 
        {
            var
                currentTime = +new Date,
                adjustedDelay = 16 - (currentTime - expectedTime),
                delay = adjustedDelay > 0 ? adjustedDelay : 0;
                 
                expectedTime = currentTime + delay;
             
            return setTimeout(function () 
            {
                callback(expectedTime);
            }, delay);
        };
     
        window[cancelAnimationFrame] = clearTimeout;
    }
}(this);


// ------------------------------ Timing utilities ------------------------------

// Returns the curret date with milliseconds precision
function millis()
{
    return new Date().getTime();
};

var start_timer_millis = 0;

function startTimer()
{
    start_timer_millis = millis();
}

function checkTimer()
{
    var now = millis();
    console.log("Time elapsed:"+(now-start_timer_millis)+" millis");
}

