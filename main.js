/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var maxX;
var maxY;
var x;
var y;
var plateauRow;
var plateauColumn;
var direction;
var movePosition;
var commands;
var index;
var rotation;
var desiredFacing;

function DisplayPlateau()
{
    var table = "<table border = '1' width = 50%>";
    for(var i = 1; i <= plateauRow; ++i)
    {
        table = table + "<tr>";
        for(var j = 1; j <= plateauColumn; ++j)
        {
            table = table + "<td>(" + i + "," + j +")</td>";
        }
        table = table + "</tr>";
    }
    table = table + "</table>";
}

function checkInput()
{
    var checkDirection = $('#roverDirection').val().toUpperCase();
    if(checkDirection.length === 1)
    {
        if(checkDirection === 'N'||checkDirection === 'E'||checkDirection === 'S'||checkDirection === 'W')
        {
            commands = $('#commandLine').val().toUpperCase();
        
            var isValid = true;
            for(var i = 0; i<commands.length;++i)
            {
                if(commands[i] !== 'L' && commands[i] !== 'R' && commands[i] !== 'M')
                {
                    isValid = false;
                }
                return isValid;
            }
        }
        else 
        {
            return false;
        }
    }
    else 
    {
        return false;
    }
}

function checkLeft()
{
    switch(direction)
    {
        case 'N':
            direction = 'W';
            break;
        case 'W':
            direction = 'S';
            break;
        case 'S':
            direction = 'E';
            break;
        case 'E':
            direction = 'N';
            break;
    }
    $('#currentFacing').val(direction);
}

function checkRight()
{
    switch(direction)
    {
        case 'N':
            direction = 'E';
            break;
        case 'E':
            direction = 'S';
            break;
        case 'S':
            direction = 'W';
            break;
        case 'W':
            direction = 'N';
            break;
    }
    $('#currentFacing').val(direction);
}

function move()
{
    var canMove;
    switch(direction)
    {
        case 'N':
            y++;
            if(y>plateauColumn)
                canMove = true;
            else
                canMove = false;
            break;
        case 'S':
            y--;
            if(y<=0)
                canMove = true;
            else
                canMove = false;
            break;
        case 'E':
            x++;
            if(x>plateauRow)
                canMove = true;
            else
                canMove = false;
            break;
        case 'W':
            x--;
            if(x<=0)
                canMove = true;
            else
                canMove = false;
            break;
    }
    
    if(canMove)
    {
        showError("Moving",false);
    }
    else
        showError("Cannot move off the plateau!",true);
return canMove;
}

function startMoving()
{
    var completed = true;
    var length = commands.length;
    index = 0;
    
    hasMoved = function()
    {
        switch(commands[index])
        {
            case 'L':
                rotation -= 90;
                showError("Turn Left",false);
                moveLeft();
                checkLeft();
                setTimeout(function(){index++;check();},2000);
                break;
            case 'R':
                rotation += 90;
                showError("Turn Right",false);
                moveRight();
                checkRight();
                setTimeout(function(){index++;check();},2000);
                break;
            case 'M':
                if(moveForward())
                {
                    index = length;
                    completed = false;
                }
                setTimeout(function(){index++;check();},2000);
                break;
        }
        function check()
        {
            index < length ? hasMoved():(completed === true?showError("Completed",false):$('#notice').append("<b> -- End Program </b>"));
        }
    };
    hasMoved();
    
}

function getPlayerImage(direction) 
{
    switch (direction) 
    {
        case 'S':
            return 'v';
	case 'W':
		return '<';
	case 'E':
		return '>';
	case 'N':
		return '^';
    }
}

function initiatePosition()
{
    showError("Initiate Position",false);
	direction='';
	direction=$('#direction').val().toUpperCase();
	$('#'+y.toString()+x.toString()).html('<img src="img/arrow-min.png" id="img"/>');
	switch(direction)
	{
		case 'N': 
		     rotation=0;
			 startMovement();
			 break;
		case 'E':
		     rotation=0;
			 desiredFacing=rotation+90;
			 moveRight();
			 setTimeout(function(){startMovement();},1800);
			 break;
	    	case 'W':
		     rotation=0;
			 desiredFacing=rotation-90;
			 moveLeft();
			 setTimeout(function(){startMovement();},1800);
			 break;
		 case 'S':
		     rotation=0;
			 desiredFacing=rotation-180;
			 moveLeft();
			 setTimeout(function(){startMovement();},4000);
			 break;	 
	}
	
}

