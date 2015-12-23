/*
 * @file functions.js
 * @version 0.1.0
 * @author ginger
 * @brief functions for unit test
 */
 
 function arrayEquals(arr1, arr2) {	// cannot compare nested arrays
	 return arr1.join() === arr2.join();
 }
 function boneEquals(bone1, bone2) {
	 if (bone1.getNum1() !== bone2.getNum1()) { return false; }
	 if (bone1.getNum2() !== bone2.getNum2()) { return false; }
	 return true;
 }