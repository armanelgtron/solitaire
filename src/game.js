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

clubs = {};
diamonds = {};
hearts = {};
spades = {};

var ref = [clubs,spades,diamonds,hearts];
var sets = ["clubs","spades","diamonds","hearts"];
var types = ["ace",2,3,4,5,6,7,8,9,10,"jack","queen","king"];

var gameModes = [];
var gameMode = null;
var used = [],usedbak;

for(var i=ref.length-1;i>=0;--i)
{
	for(var x=types.length-1;x>=0;--x)
	{
		ref[i][types[x]] = new Image();
		ref[i][types[x]].src = "./image/"+sets[i]+"/"+types[x]+".png";
	}
}

back = new Image();back.src = './image/back.png';



window.onload = function()
{
	score = document.getElementById("score");
	time = document.getElementById("time");
	dealid = document.getElementById("deal");
	welcome = document.getElementById("welcome");
	window.addEventListener('resize',resize,false);resize();
	welcome.style.display = "block";
	canvas = document.getElementById("game");
	canvas.width = width; canvas.height = height;
	canvas.ctx = canvas.getContext("2d");
	dragging = null;
	dragPath = []; dragPath.pos = null;
	
	//this is to prevent Opera from thinking I was clicking the bottom text.
	document.onmousedown = function(e) { if(e.preventDefault && e.target == canvas) e.preventDefault();}
	
	//For menus
	var menus = document.getElementsByClassName("activateMenu");
	for(var i=menus.length-1;i>=0;--i)
	{
		menus[i].onmouseover = function()
		{
			var menus = document.getElementsByClassName("menu"),thename="";
			for(var i=menus.length-1;i>=0;--i)
			{
				if(menus[i].style.display === "block")
				{
					menu(thename=this.getAttribute("menu"));
					break;
				}
			}
			var aMenus = document.getElementsByClassName("activateMenu"),tofocus;
			for(var i=aMenus.length-1;i>=0;--i)
			{
				if(this.attributes.menu.name === aMenus[i].getAttribute("menu")) tofocus=aMenus[i];
				else aMenus[i].blur();
			}
			if(tofocus) tofocus.setActive();
		};
	}
	document.addEventListener("mouseup",function(e)
	{
		if(e.target.className.indexOf("activateMenu") === -1) menu(null);
		else
		{
			var menus = document.getElementsByClassName("activateMenu");
			for(var i=menus.length-1;i>=0;--i)
			{
				if(menus[i].style.display === "block" && e.target == menus[i])
				{
					menu(null);
					return;
				}
			}
			menu(e.target.getAttribute("menu"));
		}
	},false);
	
	//mouse event handling for gameplay
	canvas.onmousedown = function(e)
	{
		console.log(e.clientX,e.clientY);
		gameMode.onMouseDown(e);
	};
	canvas.onmousemove = function(e,h)
	{
		if(dragging)
		{
			if(!dragging[0][dragging[1]]) dragging = null;
			else
			{
				if(h === undefined) human = true;
				dragging[0][dragging[1]].x = e.clientX-35;
				dragging[0][dragging[1]].y = e.clientY-96;
				dragPath.push([dragging[0][dragging[1]].x,dragging[0][dragging[1]].y]);
				draw();
			}
		}
		if(gameMode.onMouseMove) gameMode.onMouseMove(e);
	};
	canvas.onmouseup = function(e) 
	{
		console.log(e.clientX,e.clientY);
		gameMode.onMouseUp(e);
		if(document.getElementById("autofoundation").checked) autoSolveTest("ace");
	};
	menu();
	
	aicursor = document.getElementById("aicursor");
	aicursor.drawStep = function()
	{
		var e = {clientX:parseInt(aicursor.style.left),clientY:parseInt(aicursor.style.top)};
		var dx=aicursor.target[0]-e.clientX, dy=aicursor.target[1]-e.clientY;
		e.clientX += unnearWhole(dx/10); e.clientY += unnearWhole(dy/10);
		
		aicursor.style.left = e.clientX+"px"; aicursor.style.top = e.clientY+"px";
		
		aicursor.time += aicursor.mvRate;
		//console.log(Date.now());
		
		if(Math.sqrt(Math.pow((aicursor.target[0]-e.clientX),2)+Math.pow((aicursor.target[1]-e.clientY),2)) > aicursor.accr)
		{
			canvas.onmousemove(e);
			if(Date.now() > aicursor.time)
			{
				aicursor.drawStep();
			}
			else
			{
				setTimeout(aicursor.drawStep,aicursor.mvRate);
			}
		}
		else if(aicursor.onTarget) 
		{
			if(!document.getElementById("autosolve").checked) aicursor.style.display = "none";
			aicursor.onTarget(e);
		}
	};
	aicursor.moveTo = function(x,y)
	{
		aicursor.target[0] = x; aicursor.target[1] = y;
		aicursor.style.display = "block";
		aicursor.time = Date.now();
		setTimeout(aicursor.drawStep,aicursor.mvRate);
		bot = true;
	};
	aicursor.target = [0,0];
	aicursor.onTarget = null;
	aicursor.mvRate = 5; aicursor.accr = 4;
	aicursor.style.top = "-4px";
	aicursor.style.left = "-4px";
	
	gameMode = klondike;
	newGame(); draw();
	setInterval(updateCounter,1000);
	setInterval(autoMoves,500);
};

