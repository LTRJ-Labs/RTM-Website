// MothNode main page: the only script is the small-screen menu.
(function () {
    'use strict';

    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    function setOpen(open) {
        links.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', function () {
        setOpen(!links.classList.contains('is-open'));
    });

    // Choosing a section closes the menu.
    links.addEventListener('click', function (event) {
        if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && links.classList.contains('is-open')) {
            setOpen(false);
            toggle.focus();
        }
    });
})();
