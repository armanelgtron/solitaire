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

var klondike = {name:"Klondike Solitaire"};
gameModes.push(klondike);

klondike.newDeal = function()
{
	used = [];
	human = false;
	bot = false;
	scatterCards = false;
	moves = []; unmoves = [];
	startTime = Date.now();
	score.innerText = 0;
	
	var card,f;
	for(var i=52;i>0;--i)
	{
		card = getRandomCard();
		for(var x=used.length-1;x>=0;--x)
		{
			f=false;
			while(card[0] == used[x][0] && card[1] == used[x][1])
			{
				f=true; card = getRandomCard();
			}
			if(f) x=used.length;
		}
		used.push(card);
	}
	
	var used2 = used.slice(0);
	
	talon = used2.splice(0,24);
	talon.current = -1;
	
	aces = [[],[],[],[]];
	
	spaces = [];
	for(var i=7;i>0;--i)
	{
		spaces.push(used2.splice(0,i));
		var len = spaces[7-i].length-1;
		for(var x=len;x>0;--x)
		{
			spaces[7-i][x].push(x==len);
		}
	}
	console.log(used2);
	usedbak = JSON.stringify(used);
	
	dealid.innerText = simpleGameExport52();
};

klondike.resetGame = function()
{
	human = false;
	bot = false;
	scatterCards = false;
	moves = []; unmoves = [];
	startTime = Date.now();
	score.innerText = 0;
	
	//var 
	tmp = used.splice(0);
	for(var i=0;i<52;++i)
	{
		used.push(tmp[i].slice(0,2));
	}
	
	var used2 = used.slice(0);
	
	talon = used2.splice(0,24);
	talon.current = -1;
	
	aces = [[],[],[],[]];
	
	spaces = [];
	for(var i=7;i>0;--i)
	{
		spaces.push(used2.splice(0,i));
		var len = spaces[7-i].length-1;
		for(var x=len;x>0;--x)
		{
			spaces[7-i][x].push(x==len);
		}
	}
	console.log(used2);
	
	dealid.innerText = simpleGameExport52();
};

