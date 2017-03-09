function Tabs(element, options) {

	var panelContainer;

	// UI.collectOptions(options, element, {});

	panelContainer = element.querySelector('.panels');

	element.addEventListener('click', function (e) {
		var tabbar, tab, panel, allTabs, allPanels;

		tabbar = e.target;
		while (tabbar && tabbar != element && !tabbar.classList.contains('tabbar')) {
			if (tabbar.classList.contains('tab')) {
				tab = tabbar;
			}
			tabbar = tabbar.parentElement;
		}

		if (tabbar && tab) {
			panel = panelContainer.querySelector('[data-tab="' + tab.getAttribute('data-tab') + '"]');
			UI.setActiveChild(tabbar, tab, '.tab');
			if (panel) {
				UI.setActiveChild(panelContainer, panel, '.panel');
			}
		}
	});

}