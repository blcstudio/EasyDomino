/*
 * @file test_easy_domin_model.js
 * @version 0.1.0
 * @author ginger
 * @brief unit test of easy domino model javascript part
 */
 
 /* unit test of bone class */
 test('bone class', function () {
	 var bone = Bone.createNew(2, 1);
	 ok(bone !== null, 'instantiate bone object');
	 ok(bone.getNum1() ===  1, 'get right (smaller) num1 from bone object');
	 ok(bone.getNum2() ===  2, 'get right (bigger) num2 from bone object');
 });
 
 /* unit test of boneyard class */
 test('boneyard class null create', function () {
	 var boneyard 	= Boneyard.createNew();
	 ok(boneyard 	!== null, 'instantiate boneyard object');
	 var _branchends= [0, 0];
	 ok(arrayEquals(boneyard.getBranchends(), _branchends), 'getBranchends() from null boneyard');
	 var _players	= [Player.createNew()];
	 ok(boneyard.getPlayers()[0].getPlayerName() === Player.createNew().getPlayerName(), 'getPlayers() from null boneyard');
	 var _scores 	= [];
	 ok(arrayEquals(boneyard.getScores(), _scores), 'getScores() from null boneyard');
 });
 test('boneyard class not null create', function () {
	 var _branchends 	= [1, 6];
	 var _players 		= [Player.createNew('jsf'), Player.createNew('wyq')];
	 var _scores 		= new Array(); _scores['jsf'] = 1; _scores['wyq'] = 9;
	 var boneyard = Boneyard.createNew(_branchends, _players, _scores);
	 ok(boneyard !== null, 'instantiate boneyard object');
	 ok(arrayEquals(boneyard.getBranchends(), _branchends), 'getBranchends() from not null boneyard');
	 ok(boneyard.getPlayers()[1].getPlayerName() === 'wyq', 'getPlayers() from not null boneyard');
	 ok(arrayEquals(boneyard.getScores(), _scores), 'getScores() from not null boneyard');
 });
 test('boneyard class score test', function () {
	 var boneyard = Boneyard.createNew(null, null, null);
	 ok(arrayEquals(boneyard.getScores(), []), 'scores initialization');
	 boneyard.scoreTo('player1', 19);
	 ok(boneyard.getScores()['player1'] === 19, 'score increasement');
	 boneyard.scoreTo('player1', -10);
	 ok(boneyard.getScores()['player1'] === 9, 'score decreasement');
	 boneyard.scoreTo('player1', 10.4);
	 ok(boneyard.getScores()['player1'] === 19, 'score add float');
	 boneyard.scoreTo('player1', -10.9);
	 ok(boneyard.getScores()['player1'] === 9, 'score minus float');
 });
 test('boneyard class send bone test', function() {
	 var boneyard = Boneyard.createNew();
	 
	 ok(arrayEquals(boneyard.getScores(), []), 'scores initialization');
	 var _branchends = [0, 0];
	 ok(arrayEquals(boneyard.getBranchends(), _branchends), 'branchends initialization');
	 
	 boneyard.sendToBranchend(0, Bone.createNew(0, 6), 'h', 'player1');
	 _branchends1	= [6, 0];
	 //ok(arrayEquals(boneyard.getBranchends(), _branchends1), 'branchend change');
	 ok(boneyard.getScores()['player1'] === 1, 'score change');
	 
	 /*
	 boneyard.sendToBranchend(0, Bone.createNew(1, 6), 'h', 'player1');
	 _branchends2	= [1, 0];
	 ok(arrayEquals(boneyard.getBranchends(), _branchends2), 'branchend change');
	 
	 boneyard.sendToBranchend(0, Bone.createNew(1, 1), 'v', 'player1');
	 _branchends3	= [1, 0, 1];
	 ok(arrayEquals(boneyard.getBranchends(), _branchends3), 'branchend spinner change');
	 
	 raises(function () { boneyard.sendToBranchend(0, Bone.createNew(1, 1), 'o', 'player1'); }
		, function (err) { return err.message === 'Wrong direction !'; }
		, 'send bone in wrong direction');
	 ok(arrayEquals(boneyard.getBranchends(), _branchends3), 'branchend after wrong opeartion');
	 
	 raises(function () { boneyard.sendToBranchend(0, Bone.createNew(6, 6), 'v', 'player1'); }
		, function (err) { return err.message === 'Wrong bone !'; }
		, 'send bone in wrong direction');*/
 });
 test('boneyard class strategy test', function() {
	 var strategy = new Object();
	 strategy.getScoreForSend = function (branchendIndex, bone, direct) {
		 if (direct === 'h') return 1;
		 else return 2;
	 };
	 var boneyard = Boneyard.createNew(null, null, null, strategy);
	 
	 ok(arrayEquals(boneyard.getScores(), []), 'scores initialization');
	 var _branchends = [0, 0];
	 ok(arrayEquals(boneyard.getBranchends(), _branchends), 'branchends initialization');
	 
	 boneyard.sendToBranchend(0, Bone.createNew(0, 6), 'h', 'player1');
	 _branchends1	= [6, 0];
	 //ok(arrayEquals(boneyard.getBranchends(), _branchends1), 'branchend change');
	 ok(boneyard.getScores()['player1'] === 1, 'score change');
	 
	 boneyard.sendToBranchend(0, Bone.createNew(6, 6), 'v', 'player1');
	 _branchends2	= [6, 0, 6];
	 //ok(arrayEquals(boneyard.getBranchends(), _branchends2), 'branchend spinner change');
	 ok(boneyard.getScores()['player1'] === 3, 'score change');
 });
 
 /* unit test of player class */
 test('player class null create', function () {
	 var player = Player.createNew();
	 ok(player !== null, 'instantiate player object');
	 ok(player.getPlayerName() === 'player1', 'getPlayerName() from null player');
	 var _bones = [];
	 ok(arrayEquals(player.getPlayerBones(), _bones), 'getPlayerBones() from null player');
 });
 test('player class part null create', function () {
	 var player = Player.createNew('player9');
	 ok(player !== null, 'instantiate player object');
	 ok(player.getPlayerName() === 'player9', 'getPlayerName() from null player');
	 var _bones = [];
	 ok(arrayEquals(player.getPlayerBones(), _bones), 'getPlayerBones() from null player');
 });
 test('player class not null create', function () {
	 var _bones = [Bone.createNew(0, 1), Bone.createNew(1, 6)];
	 var player = Player.createNew('jsf', _bones);
	 ok(player !== null, 'instantiate player object');
	 ok(player.getPlayerName() === 'jsf', 'getPlayerName() from not null player');
	 ok(arrayEquals(player.getPlayerBones(), _bones), 'getPlayerBones() from not null player');
 });
 test('player class bones in hand test', function () {
	 var _bones = [Bone.createNew(0, 1), Bone.createNew(1, 6)];
	 var player = Player.createNew('jsf', _bones);
	 ok(player !== null, 'instantiate player object');
	 ok(player.getPlayerName() === 'jsf', 'getPlayerName() from not null player');
	 ok(arrayEquals(player.getPlayerBones(), _bones), 'getPlayerBones() from not null player');
	 
	 player.addBones([Bone.createNew(0, 1), Bone.createNew(1, 6)]);
	 var _bones1 = [Bone.createNew(0, 1), Bone.createNew(1, 6), Bone.createNew(0, 1), Bone.createNew(1, 6)];
	 ok(arrayEquals(player.getPlayerBones(), _bones1), 'add bones');
	 
	 player.setBones(_bones);
	 ok(arrayEquals(player.getPlayerBones(), _bones), 'set bones');
	 
	 raises(function () { player.setBones(null); }
		, function (err) { return err.message === 'Wrong new bones !'; }
		, 'set bones to null');
	 
	 player.removeBone(0);
	 var _bones2 = [Bone.createNew(1, 6)];
	 ok(arrayEquals(player.getPlayerBones(), _bones2), 'remove bones');
	 
	 player.removeBone(0);
	 ok(arrayEquals(player.getPlayerBones(), []), 'remove all bones');
 });
 
 /* unit test for strategy implementation in js */
 /* test class */
 var StrategyTest  = {
	createNew: function (strategy) {
		// create
		var object = {};
		
		// private
		var param1;
		
		// public
		object.method1 = function () { 
			return strategy.doBeforeSend();
		};
		object.method2 = function () {
			strategy.doAfterBlock();
		};
		object.getParam1 = function () {
			return param1;
		};
		object.method3 = function() {
			param1 = strategy.doBeforeSend();
		};
		
		// constructor
		{
			param1 = 9;
		}
		
		// return
		return object;
	}
 };
 test('strategy implementation test', function () {
	 var strategy			= new Object();
	 strategy.doBeforeSend 	= function () { return 19; };
	 strategy.doAfterBlock 	= function () { param1 = 19; };
	 strategy.doAfterSend 	= function () { privateMethod(); };
	 var strategyTest		= StrategyTest.createNew(strategy);
	 
	 // strategy try 1, return directly
	 ok(strategyTest.method1() === 19, 'strategy implementation 1');
	 
	 // strategy try 2, operate private attribute
	 strategyTest.method2();
	 ok(strategyTest.getParam1() === 9, 'strategy not implementation 2');
	 
	 // strategy try 3, operate private attribute by private = strategy.method()
	 strategyTest.method3();
	 ok(strategyTest.getParam1() === 19, 'strategy implementation 3');
 });
 