klondike.draw = function()
{
	canvas.ctx.clearRect(0,0,canvas.width,canvas.height);
	
	canvas.ctx.beginPath();
	canvas.ctx.strokeStyle = "white";
	canvas.ctx.rect(10 ,10,71,96);
	canvas.ctx.rect(90 ,10,71,96);
	canvas.ctx.stroke();
	canvas.ctx.closePath();
	
	canvas.ctx.beginPath();
	canvas.ctx.strokeStyle = "black";
	canvas.ctx.rect(250,10,71,96);
	canvas.ctx.rect(330,10,71,96);
	canvas.ctx.rect(410,10,71,96);
	canvas.ctx.rect(490,10,71,96);
	canvas.ctx.stroke();
	canvas.ctx.closePath();
	
	var img;
	
	for(var i=0;i<talon.length;++i)
	//for(var i=talon.length-1;i>=0;--i)
	{
		if(!ref[talon[i][0]]) console.warn(talon[i]);
		img = ref[talon[i][0]][types[talon[i][1]]];
		if(i > talon.current)
		{
			canvas.ctx.drawImage(back,10,10);
		}
		else
		{
			if(talon[i].anim)
			{
				canvas.ctx.putImageData(talon[i].anim,0,0);
				if(talon[i].x) talon[i].x += 5;
				else talon[i].x = 10;
				if(talon[i].x >= 90) talon[i].anim = talon[i].x = false;
				draw.nextFrame();
			}
			canvas.ctx.drawImage(img,talon[i].x||90,talon[i].y||10);
			if(talon[i].anim) return;
		}
	}
	
	var winDetect = 0;
	var x=250;
	for(var i=aces.length-1;i>=0;--i)
	{
		for(var z=0;z<aces[i].length;++z)
		{
			img = ref[aces[i][z][0]][types[aces[i][z][1]]];
			canvas.ctx.drawImage(img,aces[i][z].x||x,aces[i][z].y||10);
			if(aces[i][z][1] == 12) winDetect++;
		}
		x += 80;
	}
	hasWon = (winDetect === 4);
	
	var x = 10,drg,dragIsPile;
	if(dragging)
	{
		var drg = spaces.indexOf(dragging[0]), dragIsPile = drg >= 0;
	}
	for(var i=spaces.length-1;i>=0;--i)
	{
		var y = 130;
		for(var z=0;z<spaces[i].length;++z)
		{
			//if(!dragIsPile || (dragging[1] != z && drg != i))
			{
				if(spaces[i][z][2])
				{
					img = ref[spaces[i][z][0]][types[spaces[i][z][1]]];
				}
				else
				{
					img = back;
					if(z == spaces[i].length-1)
					{
						spaces[i][z][2] = true;
						if(moves.length > 0)
						{
							addMove([[spaces[i][z],2],"FromTo",[false,true]]);
							score.innerText -= -5;
						}
						draw.nextFrame();
					}
				}
				if(dragging && dragging[0][dragging[1]] == spaces[i][z]) break;
				canvas.ctx.drawImage(img,spaces[i][z].x||x,spaces[i][z].y||y);
			}
			y += 18;
		}
		x += 80;
	}
	
	if(dragging && dragging[0][dragging[1]]) //draw the card for a 2nd time ...
	{
		img = ref[dragging[0][dragging[1]][0]][types[dragging[0][dragging[1]][1]]];
		canvas.ctx.drawImage(img,dragging[0][dragging[1]].x,dragging[0][dragging[1]].y);
		
		//draw piles
		var xp = dragging[0][dragging[1]].x, yp = dragging[0][dragging[1]].y;
		if(dragIsPile)
		{
			if(dragging[0].length-1 > dragging[1])
			{
				for(var x=dragging[1];x<dragging[0].length-1;++x)
				{
					yp += 10;
					canvas.ctx.drawImage(ref[dragging[0][x][0]][types[dragging[0][x][1]]],xp,yp);
				}
			}
		}
	}
	
	if(scatterCards)
	{
		var x=250, t=-Math.PI,a=(Math.PI/52)*2;
		for(var i=aces.length-1;i>=0;--i)
		{
			for(var z=0;z<aces[i].length;++z)
			{
				if(!aces[i][z].xdir && !aces[i][z].ydir)
				{
					//aces[i][z].xdir = (Math.random()*2)-1;
					//aces[i][z].ydir = (Math.random()*2)-1;
					aces[i][z].xdir = Math.sin(t);
					aces[i][z].ydir = Math.cos(t);
					t+=a;
					aces[i][z].x = x;
					aces[i][z].y = 10;
				}
				else if(aces[i][z].x+back.width >= canvas.width)
					aces[i][z].xdir = -Math.abs(aces[i][z].xdir);
				else if(aces[i][z].x <= 0)
					aces[i][z].xdir = Math.abs(aces[i][z].xdir);
				else if(aces[i][z].y+back.height >= canvas.height)
					aces[i][z].ydir = -Math.abs(aces[i][z].ydir);
				else if(aces[i][z].y <= 0)
					aces[i][z].ydir = Math.abs(aces[i][z].ydir);
				aces[i][z].x += aces[i][z].xdir*10;//*100;
				aces[i][z].y += aces[i][z].ydir*10;//*100;
				draw.ace++;
			}
			x += 80;
		}
		draw.nextFrame();
	}
};

