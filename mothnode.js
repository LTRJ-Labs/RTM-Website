/*
	MothNode — site scripts
	Layout originally derived from TemplateMo 599 "Noir Fashion" (https://templatemo.com/tm-599-noir-fashion).
*/

(function () {
	'use strict';

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* ------------------------------------------------------------ Hero carousel */

	var slides = document.querySelectorAll('.carousel-slide');
	var indicators = document.querySelectorAll('.indicator');

	if (slides.length > 1) {
		var currentSlide = 0;
		var slideTimer = null;

		var showSlide = function (index) {
			slides.forEach(function (slide, i) {
				slide.classList.toggle('active', i === index);
			});
			indicators.forEach(function (indicator, i) {
				indicator.classList.toggle('active', i === index);
				indicator.setAttribute('aria-selected', String(i === index));
			});
			currentSlide = index;
		};

		var startSlideShow = function () {
			if (reduceMotion || slideTimer) return;
			slideTimer = setInterval(function () {
				showSlide((currentSlide + 1) % slides.length);
			}, 6000);
		};

		var stopSlideShow = function () {
			clearInterval(slideTimer);
			slideTimer = null;
		};

		indicators.forEach(function (indicator, index) {
			indicator.addEventListener('click', function () {
				stopSlideShow();
				showSlide(index);
				startSlideShow();
			});
		});

		var carousel = document.querySelector('.hero-media');
		if (carousel) {
			carousel.addEventListener('mouseenter', stopSlideShow);
			carousel.addEventListener('mouseleave', startSlideShow);
			carousel.addEventListener('focusin', stopSlideShow);
			carousel.addEventListener('focusout', startSlideShow);
		}

		startSlideShow();
	}

	/* ------------------------------------------------------------ Mobile menu */

	var menuToggle = document.getElementById('menuToggle');
	var mobileNav = document.getElementById('mobileNav');

	if (menuToggle && mobileNav) {
		var setMenu = function (open) {
			menuToggle.classList.toggle('active', open);
			mobileNav.classList.toggle('active', open);
			menuToggle.setAttribute('aria-expanded', String(open));
		};

		menuToggle.addEventListener('click', function () {
			setMenu(!mobileNav.classList.contains('active'));
		});

		mobileNav.querySelectorAll('a').forEach(function (link) {
			link.addEventListener('click', function () {
				setMenu(false);
			});
		});

		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') setMenu(false);
		});
	}

	/* ------------------------------------------------------------ Navbar shadow + scroll spy */

	var navbar = document.getElementById('navbar');
	var navLinks = document.querySelectorAll('.nav-link');
	var sections = document.querySelectorAll('section[id]');

	if (navbar) {
		var updateNav = function () {
			var scrollY = window.pageYOffset;
			navbar.classList.toggle('scrolled', scrollY > 40);

			if (!sections.length || !navLinks.length) return;

			var navHeight = navbar.offsetHeight;
			var currentId = null;

			sections.forEach(function (section) {
				var top = section.offsetTop - navHeight - 16;
				if (scrollY >= top && scrollY < top + section.offsetHeight) {
					currentId = section.getAttribute('id');
				}
			});

			// Keep the first nav item lit while the user is still at the top.
			if (scrollY < 100) currentId = 'product';

			if (currentId) {
				navLinks.forEach(function (link) {
					link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
				});
			}
		};

		window.addEventListener('scroll', updateNav, { passive: true });
		window.addEventListener('resize', updateNav);
		updateNav();
	}

	/* ------------------------------------------------------------ Anchor scrolling with nav offset */

	document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
		var href = anchor.getAttribute('href');
		if (!href || href === '#') return;

		anchor.addEventListener('click', function (e) {
			var target = document.getElementById(href.slice(1));
			if (!target) return;

			e.preventDefault();
			var navHeight = navbar ? navbar.offsetHeight : 0;
			window.scrollTo({
				top: target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16,
				behavior: reduceMotion ? 'auto' : 'smooth'
			});
		});
	});
})();
