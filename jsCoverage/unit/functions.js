/* automatically generated by JSCoverage - do not edit */
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    _$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (typeof _$jscoverage !== 'object') {
  _$jscoverage = {};
}
if (! _$jscoverage['unit/functions.js']) {
  _$jscoverage['unit/functions.js'] = [];
  _$jscoverage['unit/functions.js'][8] = 0;
  _$jscoverage['unit/functions.js'][9] = 0;
  _$jscoverage['unit/functions.js'][11] = 0;
  _$jscoverage['unit/functions.js'][12] = 0;
  _$jscoverage['unit/functions.js'][13] = 0;
  _$jscoverage['unit/functions.js'][14] = 0;
}
_$jscoverage['unit/functions.js'].source = ["<span class=\"c\">/*</span>","<span class=\"c\"> * @file functions.js</span>","<span class=\"c\"> * @version 0.1.0</span>","<span class=\"c\"> * @author ginger</span>","<span class=\"c\"> * @brief functions for unit test</span>","<span class=\"c\"> */</span>"," "," <span class=\"k\">function</span> arrayEquals<span class=\"k\">(</span>arr1<span class=\"k\">,</span> arr2<span class=\"k\">)</span> <span class=\"k\">{</span>\t<span class=\"c\">// cannot compare nested arrays</span>","\t <span class=\"k\">return</span> arr1<span class=\"k\">.</span>join<span class=\"k\">()</span> <span class=\"k\">===</span> arr2<span class=\"k\">.</span>join<span class=\"k\">();</span>"," <span class=\"k\">}</span>"," <span class=\"k\">function</span> boneEquals<span class=\"k\">(</span>bone1<span class=\"k\">,</span> bone2<span class=\"k\">)</span> <span class=\"k\">{</span>","\t <span class=\"k\">if</span> <span class=\"k\">(</span>bone1<span class=\"k\">.</span>getNum1<span class=\"k\">()</span> <span class=\"k\">!==</span> bone2<span class=\"k\">.</span>getNum1<span class=\"k\">())</span> <span class=\"k\">{</span> <span class=\"k\">return</span> <span class=\"k\">false</span><span class=\"k\">;</span> <span class=\"k\">}</span>","\t <span class=\"k\">if</span> <span class=\"k\">(</span>bone1<span class=\"k\">.</span>getNum2<span class=\"k\">()</span> <span class=\"k\">!==</span> bone2<span class=\"k\">.</span>getNum2<span class=\"k\">())</span> <span class=\"k\">{</span> <span class=\"k\">return</span> <span class=\"k\">false</span><span class=\"k\">;</span> <span class=\"k\">}</span>","\t <span class=\"k\">return</span> <span class=\"k\">true</span><span class=\"k\">;</span>"," <span class=\"k\">}</span>"];
_$jscoverage['unit/functions.js'][8]++;
function arrayEquals(arr1, arr2) {
  _$jscoverage['unit/functions.js'][9]++;
  return (arr1.join() === arr2.join());
}
_$jscoverage['unit/functions.js'][11]++;
function boneEquals(bone1, bone2) {
  _$jscoverage['unit/functions.js'][12]++;
  if ((bone1.getNum1() !== bone2.getNum1())) {
    _$jscoverage['unit/functions.js'][12]++;
    return false;
  }
  _$jscoverage['unit/functions.js'][13]++;
  if ((bone1.getNum2() !== bone2.getNum2())) {
    _$jscoverage['unit/functions.js'][13]++;
    return false;
  }
  _$jscoverage['unit/functions.js'][14]++;
  return true;
}
