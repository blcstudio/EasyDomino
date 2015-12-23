/*
 * @file easy_domin_play.js
 * @version 0.2.0
 * @author ginger
 * @brief easy domino gameplay javascript part
 */

// origin x, y, width, height based on a screen 800 * 640
/* about canvas */
var canvas, context;
/* global settings */
var global;
/* about resources */
/* gameplay */
/* FIX HERE */

/* start game */
function startGame() {
	// get global settings
	getGlobalSettings();
	// load resources
	loadResource();
	// waiting for loading
	var waitid = setInterval(function () {
		if (!global.loading) {
			// initialize gameplay
			initGamePlay();
			// start to draw UI
			startDrawUI();
			// add event listeners, player can operate
			initListener();
			// stop waiting
			clearInterval(waitid);
		}
	}, 500);
}
// get global settings
function getGlobalSettings() {
	global = {};
	// element ids
	global.canvasId = 'playground';
	global.bodyId	= '_body';
	// resources
	global.resourceList = [
		{name: 'boneset', 		type: 'img', 	src: './img/domino-set.png'},
		{name: 'background', 	type: 'img', 	src: './img/background.png'},
		{name: 'handpanel', 	type: 'img', 	src: './img/handpanel.png'}
	];
	// loading flag
	global.loading = global.resourceList.length;
	// UI refresh time
	global.UIRefreshTime = 50;
	// how many bonesets are used
	global.bonesetNum = 1;
	// player names
	global.playerNameList = ['player1', 'player2'];
	// how many bones a player hold at the beginning
	global.playerBeginningBoneNum = 7;
}
// load resources
function loadResource() {
	// generate resource holder
	global.resourceHolder = [];
	// load each resource
	for (var i = 0; i < global.resourceList.length; i ++) {
		var res = global.resourceList[i];
		switch (res.type) {
			// load image resource
			case 'img':
				global.resourceHolder[res.name] = new Image();
				global.resourceHolder[res.name].onload = function () { global.loading = parseInt(global.loading) - 1; }
				global.resourceHolder[res.name].src = res.src;
				break;
		}
	}
	// load logical resource
	global.resourceHolder['bonesetparam'] = {x: 75, y: 150, w: 62, h: 124};
	global.resourceHolder['dlist'] = ['v+', 'h+', 'v-', 'h-'];
}
// initialize gameplay
function initGamePlay() {
	// generate boneset
	var bones = [];
	for (var i = 0; i < global.bonesetNum; i ++) {
		for (var j = 0; j <= 6; j ++) {
			for (var k = 0; k <= j; k ++) {
				bones.push(Bone.createNew(j, k));
			}
		}
	}
	global.boneHolder = Player.createNew('boneHolder', bones);
	// select the beginning bone
	var startBone = global.boneHolder.removeBone(getRandom(0, global.boneHolder.getPlayerBones().length - 1));
	// put the beginning bone on table
	// xPos, yPos is 'how many half bones'
	global.bonexesOnTable = [{bone: startBone, xPos: 0, yPos: 0, d: 1}];
	// generate players
	var playerList = [];
	for (var i = 0; i < global.playerNameList.length; i ++) {
		// generate a player
		var aPlayer = Player.createNew(global.playerNameList[i]);
		// give players bones
		var playerBones = [];
		for (var j = 0; j < global.playerBeginningBoneNum; j ++) {
			playerBones.push(global.boneHolder.removeBone(getRandom(0, global.boneHolder.getPlayerBones().length - 1)));
		}
		aPlayer.setBones(playerBones);
		playerList.push(aPlayer);
	}
	// put player1's bones to hand panel
	global.bonesOfPlayer = [];
	for (var i = 0; i < global.playerNameList.length; i ++) {
		global.bonesOfPlayer[i] = playerList[i].getPlayerBones().slice();
	}
	global.bonesInHand = global.bonesOfPlayer[0].slice();
	// generate null strategy
	var strategy = {};
	strategy.getScoreForSend = function (branchendIndex, bone, direct) { return 1; }
	// generate boneyard
	global.boneyard = Boneyard.createNew([startBone.getNum1(), startBone.getNum2()], playerList, null, strategy);
	// initialize bone direction
	global.bonesInHandDirect = 0;
	// initialize branchends
	global.branchends = [];
	global.branchends[posToString({x: 1.5, y: 0})] = startBone.getNum1();
	global.branchends[posToString({x: -1.5, y: 0})] = startBone.getNum2();
	// initialize scores
	global.scores = [0, 0];
	// set current player to player1
	global.curPlayer = 0;
}
// start draw UI
function startDrawUI() {
	canvas = document.getElementById(global.canvasId);
	context = canvas.getContext('2d');
	global.uid = setInterval('drawUI()', global.UIRefreshTime);
}
// add event listeners, player can operate
function initListener() {
	//window.onresize = doResize;
	canvas.onmousedown = doMouseDown;
	canvas.onmousemove = doMouseMove;
	canvas.onmouseup = doMouseUp;
	canvas.onmousewheel = doMouseWheel;
	document.onkeyup = function (event) {
		if (event.keyCode === 32) {	// space
			// next player
			global.curPlayer = (global.curPlayer + 1) % global.playerNameList.length;
			global.scores[global.curPlayer] -= 1;
		}
	}
	alert('游戏开始，拖动出牌，滚轮改变方向，空格跳过')
}
function doMouseDown(event) {
	var resize = getResize();
	if (event.offsetY > resize.screenHeight *2/3) {
		var index = touchBoneInHand(event.offsetX, event.offsetY, resize);
		// if select a bone in hand
		if (index !== null) {
			// splice it from bones in hand
			var mBone = global.bonesInHand[index];
			//global.bonesInHand.splice(index, 1);
			global.bonesOfPlayer[global.curPlayer].splice(index, 1);
			// set it as moving bone
			global.movingBonex = {type: 'bone', value: getResource('boneset'), bone: mBone, d: global.bonesInHandDirect
									, x: event.offsetX, y: event.offsetY, w: resize.boneScreenWidthOnTable, h: resize.boneScreenHeightOnTable};
		}
	}
}
function doMouseMove(event) {
	// update moving bone position
	if (typeof(global.movingBonex) !== 'undefined' && global.movingBonex !== null) {
		global.movingBonex.x = event.offsetX; global.movingBonex.y = event.offsetY;
	}
}
function doMouseUp(event) {
	if (typeof(global.movingBonex) !== 'undefined' && global.movingBonex !== null) {
		var resize = getResize();
		// if put moving bone in hand
		if (event.offsetY > resize.screenHeight *2/3) {
			global.bonesOfPlayer[global.curPlayer].push(global.movingBonex.bone);
			global.movingBonex = null;
		}
		// if put moving bone on table
		else {
			// detect branchend
			var detectResult = detectBranchend(event.offsetX, event.offsetY);
			if (detectResult) {
				touchBoneOnTable(event.offsetX, event.offsetY);
				// put moving bone to table
				var pos = getXYPos(event.offsetX, event.offsetY, resize);
				global.movingBonex.xPos = pos.x;
				global.movingBonex.yPos = pos.y;
				global.resourceHolder['debug'] = 'put bone on ' + global.movingBonex.xPos + ', ' + global.movingBonex.yPos;
				global.bonexesOnTable.push(global.movingBonex);
				// update branchends
				global.branchends[detectResult] = null;
				// if horizontal, add 2 branchends thisX +/- 1.5
				if (getResource('dlist')[global.movingBonex.d] === 'h+') {			// smaller right
					addBranchend(pos.x + 1.5, pos.y, global.movingBonex.bone.getNum1());
					addBranchend(pos.x - 1.5, pos.y, global.movingBonex.bone.getNum2());
				} else if (getResource('dlist')[global.movingBonex.d] === 'h-') {	// smaller left
					addBranchend(pos.x - 1.5, pos.y, global.movingBonex.bone.getNum1());
					addBranchend(pos.x + 1.5, pos.y, global.movingBonex.bone.getNum2());
				}
				// if vertical, add 2 branchends thisY +/- 1.5
				else if (getResource('dlist')[global.movingBonex.d] === 'v+') {		// smaller up
					addBranchend(pos.x, pos.y - 1.5, global.movingBonex.bone.getNum1());
					addBranchend(pos.x, pos.y + 1.5, global.movingBonex.bone.getNum2());
				} else if (getResource('dlist')[global.movingBonex.d] === 'v-') {	// smaller down
					addBranchend(pos.x, pos.y + 1.5, global.movingBonex.bone.getNum1());
					addBranchend(pos.x, pos.y - 1.5, global.movingBonex.bone.getNum2());
				}
				// score
				global.scores[global.curPlayer] += 1;
				global.movingBonex = null;
				// next player
				global.curPlayer = (global.curPlayer + 1) % global.playerNameList.length;
			}
			// put bone back to hand
			else {
				global.bonesOfPlayer[global.curPlayer].push(global.movingBonex.bone);
				global.movingBonex = null;
			}
		}
	}
}
function doMouseWheel(event) {
	// if there is moving bone
	if (event.wheelDelta > 10) {	// up
		//global.bonesInHandDirect = (global.bonesInHandDirect + getResource('dlist').length + 1) % getResource('dlist').length;
		global.movingBonex.d = (global.movingBonex.d + getResource('dlist').length - 1) % getResource('dlist').length;
	} else if (event.wheelDelta < 10) {	// down
		//global.bonesInHandDirect = (global.bonesInHandDirect + getResource('dlist').length - 1) % getResource('dlist').length;
		global.movingBonex.d = (global.movingBonex.d + getResource('dlist').length + 1) % getResource('dlist').length;
	}
}
function detectBranchend(x, y) {
	var pos = getXYPos(x, y, getResize());
	var dPosList = [];
	// if horizontal, detect position: this, thisX-0.5, thisX+0.5
	if (getResource('dlist')[global.movingBonex.d] === 'h+') {			// smaller right
		if (global.movingBonex.bone.getNum1() === global.movingBonex.bone.getNum2()) {
			dPosList.push({value: global.movingBonex.bone.getNum1(), x: pos.x, y: pos.y});
		}
		dPosList.push({value: global.movingBonex.bone.getNum1(), x: pos.x + 0.5, y: pos.y});
		dPosList.push({value: global.movingBonex.bone.getNum2(), x: pos.x - 0.5, y: pos.y});
	} else if (getResource('dlist')[global.movingBonex.d] === 'h-') {	// smaller left
		if (global.movingBonex.bone.getNum1() === global.movingBonex.bone.getNum2()) {
			dPosList.push({value: global.movingBonex.bone.getNum1(), x: pos.x, y: pos.y});
		}
		dPosList.push({value: global.movingBonex.bone.getNum1(), x: pos.x - 0.5, y: pos.y});
		dPosList.push({value: global.movingBonex.bone.getNum2(), x: pos.x + 0.5, y: pos.y});
	}
	// if vertical, detect position: this, thisY-0.5, thisY+0.5
	else if (getResource('dlist')[global.movingBonex.d] === 'v+') {		// smaller up
		if (global.movingBonex.bone.getNum1() === global.movingBonex.bone.getNum2()) {
			dPosList.push({value: global.movingBonex.bone.getNum1(), x: pos.x, y: pos.y});
		}
		dPosList.push({value: global.movingBonex.bone.getNum1(), x: pos.x, y: pos.y - 0.5});
		dPosList.push({value: global.movingBonex.bone.getNum2(), x: pos.x, y: pos.y + 0.5});
	} else if (getResource('dlist')[global.movingBonex.d] === 'v-') {	// smaller down
		if (global.movingBonex.bone.getNum1() === global.movingBonex.bone.getNum2()) {
			dPosList.push({value: global.movingBonex.bone.getNum1(), x: pos.x, y: pos.y});
		}
		dPosList.push({value: global.movingBonex.bone.getNum1(), x: pos.x, y: pos.y + 0.5});
		dPosList.push({value: global.movingBonex.bone.getNum2(), x: pos.x, y: pos.y - 0.5});
	}
	for (var i = 0; i < dPosList.length; i ++) {
		var str = posToString({x: dPosList[i].x, y: dPosList[i].y});
		if (global.branchends[str] === dPosList[i].value) {
			return str;
		}
	}
	return false;
}
function getXYPos(x, y, resize) {
	var ret = {};
	var xDiff = x-resize.screenWidth/2, yDiff = y-resize.screenHeight/3;
	if (xDiff > 0) { ret.x = parseInt((xDiff+resize.boneScreenWidthOnTable/4)/(resize.boneScreenWidthOnTable/2))/2; }
	else { ret.x = parseInt((xDiff-resize.boneScreenWidthOnTable/4)/(resize.boneScreenWidthOnTable/2))/2; }
	if (yDiff > 0) { ret.y = parseInt((yDiff+resize.boneScreenWidthOnTable/4)/(resize.boneScreenWidthOnTable/2))/2; }
	else { ret.y = parseInt((yDiff-resize.boneScreenWidthOnTable/4)/(resize.boneScreenWidthOnTable/2))/2; }
	return ret;
}
function posToString(pos) {
	return pos.x + '|' + pos.y;
}
function addBranchend(xPos, yPos, value) {
	var resize = getResize();
	if (touchBoneOnTable(resize.screenWidth / 2 + resize.boneScreenWidthOnTable * xPos
						, resize.screenHeight / 3 + resize.boneScreenWidthOnTable * yPos, resize) === null) {
		global.branchends[posToString({x: xPos, y: yPos})] = value;
	}
}




