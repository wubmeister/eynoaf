function Embed(element, options) {
	var iframe, ratio, ratioEl;

	iframe = element.querySelector('iframe');

	if (iframe) {
		ratio = parseInt(iframe.getAttribute('height')) / parseInt(iframe.getAttribute('width'));
		ratioEl = document.createElement('div');
		ratioEl.className = 'ratio';
		ratioEl.style.paddingTop = (100 * ratio) + '%';
		element.insertBefore(ratioEl, iframe);
		iframe.removeAttribute('width');
		iframe.removeAttribute('height');
	}
}

(function () {
	embeds = document.querySelectorAll('.ui.embed');
	forEach(embeds, function (embed) {
		Embed(embed);
	});
})();