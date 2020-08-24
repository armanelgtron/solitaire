/*
 * Armanelgtron Cards
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

function simpleGameExport104()
{
	var outp = "";
	for(var i=used.length-1;i>=0;--i)
	{
		outp += (used[i][0].toString(13))+(used[i][1].toString(13));
	}
	return outp;
}
function simpleGameImport104(inp,guess)
{
	var tmp = [];
	for(var i=103;i>=0;i-=2)
	{
		tmp.push([parseInt(inp.charAt(i-1),13),parseInt(inp.charAt(i),13)]);
	}
	for(var i=tmp.length-1;i>=0;--i)
	{
		for(var x=tmp.length-1;x>=0;--x)
		{
			if(i != x) while(tmp[i][0] == tmp[x][0] && tmp[i][1] == tmp[x][1])
			{
				if(guess)
				{
					tmp[i] = getRandomCard();
				}
				else throw "Invalid game code.";
			}
		}
	}
	used.splice(0); for(var i=tmp.length-1;i>=0;--i) { used.push(tmp[i]); }
	resetGame();
}

function simpleGameExport52()
{
	var outp = "";
	var n,o;
	for(var i=used.length-1;i>=0;--i)
	{
		n=(used[i][1]+1)*(used[i][0]+1);
		o=n.toString(36).toLowerCase();
		if(o.length > 1) o=((n-25).toString(36).toUpperCase());
		outp += o;
	}
	return outp;
}
function simpleGameImport52(inp,guess)
{
	var tmp = [];
	var n,o;
	for(var i=51;i>=0;--i)
	{
		o = inp.charAt(i);
		n = parseInt(o,36);
		if(o != o.toLowerCase()) n += 25;
		console.log(n);
		tmp.push([Math.floor(n/13),n%13]);
	}
	for(var i=tmp.length-1;i>=0;--i)
	{
		for(var x=tmp.length-1;x>=0;--x)
		{
			if(i != x) while(tmp[i][0] == tmp[x][0] && tmp[i][1] == tmp[x][1])
			{
				if(guess)
				{
					tmp[i] = getRandomCard();
				}
				else throw "Invalid game code.";
			}
		}
	}
	used.splice(0); for(var i=tmp.length-1;i>=0;--i) { used.push(tmp[i]); }
	resetGame();
}

function autoGameImport(inp,guess)
{
	inp += "";
	if(inp.length >= 80) simpleGameImport104(inp,guess)
	else if(inp.length >= 40) simpleGameImport52(inp,guess)
	else { return false; }
}
