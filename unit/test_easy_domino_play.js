/*
 * @file test_easy_domin_play.js
 * @version 0.2.0
 * @author ginger
 * @brief unit test of easy domino gameplay javascript part
 */

// for rewritten version 0.2.0 gameplay part
/* unit test of get random */
test('get random with range', function () {
	var min = 1, max = 19;
	var well = true;
	var _well = [];
	for (var i = 0; i < 1000; i ++) {
		var num = getRandom(min, max);
		if (num > max || num < min) well = false;
		_well[num] = true;
	}
	ok(well, 'random in range ' + min + ' - ' + max);
	for (var i = min; i < max; i ++) {
		ok(typeof(_well[i]) !== 'undefined' && _well[i] === true, 'has random = ' + i);
	}
});
/* unit test of bind part 
test('bind value to block', function () {
	bindValueToArea(0, 0, 10, 10, 'value');
	ok(getBindValueFromArea	(0, 0) === null		, 'get value from corner');
	ok(getBindValueFromArea	(0, 1) === null		, 'get value from border');
	ok(getBindValueFromArea	(9, 9) === 'value'	, 'get value from area');
	ok(removeBindValue		(9, 9) === 'value'	, 'get removed value');
	ok(getBindValueFromArea	(9, 9) === null		, 'value removed');
});*/
/* unit test of initialization */
test('initialize gameplay', function () {
	getGlobalSettings();
	initGamePlay();
	ok(global.boneHolder.getPlayerBones().length = (28 - global.playerBeginningBoneNum) * global.playerNameList.length, 'bones number right');
});