/* about resource */
function getResource(name) {
	return global.resourceHolder[name];
}

/* about resize */
function getResize() {
	if (typeof(global.body) === 'undefined') { global.body = document.getElementById(global.bodyId); }
	var resize = {};
	resize.screenWidth = global.body.offsetWidth; resize.screenHeight = global.body.offsetHeight;
	var boneScreenWidth = getResource('bonesetparam').w * resize.screenWidth / 670 / 3;
	var boneScreenHeight = boneScreenWidth * 2;
	resize.boneScreenWidthOnTable = boneScreenWidth;
	resize.boneScreenHeightOnTable = boneScreenHeight;
	resize.boneScreenWidthInHand = boneScreenWidth * 1.5;
	resize.boneScreenHeightInHand = boneScreenHeight * 1.5;
	return resize;
}

/* about draw UI */
function drawUI() {
	// get resize factor
	var resize = getResize();
	// resize canvas
	canvas.setAttribute('width', resize.screenWidth); canvas.setAttribute('height', resize.screenHeight);
	// generate draw list
	var drawlist = [];
	// background
	drawlist.push({type: 'imgtile', value: getResource('background'), x: 0, y: 0, w: resize.screenWidth, h: resize.screenHeight});
	// hand panel
	global.bonesInHand = global.bonesOfPlayer[global.curPlayer].slice();
	drawlist.push({type: 'imgtile', value: getResource('handpanel'), x: 0, y: resize.screenHeight * 2/3
					, w: resize.screenWidth, h: resize.screenHeight / 3});
	// bones on table
	for (var i = 0; i < global.bonexesOnTable.length; i ++) {
		var tBone = global.bonexesOnTable[i];
		drawlist.push({type: 'bone', value: getResource('boneset'), bone: tBone.bone, d: tBone.d
						, x: resize.screenWidth / 2 + resize.boneScreenWidthOnTable * tBone.xPos
						, y: resize.screenHeight / 3 + resize.boneScreenHeightOnTable / 2 * tBone.yPos
						, w: resize.boneScreenWidthOnTable, h: resize.boneScreenHeightOnTable});
	}
	// bones in hand
	for (var i = 0; i < global.bonesInHand.length; i ++) {
		var hBone = global.bonesInHand[i];
		drawlist.push({type: 'bone', value: getResource('boneset'), bone: hBone, d: global.bonesInHandDirect
						, x: resize.screenWidth / (global.bonesInHand.length + 1) * (i + 1)
						, y: resize.screenHeight * 5 / 6
						, w: resize.boneScreenWidthInHand, h: resize.boneScreenHeightInHand});
	}
	// effect
	// moving effect
	if (typeof(global.movingBonex) !== 'undefined' && global.movingBonex !== null) {
		var pos = getXYPos(global.movingBonex.x, global.movingBonex.y, resize);
		if (getResource('dlist')[global.movingBonex.d] == 'v+' || getResource('dlist')[global.movingBonex.d] == 'v-') {
			drawlist.push({type: 'strokerect', value: '#0000FF'
						, x: resize.screenWidth / 2 + resize.boneScreenWidthOnTable * (pos.x-0.5)
						, y: resize.screenHeight / 3 + resize.boneScreenHeightOnTable / 2 * (pos.y-1)
						, w: global.movingBonex.w
						, h: global.movingBonex.h});
		} else {
			drawlist.push({type: 'strokerect', value: '#0000FF'
						, x: resize.screenWidth / 2 + resize.boneScreenWidthOnTable * (pos.x-1)
						, y: resize.screenHeight / 3 + resize.boneScreenWidthOnTable * (pos.y-0.5)
						, w: global.movingBonex.h
						, h: global.movingBonex.w});
		}
	}
	// bone moving
	if (typeof(global.movingBonex) !== 'undefined' && global.movingBonex !== null) {
		drawlist.push(global.movingBonex);
	}
	// text
	var score = '';
	for (var i = 0; i < global.boneyard.getPlayers().length; i ++) {
		score = score + ' ' + global.boneyard.getPlayers()[i].getPlayerName() 
				+ ' ' + global.scores[i] + '分 ';
	}
	drawlist.push({type: 'text', value: score, x: 0, y: 40, font: "20px Courier New", color: 'red'});
	drawlist.push({type: 'text', value: ' current ' + global.playerNameList[global.curPlayer], x: 0, y: 20, font: "20px Courier New", color: 'blue'});
	// clear canvas
	context.fillStyle = '#FFFFFF'; context.fillRect(0, 0, resize.screenWidth, resize.screenHeight);
	// draw
	for (var i = 0; i < drawlist.length; i ++) {
		drawItem(drawlist[i]);
	}
	// detect win
	if (global.scores[global.curPlayer] < 0) {
		var max = 0, win = [];
		for (var i = 0; i < global.playerNameList.length; i ++) {
			if (global.scores[i] > max) {
				max = global.scores[i];
			}
		}
		for (var i = 0; i < global.playerNameList.length; i ++) {
			if (global.scores[i] === max) {
				win.push(global.playerNameList[i]);
			}
		}
		var msg = '';
		for (var i = 0; i < win.length; i ++) {
			msg = msg + ' ' + win[i];
		}
		alert(msg + ' win !');
		location.reload();
	}
}
function drawItem(item) {
	switch (item.type) {
		case 'imgtile':
			context.beginPath();
			context.rect(item.x, item.y, item.w, item.h);
			context.fillStyle = context.createPattern(item.value, 'repeat');
			context.fill();
			break;
		case 'bone':
			var param = getResource('bonesetparam');
			var r;
			if (getResource('dlist')[item.d] === 'h+') { r = 90; }
			else if (getResource('dlist')[item.d] === 'h-') { r = -90; }
			else if (getResource('dlist')[item.d] === 'v+') { r = 0; }
			else if (getResource('dlist')[item.d] === 'v-') { r = 180; }
			drawBone(item.value, item.bone.getNum1() * param.x, item.bone.getNum2() * param.y, param.w, param.h
					, item.x, item.y, item.w, item.h, r);
			break;
		case 'text':
			context.font = item.font;
			context.fillStyle = item.color;
			context.fillText(item.value, item.x, item.y);
			break;
		case 'strokerect':
			context.save();
			context.strokeStyle = item.value;
			context.strokeRect(item.x, item.y, item.w, item.h);
			context.restore();
			break;
	}
}
/* HERE 重要的经验
translate的作用是移动绘制原点
rotate的作用是旋转绘制原点
所以只要移动到要绘制的图形的中心点-》旋转-》相对于旋转后的坐标移动到图形左上角-》绘制即可！
所以这里传入的x,y其实是，要以哪一点为中心绘图！*/
function drawBone(img, sx, sy, sw, sh, x, y, w, h, r) {
	context.save();
	var r0 = r * Math.PI / 180;
	context.translate(x, y);
	context.rotate(r0);
	context.translate(-w/2, -h/2);
	context.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
	context.restore();
}