var hasWon = false;
function draw()
{
	try{
	if(dragPath.pos !== null)
	{
		setTimeout(draw,dragPath.delay);
		dragPath.obj.x = dragPath[dragPath.pos][0];
		dragPath.obj.y = dragPath[dragPath.pos][1];
		dragPath.pos--;
		if(dragPath.pos <= 0 || dragging)
		{
			dragPath.splice(0);
			dragPath.pos = null;
			draw();
			dragPath.obj.x=dragPath.obj.y=null;
			return;
		}
	}
	gameMode.draw();
	
	if(hasWon)
	{
		canvas.ctx.textAlign = "center";
		canvas.ctx.fillStyle = "black";
		canvas.ctx.font = "50px serif";
		canvas.ctx.fillText("Congratulations!",width/2,50); 
		
		canvas.ctx.font = "20px serif";
		if(human && bot)
		{
			canvas.ctx.fillText("We have won!",width/2,80); 
		}
		else if(human)
		{
			canvas.ctx.fillText("You have won!",width/2,80); 
		}
		else if(bot)
		{
			canvas.ctx.fillText("I have won!",width/2,80); 
		}
		else
		{
			canvas.ctx.fillText("Actually, I'm not quite sure what happened here. Please inform nelg.",width/2,50); 
		}
		if(!scatterCards)
		{
			scatterCards = true;
			addMove(["scatter"]);
			draw.ace = 0;
		}
	}
	
	}catch(exception)
	{
		console.error(exception);
		//var s=prompt("Looks like an error has occurred. Would you like to attempt to recover? (If you don't know, hit Okay)");
		var s=prompt("An internal error occurred. Hit OK to continue, cancel to debug. (If you don't know, hit OK. This should be non-destructive, provided the error wasn't too severe.)");
		if(s != null && s.charAt(0).toLowerCase() != 'n')
		{
			var m = moves.length-1;
			while(undo(false) === false) { continue; }
			var r = unmoves.splice(0);
			resetGame();
			Array.prototype.push.apply(unmoves,r);
			console.log(unmoves,r);
			for(var i=m;i>=0;--i) { redo(); }
		}
	}
	
	if(moves.length == 0) disable(document.getElementsByName("undo")[0]);
	else enable(document.getElementsByName("undo")[0]);
	if(unmoves.length == 0) disable(document.getElementsByName("redo")[0]);
	else enable(document.getElementsByName("redo")[0]);
}
draw.nextFrame = function()
{
	if(draw.animFrame) cancelAnimationFrame(draw.animFrame);
	draw.animFrame=requestAnimationFrame(draw);
}

