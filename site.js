// MothNode site script: small-screen menu, in-view video playback, and the
// animation layer. The animation layer only runs when the inline script in the
// page <head> has put the js-anim class on <html>.
(function () {
    'use strict';

    var root = document.documentElement;

    // Menu ---------------------------------------------------------------
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');

    if (toggle && links) {
        var setOpen = function (open) {
            links.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
        };

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
    }

    // Videos -------------------------------------------------------------
    // Videos marked data-autoplay load and play only while on screen, so a
    // visitor who never scrolls that far does not download them. Visitors who
    // ask for reduced motion get ordinary controls and nothing moves unasked.
    var videos = document.querySelectorAll('video[data-autoplay]');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (videos.length) {
        if (reduceMotion || !('IntersectionObserver' in window)) {
            videos.forEach(function (video) {
                video.controls = true;
                video.preload = 'metadata';
            });
        } else {
            var videoObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    var video = entry.target;
                    if (entry.isIntersecting) {
                        var started = video.play();
                        // If the browser refuses to autoplay, fall back to controls.
                        if (started && started.catch) {
                            started.catch(function () { video.controls = true; });
                        }
                    } else {
                        video.pause();
                    }
                });
            }, { rootMargin: '200px 0px' });

            videos.forEach(function (video) { videoObserver.observe(video); });
        }
    }

    // Animation ----------------------------------------------------------
    if (!root.classList.contains('js-anim')) return;

    try {
        splitWords();
        setStaggerOrder();
        revealOnScroll();
        heroImage();
        heroParallax();
        navIndicator();
        // Tells the <head> script that everything is wired up. If this line is
        // never reached, that script removes js-anim and the page shows as static.
        window.__animReady = true;
    } catch (error) {
        root.classList.remove('js-anim');
        throw error;
    }

    // Wrap each word of a [data-reveal="words"] element in a mask (.w) and a
    // moving inner span (.wi), keeping ordinary spaces between them so the text
    // still wraps, balances, and reads aloud as before.
    function splitWords() {
        document.querySelectorAll('[data-reveal="words"]').forEach(function (element) {
            var words = element.textContent.replace(/\s+/g, ' ').trim().split(' ');
            var fragment = document.createDocumentFragment();

            words.forEach(function (word, index) {
                if (index) fragment.appendChild(document.createTextNode(' '));
                var mask = document.createElement('span');
                var inner = document.createElement('span');
                mask.className = 'w';
                inner.className = 'wi';
                inner.style.setProperty('--i', index);
                inner.textContent = word;
                mask.appendChild(inner);
                fragment.appendChild(mask);
            });

            element.textContent = '';
            element.appendChild(fragment);
            element.classList.add('is-split');
        });
    }

    // Number the reveal items inside each [data-stagger] group so the CSS can
    // delay them in order. Capped so items far down a long group do not lag.
    function setStaggerOrder() {
        document.querySelectorAll('[data-stagger]').forEach(function (group) {
            var index = 0;
            Array.prototype.forEach.call(group.children, function (child) {
                if (!child.hasAttribute('data-reveal')) return;
                child.style.setProperty('--i', Math.min(index, 5));
                index += 1;
            });
        });
    }

    // Add .is-in to each [data-reveal] element the first time it comes on
    // screen. Anything already above the screen (for example after following a
    // link straight to a lower section) is revealed at once, so scrolling back
    // up never finds blank space.
    function revealOnScroll() {
        var pending = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

        var reveal = function (element) {
            var index = pending.indexOf(element);
            if (index === -1) return; // already revealed
            pending.splice(index, 1);
            element.classList.add('is-in');
            observer.unobserve(element);
        };

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) reveal(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px' });

        pending.forEach(function (element) { observer.observe(element); });

        // The observer only reports elements that cross the screen. A jump that
        // skips past them (a restored scroll position on reload, the End key,
        // a dragged scrollbar) reports nothing, so after each scroll anything
        // left above the screen is revealed directly.
        var queued = false;
        var sweep = function () {
            queued = false;
            pending.slice().forEach(function (element) {
                if (element.getBoundingClientRect().bottom < 0) reveal(element);
            });
            if (!pending.length) window.removeEventListener('scroll', onScroll);
        };
        var onScroll = function () {
            if (queued) return;
            queued = true;
            window.requestAnimationFrame(sweep);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        sweep();
    }

    // Fade the hero image in once it has actually loaded (or failed), so the
    // settle-back zoom is not spent on an empty frame.
    function heroImage() {
        var image = document.querySelector('.hero-bg');
        if (!image) return;
        var show = function () { image.classList.add('is-loaded'); };
        if (image.complete) {
            show();
        } else {
            image.addEventListener('load', show);
            image.addEventListener('error', show);
        }
    }

    // Publish how far the hero has scrolled away as --hero-p (0 to 1); the CSS
    // uses it to move the image and the text panel at different speeds.
    function heroParallax() {
        var frame = document.querySelector('.hero-frame');
        if (!frame) return;
        var queued = false;

        var update = function () {
            queued = false;
            var progress = Math.min(Math.max(window.scrollY / frame.offsetHeight, 0), 1);
            frame.style.setProperty('--hero-p', progress.toFixed(4));
        };

        window.addEventListener('scroll', function () {
            if (queued) return;
            queued = true;
            window.requestAnimationFrame(update);
        }, { passive: true });

        update();
    }

    // Mark the navigation link for the section on screen, and slide a pill
    // behind it.
    function navIndicator() {
        var nav = document.querySelector('.site-nav nav');
        if (!nav) return;

        var linkFor = {};
        var sections = [];
        nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
            var section = document.getElementById(link.getAttribute('href').slice(1));
            if (!section) return;
            linkFor[section.id] = link;
            sections.push(section);
        });
        if (!sections.length) return;

        var pill = document.createElement('span');
        pill.className = 'nav-indicator';
        pill.setAttribute('aria-hidden', 'true');
        nav.insertBefore(pill, nav.firstChild);

        var current = null;

        var place = function () {
            if (!current) {
                pill.classList.remove('is-on');
                return;
            }
            var navBox = nav.getBoundingClientRect();
            var linkBox = current.getBoundingClientRect();
            pill.style.setProperty('--x', (linkBox.left - navBox.left) + 'px');
            pill.style.setProperty('--w', linkBox.width + 'px');
            pill.classList.add('is-on');
        };

        var setCurrent = function (link) {
            if (link === current) return;
            if (current) current.removeAttribute('aria-current');
            current = link;
            if (current) current.setAttribute('aria-current', 'true');
            place();
        };

        // A section counts as current while it covers a thin band just above
        // the middle of the screen.
        var visible = {};
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                visible[entry.target.id] = entry.isIntersecting;
            });
            var active = null;
            sections.forEach(function (section) {
                if (visible[section.id]) active = linkFor[section.id];
            });
            setCurrent(active);
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach(function (section) { observer.observe(section); });
        window.addEventListener('resize', place);
        // Link widths change once the web font arrives.
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    }
})();