klondike.autoSolve = function(mode)
{
	if(mode == "ace") var pbot = bot;
	//move cards to the ace stack
	var x=0, blankAt=false;
	for(var e=spaces.length-1;e>=0;--e)
	{
		var y = 130+((spaces[e].length-1)*18);
		
		if(spaces[e].length > 0)
		{
			var d = spaces[e][spaces[e].length-1];
			
			var aX=250;
			for(var i=aces.length-1;i>=0;--i)
			{
				var len = aces[i].length-1;
				if(
					(aces[i].length == 0 && d[1] == 0) || 
					(aces[i][len] && aces[i][len][1]+1 == d[1] && aces[i][len][0] == d[0])
				)
				{
					aicursor.moveTo(x+20,y+50+canvas.offsetTop);
					aicursor.onTarget = function(e)
					{
						console.log(e,aX);
						canvas.onmousedown(e);
						aicursor.moveTo(aX+20,50+canvas.offsetTop);
						aicursor.onTarget = canvas.onmouseup;
					};
					console.log(aX);
					return true;
				}
				aX += 80;
			}
		}
		else
		{
			blankAt = e;
		}
		x += 80;
	}
	if(talon[talon.current])
	{
		var d = talon[talon.current];
		var aX = 250;
		for(var i=aces.length-1;i>=0;--i)
		{
			var len = aces[i].length-1;
			if(
				(aces[i].length == 0 && d[1] == 0) || 
				(aces[i][len] && aces[i][len][1]+1 == d[1] && aces[i][len][0] == d[0])
			)
			{
				aicursor.moveTo(90+20,10+50+canvas.offsetTop);
				aicursor.onTarget = function(e)
				{
					console.log(e,aX);
					canvas.onmousedown(e);
					aicursor.moveTo(aX+20,50+canvas.offsetTop);
					aicursor.onTarget = canvas.onmouseup;
				};
				console.log(aX);
				return true;
			}
			aX += 80;
		}
	}
	
	if(mode == "ace")
	{
		bot = pbot;
	}
	else
	{
		//stack cards and stuff
		var x = 0;
		for(var u=spaces.length-1;u>=0;--u)
		{
			var y = 130;
			for(var z=0;z<spaces[u].length;++z)
			{
				if(spaces[u][z][2])
				{
					var d = spaces[u][z];
					if(d)
					{
						if(blankAt !== false && d[1] == 12 && z != 0)
						{
							aicursor.moveTo(x+20,y+5+canvas.offsetTop);
							aicursor.onTarget = function(e)
							{
								canvas.onmousedown(e);
								aicursor.moveTo((80*(spaces.length-1-blankAt))+20,130+50+canvas.offsetTop);
								aicursor.onTarget = canvas.onmouseup;
							};
							return true;
						}
						
						if(!spaces[u][z-1] || !spaces[u][z-1][2])
						{
							var zX = 0;
							for(var i=spaces.length-1;i>=0;--i)
							{
								var zY = 130;
								//for(var e=0;e<spaces[i].length;++e)
								var e = spaces[i].length-1;
								zY += e*18;
								if(e != -1)
								{
									if(spaces[i][e][2] && d[1]+1 == spaces[i][e][1] && (Math.floor(spaces[i][e][0]/2) != Math.floor(d[0]/2)))
									{
										aicursor.moveTo(x+20,y+5+canvas.offsetTop);
										aicursor.onTarget = function(e)
										{
											canvas.onmousedown(e);
											aicursor.moveTo(zX+20,zY+50+canvas.offsetTop);
											aicursor.onTarget = canvas.onmouseup;
										};
										return true;
									}
									//zY += 18;
								}
								zX += 80;
							}
						}
					}
				}
				y += 18;
			}
			
			x += 80;
		}
		//lazy copy and paste
		var x = 90;
		{
			var y = 10;
			{
				{
					var d = talon[talon.current];
					if(d)
					{
						console.log(d[0]);
						if(blankAt !== false && d[1] == 12)
						{
							aicursor.moveTo(x+20,y+5+canvas.offsetTop);
							aicursor.onTarget = function(e)
							{
								canvas.onmousedown(e);
								aicursor.moveTo((80*(spaces.length-1-blankAt))+20,130+50+canvas.offsetTop);
								aicursor.onTarget = canvas.onmouseup;
							};
							return true;
						}
						
						//if(spaces[u][z-1] && !spaces[u][z-1][2])
						{
							var zX = 0;
							for(var i=spaces.length-1;i>=0;--i)
							{
								var zY = 130;
								//for(var e=0;e<spaces[i].length;++e)
								var e = spaces[i].length-1;
								zY += e*18;
								if(e != -1)
								{
									if(spaces[i][e][2] && d[1]+1 == spaces[i][e][1] && (Math.floor(spaces[i][e][0]/2) != Math.floor(d[0]/2)))
									{
										aicursor.moveTo(x+20,y+5+canvas.offsetTop);
										aicursor.onTarget = function(e)
										{
											canvas.onmousedown(e);
											aicursor.moveTo(zX+20,zY+50+canvas.offsetTop);
											aicursor.onTarget = canvas.onmouseup;
										};
										return true;
									}
									//zY += 18;
								}
								zX += 80;
							}
						}
					}
				}
			}
		}
		
		if(mode != "noflip")
		{
			//else, just flip the talon
			aicursor.moveTo(20,10+50+canvas.offsetTop);
			aicursor.onTarget = function(e)
			{
				canvas.onmousedown(e);
				canvas.onmouseup(e);
			};
		}
	}
};