function dropCard(at)
{
	dragging[0][dragging[1]].x=dragging[0][dragging[1]].y=null;
	dragPath.splice(0);
	dragPath.pos = null;
	
	at.push(dragging[0][dragging[1]]);
	dragging[0].splice(dragging[1],1);
	if(dragging[0] === talon && dragging[1] === talon.current)
	{
		talon.current--;
		addMove([[talon,"current"],"FromTo",[talon.current+1,talon.current]]);
	}
	addMove([[dragging[0],dragging[1]],"to",[at,at.length-1]]);
	if(spaces.indexOf(dragging[0]) >= 0)
	{
		if(dragging[0].length > dragging[1])
		{
			for(var x=dragging[1];x<dragging[0].length;)
			{
				console.log("-",dragging[0].length,x);
				at.push(dragging[0][x]);
				dragging[0].splice(x,1);
				addMove([[dragging[0],x],"to",[at,at.length-1],"ff"]);
			}
		}
	}
	
	draw();
}

function undo(doDraw)
{
	var c = moves[moves.length-1];
	if(!c) return false;
	
	if(typeof(c[0]) == "string")
		var v = getVarFromString(c[0]);
	
	unmoves.push(c);
	moves.splice(moves.length-1);
	
	switch(c[1])
	{
		case "-":
			v[0][v[1]] += c[2];
			break;
		case "+":
			v[0][v[1]] -= c[2];
			console.log(v[0][v[1]],c[2]);
			if(v[0] == talon && v[1] == "current" && talon.current < -1)
				talon.current = talon.length-talon.current-3;
			break;
		case "to":
			//c[0][0].push(c[2][0][c[2][1]]);
			c[0][0].splice(c[0][1],0,c[2][0][c[2][1]]);
			c[2][0].splice(c[2][1],1);
			break;
		case "FromTo":
			c[0][0][c[0][1]] = c[2][0];
			return undo(doDraw); //jump to next undo
			break;
		case "scatter":
			for(var i=used.length-1;i>=0;--i)
			{
				used[i].x=used[i].y=null;
			}
			scatterCards = false;
			draw.ace = 0;
			return undo(doDraw); //jump to next undo
			break;
	}
	
	if(c[3] == "ff") return undo();
	
	if(doDraw === undefined || doDraw)draw();
}
function redo()
{
	var c = unmoves[unmoves.length-1];
	if(!c) return false;
	
	if(typeof(c[0]) == "string")
		var v = getVarFromString(c[0]);
	
	moves.push(c);
	unmoves.splice(unmoves.length-1);
	
	switch(c[1])
	{
		case "-":
			v[0][v[1]] -= c[2];
			break;
		case "+":
			v[0][v[1]] += c[2];
			if(v[0] == talon && v[1] == "current" && talon.current >= talon.length)
				talon.current = talon.length-talon.current;
			break;
		case "to":
			//c[2][0].push(c[0][0][c[0][1]]);
			c[2][0].splice(c[2][1],0,c[0][0][c[0][1]]);
			c[0][0].splice(c[0][1],1);
			break;
		case "FromTo":
			c[0][0][c[0][1]] = c[2][1];
			return redo();
			break;
	}
	
	if(c[3] == "ff") return redo();
	
	draw();
}

function hint()
{
	if(aicursor.style.display !== "none" || hint.interval) return;
	var r = unmoves.splice(0);
	var prevWasBot = bot;
	if(autoSolveTest("noflip"))
	{
		hint.interval = setInterval(function()
		{
			if(aicursor.style.display === "none")
			{
				clearInterval(hint.interval);
				hint.interval = false;
				undo();
				unmoves.splice(0);
				Array.prototype.push.apply(unmoves,r);
				bot = prevWasBot;
			}
		},100);
	}
	else
	{
		alert("No actions currently found.");
	}
}

//DEPRECATED methods
function autoSolveTest(mode){return gameMode.autoSolve(mode);} 
function newGame(){return gameMode.newDeal();}
