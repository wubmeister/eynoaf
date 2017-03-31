var UI = {
	collectOptions: function (options, element, defaults) {
		var attr, key, i, value;

		for (i = 0; i < element.attributes.length; i++) {
			attr = element.attributes[i];
			if (attr.name.substr(0, 5) == 'data-') {
				key = attr.name.substr(5).replace(/-([a-zA-Z0-9])/g, function (m, m1) { return m1.toUpperCase(); });
				value = attr.value;
				if (value == 'true') {
					value = true;
				} else if (value == 'false') {
					value = false;
				}
				options[key] = value;
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
	},
	ajax: function (options) {
		var xhr, data;

		if ('url' in options) {
			xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				var response;

				if (this.readyState == 4) {
					if (this.status == 200) {
						if (this.responseText && (this.responseText[0] == '{' || this.responseText[0] == '[')) {
							response = JSON.parse(this.responseText);
						} else {
							response = this.responseText;
						}

						if ('success' in options) {
							options.success(response);
						}
					} else {
						if ('error' in options) {
							options.error(this, this.statusText, this.status);
						}
					}

					if ('complete' in options) {
						options.complete(this, this.statusText, this.status);
					}
				}
			};

			xhr.open(('method' in options) ? options.method.toUpperCase() : (('data' in options) ? 'POST' : 'GET'), options.url, true);
			if ('data' in options) {
				if (typeof options.data == 'object') {
					xhr.setRequestHeader('Content-Type: application/json');
					data = JSON.stringify(options.data);
				} else {
					xhr.setRequestHeader('Content-Type: application/x-www-form-urlencoded');
					data = options.data;
				}
				xhr.send(data);
			} else {
				xhr.send();
			}
		}
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
	} else if (collection instanceof NodeList || collection instanceof FileList) {
		for (index = 0; index < collection.length; index++) {
			if (callback(collection[index], index, collection) === false) {
				break;
			}
		}
	} else if (collection instanceof Element) {
		index = 0;
		for (child = collection.firstChild; child; child = child.nextSibling) {
			if (child.nodeType == Node.ELEMENT_NODE) {
				if (callback(child, index, collection) === false) {
					break;
				}
				index++;
			}
		}
	} else {
		for (index in collection) {
			if (callback(collection[index], index, collection) === false) {
				break;
			}
		}
	}
}