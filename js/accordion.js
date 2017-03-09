function Accordion(element, options) {

	var titles = [];

	options = options || {};
	UI.collectOptions(options, element, {
		allowMultiOpen: false
	});

	/**
	 * Collect all titles and their content elements
	 */
	function collect() {
		var title, oldDuration, style;

		forEach(element, function (child) {
			if (child.classList.contains('title')) {
				title = child;
				title._accordionInit = false;
				titles.push(title);
			} else if (child.classList.contains('content')) {
				if (title) {
					title._accordionContent = child;
					if (!child.classList.contains('active')) {
						style = getComputedStyle(child);
						child.classList.add('noanim');
						child.style.height = 0;
						child.classList.remove('noanim');
					}
				}
			}
		});
	}

	/**
	 * Attach a click event to each title
	 */
	function addEventListeners() {
		forEach(titles, function (title) {
			if (!title._accordionInit) {
				title.addEventListener('click', onTitleClick);
				title._accordionInit = true;
			}
		});
	}

	/**
	 * Fires when the user clicks on a title
	 */
	function onTitleClick(e) {
		var activeTitle;

		e.preventDefault();

		if (this.classList.contains('active')) {
			closeTitle(this);
		} else {
			if (!options.allowMultiOpen) {
				if (activeTitle = element.querySelector('.active.title')) {
					closeTitle(activeTitle);
				}
			}
			openTitle(this);
		}
	}

	/**
	 * Activates a title and expands its corresponding contents
	 */
	function openTitle(title) {
		var duration;

		title.classList.add('active');
		if (title._accordionContent) {
			title._accordionContent.classList.add('active');
			duration = UI.getTransitionDuration(title._accordionContent);

			// title._accordionContent.style.transitionDuration = '0';
			title._accordionContent.style.height = title._accordionContent.scrollHeight + 'px';
			setTimeout(function () {
				title._accordionContent.classList.add('noanim');
				title._accordionContent.style.height = 'auto';
				title._accordionContent.classList.remove('noanim');
			}, duration);
		}
	}

	/**
	 * Deactivates a title and collapses its corresponding contents
	 */
	function closeTitle(title) {
		var duration;

		title.classList.remove('active');
		if (title._accordionContent) {
			title._accordionContent.classList.remove('active');
			duration = UI.getTransitionDuration(title._accordionContent);

			title._accordionContent.classList.add('noanim');
			title._accordionContent.style.height = title._accordionContent.scrollHeight + 'px';
			setTimeout(function () {
				title._accordionContent.classList.remove('noanim');
				title._accordionContent.style.height = 0;
			}, 10);
		}
	}

	this.recollect = function () {
		collect();
		addEventListeners();
	};

	this.recollect();

}