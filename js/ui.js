var UI = {
	collectOptions: function (options, element, defaults) {
		var attr, key, i;

		for (i = 0; i < element.attributes.length; i++) {
			attr = element.attributes[i];
			if (attr.name.substr(0, 5) == 'data-') {
				key = attr.name.substr(5).replace(/-([a-zA-Z0-9])/g, function (m, m1) { return m1.toUpperCase(); });
				options[key] = attr.value;
			}
		}

		for (key in defaults) {
			if (!(key in options)) {
				options[key] = defaults[key];
			}
		}

		return options;
	},
	setActiveChild: function (container, child, selector, activeClass) {
		var children, i;

		activeClass = activeClass || 'active';

		children = container.querySelectorAll(selector);
		for (i = 0; i < children.length; i++) {
			if (children[i] == child) {
				children[i].classList.add(activeClass);
			} else if (children[i].classList.contains(activeClass)) {
				children[i].classList.remove(activeClass)
			}
		}
	},
	getTransitionDuration: function (element) {
		var style, durations, delays, i, max;

		style = getComputedStyle(element);
		durations = style.transitionDuration.split(/\s*,\s*/).map(function (d) { return parseFloat(d) * 1000; });
		delays = style.transitionDuration.split(/\s*,\s*/).map(function (d) { return parseFloat(d) * 1000; });

		max = 0;
		for (i = 0; i < durations.length; i++) {
			if (durations[i] + delays[i] > max) {
				max = durations[i] + delays[i];
			}
		}

		return max;
	}
}

/**
 * Loops through a collection, calling the callback function for each element.
 *
 * Can loop through:
 *  - Arrays: callback(item, index, array)
 *  - NodeLists: callback(node, index, nodeList)
 *  - Objects: callback(value, key, object)
 *  - Nodes: callback(elementChild, index, node)
 *    > This will loop through all the _direct_ element child nodes
 *
 * @param mixed collection The collection to loop through
 * @param Function callback The callback function : function(element, indexOrKey, collection)
 */
function forEach(collection, callback) {
	var index, child;

	if (collection instanceof Array) {
		collection.forEach(callback);
	} else if (collection instanceof NodeList) {
		for (index = 0; index < collection.length; index++) {
			callback(collection[index], index, collection);
		}
	} else if (collection instanceof Element) {
		index = 0;
		for (child = collection.firstChild; child; child = child.nextSibling) {
			if (child.nodeType == Node.ELEMENT_NODE) {
				callback(child, index, collection);
				index++;
			}
		}
	} else {
		for (index in collection) {
			callback(collection[index], index, collection);
		}
	}
}