function Drilldown(element, options) {
    var header, originalHeaderHTML;

    function onClick(e) {
        var el, item, menu, submenu, title;

        el = e.target;
        while (el && el != element && !el.classList.contains('caret')) {
            el = el.parentElement;
        }

        if (el && el != element) {
            e.preventDefault();

            if (el.classList.contains('left')) {
                submenu = element.querySelector('.ui.menu.active');
                if (submenu) {
                    menu = submenu;
                    while (menu && menu != element && !menu.classList.contains('inactive')) {
                        menu = menu.parentElement;
                    }

                    if (menu) {
                        item = menu;
                        while (item && item != element && !item.classList.contains('item')) {
                            item = item.parentElement;
                        }

                        if (item) {
                            title = item.querySelector('.title');
                        }

                        menu.classList.add('active');
                        menu.classList.remove('inactive');

                        if (!item || item == element) {
                            header.querySelector('.title').innerHTML = originalHeaderHTML;
                            header.querySelector('.caret').style.opacity = 0;
                        } else if (title) {
                            header.querySelector('.title').innerHTML = title.innerHTML;
                        }

                        setTimeout(function () {
                            submenu.classList.remove('active');
                        }, 200);
                    }
                }
            } else {
                menu = el;

                while (menu && menu != element && !menu.classList.contains('menu')) {
                    if (menu.classList.contains('item')) {
                        item = menu;
                    }
                    menu = menu.parentElement;
                }

                if (item && menu) {
                    submenu = item.querySelector('.ui.menu');
                    title = item.querySelector('.title');

                    if (submenu) {
                        menu.classList.add('inactive');
                        menu.classList.remove('active');
                        submenu.classList.add('active');
                        header.querySelector('.caret').style.opacity = 1;

                        if (title) {
                            header.querySelector('.title').innerHTML = title.innerHTML;
                        }
                    }
                }
            }
        }
    }

    element.addEventListener('click', onClick);

    header = element.querySelector('.header');
    if (!header || header.parentElement != element) {
        header = document.createElement('div');
        header.className = 'header';
        header.innerHTML = '<span class="left caret" style="opacity:0"></span> <span class="title">Drilldown</span>';
        originalHeaderHTML = 'Drilldown';
    } else {
        originalHeaderHTML = header.innerHTML;
        header.innerHTML = '<span class="left caret" style="opacity:0"></span> <span class="title">' + originalHeaderHTML + '</span>';
    }
    element.insertBefore(header, element.firstChild);
}