function moveRight()
{
   if(rotation===360) 
   {
       rotation=0;
       desiredFacing=rotation+90;
   }
   move=function()
   {
       rotation += 10;
       getPlayerImage('E');
       if(rotation<desiredFacing)
           setTimeout(move,100);
   };
   move();
}

function moveLeft()
{
   if(rotation===360) 
   {
       rotation=0;
       desiredFacing=rotation-90;
   }
   move=function()
   {
       rotation -= 10;
       getPlayerImage('W');
       if(rotation<desiredFacing)
           setTimeout(move,100);
   };
   move();
}

function resetInputs()
{
    $('#x').val('');
    $('#y').val('');
    $('#commandLine').val('');
    $('#direction').val('');
    $('#x').prop('disabled', false); 
    $('#y').prop('disabled', false); 
    $('#commandLine').prop('disabled', false);
    $('#direction').prop('disabled', false); 
    $('#start').prop('disabled', false);
    $('#notice').hide();
    $('#notice').html("");
    $('#content').html("");
    commands='';
}

function showError(message,timeout)
{
    if(timeout)
    {
        $('#notice').toggleClass("alert-info",false);
        $('#notice').toggleClass("alert-error",true);
        $('#notice').show();
	$('#notice').html("<b>"+message+"</b>");
    }
    else
    {
        $('#notice').toggleClass("alert-error",false);
        $('#notice').toggleClass("alert-info",true);
	$('#notice').show();
	$('#notice').html("<b>"+message+"</b>");   
    }
}

function PageControls()
{
    $('#build'.onclick(function()
    {
     if($.isNumeric($('#gridX').val()) && $.isNumeric($('#gridY').val()))
    {
	gridX=0;
        gridY=0;
        gridX=parseInt($('#gridX').val());
        gridY=parseInt($('#gridY').val());
        if((gridX<0 ||gridX>maxX)||(gridY<0 || gridY>maxY)) showError("Input Out of Bound. ",true);
        else
        {
	    $('#gridX').prop('disabled', true); 
            $('#gridY').prop('disabled', true);
            $('#build').prop('disabled', true);
	    $('#input').show();
	    initializeMatrix();
	    $('#notice').hide();
	    $('#notice').html("");
	    }
    }
    else showError("Non-Numeric Input Not Allowed. ",true);

 }));
 
 $('#resetDisplay').onclick(function(){resetDisplay();});

function resetDisplay()
 {
    maxX=30;
    maxY=14;
    plateauRow=0;
    plateauColumn=0;
    x=0;
    y=0;
    commands='';
    direction='';
    rotation=0;
    desiredFacing=0;
    index=0;
    $('#gridX').val('');
    $('#gridY').val('');
    //$('#degree').val('');
    //$('#target').val('');
    $('#gridX').prop('disabled', false); 
    $('#gridY').prop('disabled', false); 
    $('#build').prop('disabled', false);
    $('#input').hide();
    $('#notice').hide();
    $('#notice').html("");
    $('#content').html("");
    clearInput();                     
  }	

$( document ).ready(function() {
gridReset();});
			   
$('#start').onclick(function()
{
    if($.isNumeric($('#x').val()) && $.isNumeric($('#y').val()) && checkInput())
    {
		x=0;
        y=0;
        x=parseInt($('#x').val());
        y=parseInt($('#y').val());
        if((x<0 ||x>gridX)||(y<0 || y>gridY)) showError("Input Out of Bound.",true);
        else
        {
            $('#x').prop('disabled', true); 
            $('#y').prop('disabled', true);
	    	$('#start').prop('disabled', true);
            $('#direction').prop('disabled', true); 
            $('#command').prop('disabled', true);
            initiatePosition();
        }
    }
    else showError("Invalid Input ",true);                       
});

$('#reset').click(function(){clearInput();initializeMatrix();});
}