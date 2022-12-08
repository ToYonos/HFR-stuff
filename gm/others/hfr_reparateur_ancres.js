var getElementByXpath = function(path, element) {
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (; item = xpr.iterateNext(); ) arr.push(item);
	return arr;
}

// return the first position of the value in the array, or -1 if not found
var searchInArray = function(value, array) {
	for(var i in array) {
		if (value == array[i]) return i;
	}
	return -1;
}

// current and final anchors
var currentAnchor = location.hash;
var finalAnchor = currentAnchor;

// table with the anchor of all messages
var allAnchors = getElementByXpath("//td[@class = 'messCase1']/div/a", document.getElementById("mesdiscussions"));
for (var i in allAnchors) {
	allAnchors[i] = allAnchors[i].hash;
}

// if the current anchor doesn't exist, set it to the message with the previous number
if (searchInArray(currentAnchor, allAnchors) == -1) {
	allAnchors.push(currentAnchor);
	allAnchors.sort();
	finalAnchor = allAnchors[searchInArray(currentAnchor, allAnchors) - 1];
}

// fix the anchor
location.hash = finalAnchor;
