/*
 * Armanelgtron Solitaire
 * Copyright (C) 2016 Glen Harpring
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

var selector = {};
selector.resetGame = selector.newDeal = function()
{
	scatterCards = true;
	hasWon = false;
};
selector.autoSolve = function(){};

selector.draw = function(event,click)
{
	canvas.ctx.clearRect(0,0,canvas.width,canvas.height);
	canvas.style.cursor = "default";
	
	for(var i=0;i<gameModes.length;++i)
	{
		var miny = (50*i)+66, maxy = miny+50;
		if(event !== undefined && event.clientY >= miny && event.clientY <= maxy)
		{
			if(click)
			{
				gameMode = gameModes[i];
				setTimeout(function(){newGame();draw();},0);
			}
			else canvas.style.cursor = "pointer";
			canvas.ctx.fillStyle = "orange";
		}
		else canvas.ctx.fillStyle = "white";
		canvas.ctx.textAlign = "center";
		canvas.ctx.font = "50px serif";
		canvas.ctx.fillText(gameModes[i].name,width/2,miny);
	}
};

selector.onMouseDown = function()
{
	selector.draw(event);
};

selector.onMouseMove = function()
{
	selector.draw(event);
};

selector.onMouseUp = function()
{
	selector.draw(event,true);
};
