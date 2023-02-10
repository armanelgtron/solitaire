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

function menu(menuid)
{
	if(menuid === undefined)
	{
		var s = document.getElementById("menu");
		switch(s.style.display)
		{
			case "none":
				s.style.display = "block";
				break;
			default:
				s.style.display = "none";
				break;
		}
		return;
	}
	var menus = document.getElementsByClassName("menu");
	for(var i=menus.length-1;i>=0;--i)
	{
		if(menus[i].getAttribute("name") == menuid)
		{
			var menu = menus[i];
			menu.style.display = "block";
		}
		else menus[i].style.display = "none";
	}
}

function disable(e)
{
	e.setAttribute("tabindex",-1);
	e.removeAttribute("href");
	e.style.pointerEvents = "none";
	e.style.filter = "grayscale(100%) contrast(50%)";
	//if(!e.origclick) e.origclick = e.onclick;
	e.onselectstart = e.onmousedown = function(event){if(event.preventDefault)event.preventDefault();return false;}
}
function enable(e)
{
	e.removeAttribute("tabindex");
	e.setAttribute("href","javascript:void(0)");
	e.style.filter = e.style.pointerEvents = "";
	//if(e.origclick) e.onclick = e.origclick;
	e.onselectstart = e.onmousedown = null;
}

function questionDialog(question,callback)
{
	//else...
	if(window.confirm)
	{
		if(confirm(question))
			callback();
	}
	else if(window.prompt)
	{
		var s=prompt(question);
		if(s != null && s.charAt(0).toLowerCase() != 'n')
			callback();
	}
}

function inputDialog(msg,callback)
{
	//else...
	{
		callback(prompt(msg));
	}
}

function errorDialog(msg,callback)
{
	//else...
	{
		alert(msg);
		if(callback) callback();
	}
}

var ui = {};

ui.newGame = function()
{
	questionDialog("Are you sure you want to abandon the current game?",function()
	{
		gameMode = selector;
		gameMode.newDeal();
		draw();
	});
};

ui.newDeal = function()
{
	questionDialog("Are you sure you want a new deal?",function()
	{
		newGame();
		draw();
	});
};

ui.restart = function()
{
	questionDialog("Are you sure you want to reset the current deal game?",function()
	{
		resetGame();
		draw();
	});
};

ui.importDeal = function()
{
	//errorDialog("Broken feature.");
	inputDialog("Input ms/Freecell ID or 52/104 DealID",function(dealid)
	{
		try
		{
			if(!autoGameImport(dealid))
				throw false;
		}
		catch(e)
		{
			if(e === false)
			{
				errorDialog("DealID couldn't be recongized.");
			}
			else
			{
				questionDialog("DealID may be incomplete or broken. Guess?",function()
				{
					try
					{
						autoGameImport(dealid,true);
					}
					catch(e)
					{
						errorDialog("Error: "+e);
					}
				});
			}
		}
	});
	draw();
};
