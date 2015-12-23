/*
 * @file easy_domin_model.js
 * @version 0.1.1
 * @author ginger
 * @brief easy domino model javascript part
 */
 
/*
 * @interface
 * Bone(n1, n2) 
 * 				: 	- n1 and n2 are the two number in the bone
 * 				: getNum1() - get the smaller number
 *				: getNum2() - get the bigger number
 * Boneyard(_branchends, _playerNames, _scores, _strategy) 
 * 				: 	- _branchends 	= [0, 0] if null
 *					- _playerNames 		= ['player1'] if null
 *					- _scores 		= [] if null
 * 					- _strategy		= always return 1
 * 					_strategy should be an object with function signed 
 * 					getScoreForSend(branchendIndex, bone, direct), which return the score the player
 * 					should earn by send target bone to target branchend in target direction
 * 				: getBranchends() 	- get branchend list
 * 				: getPlayers() 		- get player list
 * 				: getScores() 		- get socre list
 * 				: sendToBranchend(branchendIndex, bone, direct, playerName) 
 * 					- send a bone to target branchend, horizontal('h') or vertical('v')
 *					- by target player. And vertical direction means this bone will be a spinner.
 * 				: scoreTo(playerName, score) 
 * 					- add target score to target player, score can be negative
 *					- score must be integer cause js has problem when dealing with float
 * 					- float will be deal with parseInt(), which means [-]10.9 === [-]10
 * Player(_playerName, _bones)
 * 				:	- _playerName	= 'player1' if null
 * 					- _bones		= [] if null
 * 				: getPlayerName()	- getter
 * 				: getPlayerBones()	- getter
 * 				: addBones(newbones)
 * 					- add bones to player's bones in hand
 * 				: setBones(newbones)
 * 					- set player's bones in hand
 * 				: removeBone(boneIndex)
 * 					- remove target bone from player's bones in hand
 * 					- return bone removed
 */

/* bone class */
var Bone  = {
	createNew: function (n1, n2) {
		// create
		var object = {};
		
		// private
		var num1;
		var num2;
		
		// public
		object.getNum1 = function () { return num1; };
		object.getNum2 = function () { return num2; };
		
		// constructor
		{
			if (n1 < n2) { num1 = n1; num2 = n2; }
			else { num1 = n2; num2 = n1; }
		}
		
		// return
		return object;
	}
};
/* boneyard class */
var Boneyard = {
	createNew: function(_branchends, _players, _scores, _strategy) {
		// create
		var object = {};
		
		// private
		var branchends;	// branch end list
		var players;	// player list
		var scores;		// score list
		var strategy;	// strategy for score
		
		// public
		object.getBranchends 		= function () {
											return branchends;
										};
		object.getPlayers			= function () {
											return players;
										};
		object.getScores 			= function () {
											return scores;
										};
		object.sendToBranchend		= function (branchendIndex, bone, direct, playerName) {
											/*var oldend = branchends[branchendIndex], newend;
											// check number
											if (bone.getNum1() === oldend) { newend = bone.getNum2(); }
											else if (bone.getNum2() === oldend) { newend = bone.getNum1(); }
											else { throw new Error('Wrong bone !'); }
											// check direction
											if (direct === 'h') {
												branchends[branchendIndex] = newend;
											} else if (direct === 'v') {
												branchends[branchendIndex] = newend;
												branchends[branchends.length] = newend;
											} else { throw new Error('Wrong direction !'); }*/
											// score if strategy exists
											if (strategy !== null) {
												this.scoreTo(playerName, strategy.getScoreForSend(branchendIndex, bone, direct));
											}
										};
		object.scoreTo				= function (playerName, score) {
											if (typeof(scores[playerName]) === 'undefined') { scores[playerName] = 0; }
											scores[playerName] = parseInt(scores[playerName]) + parseInt(score);
										};
		
		// constructor 
		{
			// parameters
			if (_branchends !== null && typeof(_branchends) !== 'undefined' ) {
				branchends 	= _branchends.slice();
			} else {
				// default branchends
				branchends 	= [0, 0];
			}
			
			if (_players !== null && typeof(_players) 	!== 'undefined' ) {
				players = _players.slice();	
			} else {
				// default players
				players = [Player.createNew()];
			}
			
			if (_scores 	!== null && typeof(_scores) 	!== 'undefined' ) {
				scores 		= _scores.slice();
			} else {
				// default scores
				scores = [];
			}
			
			if (_strategy 	!== null && typeof(_strategy) 	!== 'undefined' ) {
				strategy	= _strategy; 
			} else {
				// default strategy
				strategy 	= {};
				strategy.getScoreForSend = function(branchendIndex, bone, direct) {
					return 1;
				};
			}
		}
		
		// return
		return object;
	}
};
/* player class */
var Player  = {
	createNew: function (_playerName, _bones) {
		// create
		var object = {};
		
		// private
		var playerName;		// player name
		var bones;			// bones the player holding in hand
		
		// public
		object.getPlayerName 	= function () { return playerName; };
		object.getPlayerBones 	= function () { return bones; };
		object.addBones			= function (newbones) {
										for (var i = 0; i < newbones.length; i ++) {
											bones.push(newbones[i]);
										}
									};
		object.setBones			= function (newbones) {
										if (newbones !== null && typeof(newbones) !== 'undefined') {
											bones = newbones
										} else { throw new Error('Wrong new bones !'); }
									};
		object.removeBone		= function (boneIndex) {
										return bones.splice(boneIndex, 1)[0];
									};
		
		// constructor
		{
			if (_playerName !== null && typeof(_playerName) !== 'undefined') {
				playerName 	= _playerName;
			} else {
				playerName 	= 'player1';
			}
			if (_bones		!== null && typeof(_bones)		!== 'undefined') {
				bones 		= _bones.slice();
			} else {
				bones 		= [];
			}
		}
		
		// return
		return object;
	}
};

