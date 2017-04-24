// Normalization
if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}
if (!('Promise' in window)) {
	window.Promise = function Promise(executor) {
		var promise = this;

		this.resolvers = [];
		this.rejecters = [];
		this.isResolved = false;
		this.isRejected = false;
		this.resolvedValue = null;
		this.rejectedReason = null;

		function resolve(value) {
			var i;

			promise.resolvedValue = value;
			promise.isResolved = true;

			for (i = 0; i < promise.resolvers.length; i++) {
				promise.resolvers[i](value);
			}
		}

		function reject(reason) {
			var i;

			promise.resolvedReason = reason;
			promise.isRejected = true;

			for (i = 0; i < promise.rejecters.length; i++) {
				promise.rejecters[i](reason);
			}
		}

		executor(resolve, reject);
	}
	window.Promise.prototype.then = function (callback) {
		if (this.isResolved) {
			callback(this.resolvedValue);
		} else {
			this.resolvers.push(callback);
		}
	};
	window.Promise.prototype.catch = function (callback) {
		if (this.isRejected) {
			callback(this.rejectedReason);
		} else {
			this.rejecters.push(callback);
		}
	};
}

// UI utilities
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
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			if ('data' in options) {
				if (typeof options.data == 'object') {
					xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
					data = JSON.stringify(options.data);
				} else {
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					data = options.data;
				}
				xhr.send(data);
			} else {
				xhr.send();
			}
		}
	},
	closest: function (element, selector) {
		while (element && !element.matches(selector)) {
			element = element.parentElement;
		}
		return element;
	},
	createElement: function (spec, attrs) {
		var m, m2, i, tagName = 'div', el;

		if (m = spec.match(/^([a-zA-Z][a-zA-Z\-_:.]*)/)) {
			tagName = m[1];
		}

		el = document.createElement(tagName);

		m = spec.match(/#([a-zA-Z][a-zA-Z0-9\-_:.]*)/);
		if (m) {
			el.id = m[1];
		}

		m = spec.match(/(\.[a-zA-Z][a-zA-Z0-9\-_:.]*)+/);
		if (m) {
			el.className = m[0].substr(1).replace(/\./g, ' ');
		}

		m = spec.match(/\[[^=]+="[^"]*"\]/g);
		if (m) {
			for (i = 0; i < m.length; i++) {
				m2 = m[i].match(/\[([^=]+)="([^"]*)"\]/);
				el.setAttribute(m2[1], m2[2]);
			}
		}

		if (attrs) {
			for (i in attrs) {
				el.setAttribute(i, attrs[i]);
			}
		}

		return el;
	}
}

/**
 * Loops through a collection, calling the callback function for each element.
 *
 * Can loop through:
 *  - Arrays: callback(item, index, array)
 *  - NodeLists: callback(node, index, nodeList)
 *  - FileLists: callback(file, index, fileList)
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
	} else if ('length' in collection) {
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