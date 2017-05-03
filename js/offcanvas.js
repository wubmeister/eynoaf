var Offcanvas = {
    visible: null,
    show: function(selector) {
        var offcanvas = typeof selector == 'string' ? document.querySelector(selector) : selector;

        if (offcanvas) {
            if (this.visible) {
                this.hide();
            }
            offcanvas.classList.add('visible');
            this.visible = offcanvas;
        }
    },
    hide: function() {
        if (this.visible) {
            this.visible.classList.remove('visible');
            this.visible = null;
        }
    },
    toggle: function (selector) {
        var offcanvas = typeof selector == 'string' ? document.querySelector(selector) : selector;
        if (offcanvas) {
            if (!this.visible) {
                this.show(offcanvas);
            } else {
                this.hide();
            }
        }
    },
    onClick: function (e) {
        Offcanvas.show(this.getAttribute('href'));
    },
    bindEvents: function (linkSelector) {
        var links;

        linkSelector = linkSelector || '[data-toggle-offcanvas]';
        links = document.querySelectorAll(linkSelector);
        forEach(links, function (link) {
            link.addEventListener('click', Offcanvas.click);
        });
    }
};

window.addEventListener('click', function (e) {
    var el;

    if (Offcanvas.visible) {
        el = e.target;
        while (el && el != Offcanvas.visible) {
            el = el.parentElement;
        }
        if (!el) {
            e.preventDefault();
            Offcanvas.hide();
        }
    }
});

/*[jquery]
$.fn.offcanvas = function (action) {
    if (!action || ['show','hide','toggle'].indexOf(action) == -1) action = 'show';
    this.each(function () {
        Offcanvas[action](this);
    });
}
[/jquery]*/