/* get bone from position */
function touchBoneOnTable(x, y, resize) {
	var r = null;
	//global.resourceHolder['debug'] = '(' + x + ',' + y + ')';
	var resize = getResize();
	for (var i = 0; i < global.bonexesOnTable.length; i ++) {
		var tBone = global.bonexesOnTable[i];
		var tW, tH;
		if (getResource('dlist')[tBone.d] === 'v+' || getResource('dlist')[tBone.d] === 'v-') {
			tW = resize.boneScreenWidthOnTable;
			tH = resize.boneScreenHeightOnTable;
		} else {
			tW = resize.boneScreenHeightOnTable;
			tH = resize.boneScreenWidthOnTable;
		}
		var tX = resize.boneScreenWidthOnTable * tBone.xPos + resize.screenWidth / 2 - tW/2;
		var tY = resize.boneScreenWidthOnTable * tBone.yPos + resize.screenHeight / 3 -tH/2;
		//global.resourceHolder['debug'] = global.resourceHolder['debug'] + '(' + tX + ',' + tY + ',' + tW + ',' + tH + ')\n';
		switch (getResource('dlist')[tBone.d]) {
			case 'v+':
				if (x > tX && x < tX + tW) {
					if (y > tY && y < tY + tH/2) { r = {num: global.bonexesOnTable[i].bone.getNum1(), index: i, t: 'up'}; }
					else if (y > tY + tH/2 && y < tY + tH) { r = {num: global.bonexesOnTable[i].bone.getNum2(), index: i, t: 'down'}; }
				}
				break;
			case 'v-':
				if (x > tX && x < tX + tW) {
					if (y > tY && y < tY + tH/2) { r = {num: global.bonexesOnTable[i].bone.getNum2(), index: i, t: 'up'}; }
					else if (y > tY + tH/2 && y < tY + tH) { r = {num: global.bonexesOnTable[i].bone.getNum1(), index: i, t: 'down'}; }
				}
				break;
			case 'h+':
				if (y > tY && y < tY + tH) {
					if (x > tX && x < tX + tW/2) { r = {num: global.bonexesOnTable[i].bone.getNum2(), index: i, t: 'left'}; }
					else if (x > tX + tW/2 && x < tX + tW) { r = {num: global.bonexesOnTable[i].bone.getNum1(), index: i, t: 'right'}; }
				}
				break;
			case 'h-':
				if (y > tY && y < tY + tH) {
					if (x > tX && x < tX + tW/2) { r = {num: global.bonexesOnTable[i].bone.getNum1(), index: i, t: 'left'}; }
					else if (x > tX + tW/2 && x < tX + tW) { r = {num: global.bonexesOnTable[i].bone.getNum2(), index: i, t: 'right'}; }
				}
				break;
		}
	}
	if (r !== null) {
		global.resourceHolder['debug'] = r.num + ' at bonexesOnTable ' + r.index + ' to direction ' + r.t;
	}
	return r;
}
function touchBoneInHand(x, y, resize) {
	for (var i = 0; i < global.bonesInHand.length; i ++) {
		var hW = resize.boneScreenWidthInHand;
		var hH = resize.boneScreenHeightInHand;
		var hX = resize.screenWidth / (global.bonesInHand.length + 1) * (i + 1) - hW/2;
		var hY = resize.screenHeight * 5 / 6 - hH/2;
		if (x > hX && x < hX + hW && y > hY && y < hY + hH) { return i; }
	}
	return null;
}

/* get integer random number */
function getRandom(min, max) {	// between min and max, including both
	return parseInt(Math.random() * (max - min + 1)) + min;
}
