function ScrollableTopbar(element, options) {

	var lastPageYOffset = 0;

	options = options || {};
	UI.collectOptions(options, element, {
		treshold: 50
	});

	function onScroll() {
		if (lastPageYOffset < options.treshold && window.pageYOffset >= options.treshold) {
			element.classList.add('scrolled');
		} else if (lastPageYOffset >= options.treshold && window.pageYOffset < options.treshold) {
			element.classList.remove('scrolled');
		}

		lastPageYOffset = window.pageYOffset;
	}

	window.addEventListener('scroll', onScroll);

	onScroll();

}