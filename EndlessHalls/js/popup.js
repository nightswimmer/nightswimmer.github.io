
var ANIMATION_TIME_DIV_CHANGE = 500;

var ANIMATION_TIME_POPUP_CHANGE = 200;

var POPUP_ARROW_SIZE = 50;

// Opens a pop-up warning message in the center of the screen, 
// that closes when the screen is clicked
var popup_opening = true;
function openPopUpMessage(message)
{		
	block_popup = true;

	console.log('---------------------------popUp:'+message);
	var center_x = $(window).scrollLeft() + $(window).width()/2;
	var center_y = $(window).scrollTop() + $(window).height()/2;

	$('#popup_message_content').html(message);
	$('#popup_message_content').stop().css('opacity', '0.0');

	$('#popup_message_div').css({display:'block', left:center_x, top:center_y, width:'auto', height:'auto'});
	
	var width = $('#popup_message_content').outerWidth() + 10;
	var height = $('#popup_message_content').outerHeight();

	$('#popup_message_div').css({width:0, height:0}).
		stop().
		animate({width:width, height:height, left:center_x-width/2, top:center_y-height/2}, ANIMATION_TIME_DIV_CHANGE,
			function()
			{
				$('#popup_message_content').animate({opacity: 1.0}, ANIMATION_TIME_DIV_CHANGE,
					function()
					{		
						// Callback to close the warning tooltip when it's clicked
						$(document).on('click', closePopUpMessage);
						block_popup = false;
					});
			}
		);

	//alert("YOINK!");
}


// If we have a form in the pop-up box, we can block it so it won't close as soon as it's clicked
var block_popup = false;
function closePopUpMessage()
{
	// Won't close the popup if it's blocked
	if ( block_popup ) return;
	$('#popup_message_content').animate({opacity:0.0}, ANIMATION_TIME_DIV_CHANGE,
		function() 
		{
			// Cancel closing the popup if a new message is being opened
			$('#popup_message_content').html('');
			var center_x = $(window).scrollLeft() + $(window).width()/2;
			var center_y = $(window).scrollTop() + $(window).height()/2;
			$('#popup_message_div').animate({width:0, height:0, left:center_x, top:center_y}, ANIMATION_TIME_DIV_CHANGE,
				function()
				{
					$('#popup_message_div').css({display:'none'});
					//´Remove the callback to close the warning tooltip when it's clicked
					$(document).off('click', closePopUpMessage);
				});
		});
}



// Opens a pop-up arrow on the screen, pointing to a specific DOM element, 
// We pass the target element (id) and direction of the arrow (in degrees)
function openPopUpArrow(target, direction)
{		
	block_popup = true;

	console.log('---------------------------popUpArrow:'+target);
	var element =  $('#'+target)[0];
	var target_center_x = $(element).offset().left + $(element).width()/2 - POPUP_ARROW_SIZE/2;
	var target_center_y = $(element).offset().top + $(element).height();


	console.log('target_center_x:'+target_center_x+'   target_center_y:'+target_center_y);

	$('#img_popup_arrow').stop().css({opacity: 0.0, display:'block', 
			width:POPUP_ARROW_SIZE, height:POPUP_ARROW_SIZE, left:target_center_x, top:target_center_y}).
		animate({opacity:1.0}, ANIMATION_TIME_DIV_CHANGE, function()
			{
				block_popup = false;
			});

	$(document).on('click', closePopUpArrow);
}


function closePopUpArrow()
{
	// Won't close the popup if it's blocked
	if ( block_popup ) return;
	$('#img_popup_arrow').animate({opacity:0.0}, ANIMATION_TIME_DIV_CHANGE,
		function() 
		{
			$('#img_popup_arrow').css({display:'none'});
			$(document).off('click', closePopUpArrow);

		});
}

