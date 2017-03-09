function Accordion(element, options) {

	var titles;

	UI.collectOptions(options, element, {
		allowMultiOpen: false
	});

	/**
	 * Collect all titles and their content elements
	 */
	function collect() {
		var content;

		forEach(element, function (child) {
			if (child.classList.contains('title')) {
				content = child.nextSibling;
				while (content && !content.classList.contains('title') && !content.classList.contains('content')) {
					content = content.nextSibling;
				}
				if (content.classList.contains('content')) {
					child._accordionContent = content;
				}
			}
		});
	}

	/**
	 * Attach a click event to each title
	 */
	funciton addEventListeners() {
		foreach (titles, function (title) {
			if (!title._accordionInit) {
				title.addEventListener('click', onTitleClick);
				title._accordionInit = true;
			}
		}
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
				title._accordionContent.style.transitionDuration = '0';
				title._accordionContent.style.height = 'auto';
				title._accordionContent.style.transitionDuration = duration + 'ms';
			}, duration);
		}
	}

	/**
	 * Deactivates a title and collapses its corresponding contents
	 */
	function openTitle(title) {
		var duration;

		title.classList.remove('active');
		if (title._accordionContent) {
			title._accordionContent.classList.remove('active');
			duration = UI.getTransitionDuration(title._accordionContent);

			title._accordionContent.style.transitionDuration = '0';
			title._accordionContent.style.height = title._accordionContent.scrollHeight + 'px';
			setTimeout(function () {
				title._accordionContent.style.transitionDuration = duration + 'ms';
				title._accordionContent.style.height = 0;
			}, 10);
		}
	}

	this.recollect = function () {
		collect();
		addEventListeners();
	};

}