klondike.onMouseDown = function(e)
{
	if(e.clientX > 10 && e.clientX < 80 && e.clientY > 10 && e.clientY < 150)
	{
		talon.current++;
		if(talon.current >= talon.length)
		{
			talon.current = -1;
		}
		else
		{
			talon[talon.current].x=-65521; draw(); talon[talon.current].x=null;
			talon[talon.current].anim = canvas.ctx.getImageData(0,0,canvas.width,canvas.height);
		}
		draw();
		addMove(["talon.current","+",1]);
	}
	else if(e.clientX > 90 && e.clientX < 160 && e.clientY > 10 && e.clientY < 150)
	{
		dragging = [talon,talon.current];
		canvas.onmousemove(e);
	}
	var x = 250;
	for(var i=aces.length-1;i>=0;--i)
	{
		if(e.clientX > x && e.clientX < x+70 && e.clientY > 10 && e.clientY < 150)
		{
			dragging = [aces[i],aces[i].length-1];
			canvas.onmousemove(e);
			break;
		}
		x += 80;
	}
	var x = 10;
	for(var i=spaces.length-1;i>=0;--i)
	{
		var y = 130+(spaces[i].length*18);
		//for(var z=0;z<spaces[i].length;++z)
		for(var z=spaces[i].length-1;z>=0;--z)
		{
			if(spaces[i][z][2])
			{
				if(e.clientX > x && e.clientX < x+70 && e.clientY > 25+y && e.clientY < 150+y)
				{
					dragging = [spaces[i],z];
					canvas.onmousemove(e);
					break;
				}
			}
			y -= 18;
		}
		x += 80;
	}
};

klondike.onMouseUp = function(e)
{
	if(dragging)
	{
		//dragging[0][dragging[1]].x=dragging[0][dragging[1]].y=null;
		dragPath.pos = dragPath.length-1;
		dragPath.obj = dragging[0][dragging[1]]; 
		dragPath.delay = 200/dragPath.length;
		//aces
		//if(talon[talon.current])
		{
			var x = 250;
			for(var i=aces.length-1;i>=0;--i)
			{
				if(e.clientX > x && e.clientX < x+70 && e.clientY > 10 && e.clientY < 150)
				{
					var len = aces[i].length-1;
					if(
						(aces[i].length == 0 && dragging[0][dragging[1]][1] == 0) || 
						(aces[i][len] && aces[i][len][1]+1 == dragging[0][dragging[1]][1] && aces[i][len][0] == dragging[0][dragging[1]][0])
					)
					{
						dropCard(aces[i]);
						score.innerText -= -10;
					}
					break;
				}
				x += 80;
			}
		}
		if(!dragging[0][dragging[1]]) { dragging = false; return; }
		var x = 10;
		for(var i=spaces.length-1;i>=0;--i)
		{
			if(spaces[i].length == 0 && dragging[0][dragging[1]][1] == 12 && e.clientX > x && e.clientX < x+70 && e.clientY > 130 && e.clientY < 150+130)
			{
				dropCard(spaces[i]);
				break;
			}
			var y = 130+(spaces[i].length*18);
			//for(var z=0;z<spaces[i].length;++z)
			for(var z=spaces[i].length-1;z>=0;--z)
			{
				if(e.clientX > x && e.clientX < x+70 && e.clientY > 10+y && e.clientY < 150+y)
				{
					
					if(
						(spaces[i][z][2] && dragging[0][dragging[1]][1]+1 == spaces[i][z][1] && (Math.floor(spaces[i][z][0]/2) != Math.floor(dragging[0][dragging[1]][0]/2)))
					)
					{
						dropCard(spaces[i]);
					}
					break;
				}
				y -= 18;
			}
			x += 80;
		}
	}
	dragging = null;
	draw();
};
