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

function unnearWhole(x)
{
	return (x>0?Math.ceil:Math.floor)(x);
}

function resize(event)
{
	var body = document.body, html = document.documentElement;
	width = Math.max(/*body.scrollWidth,*/body.offsetWidth,html.clientWidth,html.scrollWidth,html.offsetWidth);
	height= Math.max(/*body.scrollHeight,*/body.offsetHeight,html.clientHeight,html.scrollHeight,html.offsetHeight);
	size = (width+height)/2;
	welcome.style.width = welcome.style.height = (size/2)+"px";
	welcome.style.marginTop = welcome.style.marginLeft = (-size/4)+"px";
	if(typeof(canvas) !== "undefined")
	{
		var data = canvas.ctx.getImageData(0,0,width,height);
		canvas.width=width;canvas.height=height;
		canvas.ctx.putImageData(data,0,0);
		setTimeout(draw,0);
	}
}
function getVarFromString(string) //! Find variable parameters from string
{
	var splice = string.split(".");
	var variable = window;//, var2 = commands;
	for(var y=0;y<splice.length-1;y++)
	{
		try{variable = variable[splice[y]]}catch(e){variable = undefined}
		//try{var2 = var2[splice[y]]}catch(e){var2 = undefined}
	}
	return [variable,splice[splice.length-1]];
}
function getRandomCard()
{
	return [Math.round(Math.random()*(ref.length-1)),Math.round(Math.random()*(types.length-1))];
}

function updateCounter()
{
	if(scatterCards) return;
	var d = new Date(Date.now()-startTime);
	var min = Math.floor(d.getTime()/1000/60).toString(), sec = d.getSeconds().toString();
	if(sec.length == 1) sec = "0"+sec;
	time.innerText = min+":"+sec;
	if(Math.floor((Date.now()-startTime)/1000)%10 == 0)
	{
		score.innerText -= 2;
	}
	if(parseFloat(score.innerText) < 0) score.innerText = 0;
}

function addMove(move)
{
	moves.push(move);
	unmoves.splice(0);
	disable(document.getElementsByName("redo")[0]);
}

function autoMoves()
{
	if(dragging)
	{
		if(!dragging[0][dragging[1]]) { dragging = false; autoMoves()}
	}
	else
	{
		if(document.getElementById("autosolve").checked) setTimeout(gameMode.autoSolve,0);
		if(document.getElementById("autofoundation").checked) gameMode.autoSolve("ace");
	}
}
