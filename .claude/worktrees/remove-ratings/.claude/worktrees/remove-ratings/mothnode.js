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

	/* ------------------------------------------------------------ Reviews carousel */

	var reviewsTrack = document.querySelector('.reviews-track');
	var reviewCards = document.querySelectorAll('.reviews-track .review-card');
	var reviewsPrev = document.querySelector('.reviews-prev');
	var reviewsNext = document.querySelector('.reviews-next');

	if (reviewsTrack && reviewCards.length) {
		var activeReview = 0;
		var autoRotate = null;

		var goToReview = function (index) {
			activeReview = (index + reviewCards.length) % reviewCards.length;
			var card = reviewCards[activeReview];
			var offset = card.getBoundingClientRect().left - reviewsTrack.getBoundingClientRect().left + reviewsTrack.scrollLeft;
			reviewsTrack.scrollTo({ left: offset, behavior: reduceMotion ? 'auto' : 'smooth' });
		};

		var stopAutoRotate = function () {
			clearInterval(autoRotate);
			autoRotate = null;
		};

		if (reviewsPrev) {
			reviewsPrev.addEventListener('click', function () {
				stopAutoRotate();
				goToReview(activeReview - 1);
			});
		}

		if (reviewsNext) {
			reviewsNext.addEventListener('click', function () {
				stopAutoRotate();
				goToReview(activeReview + 1);
			});
		}

		if (!reduceMotion) {
			autoRotate = setInterval(function () {
				goToReview(activeReview + 1);
			}, 18000);
		}
	}

	/* ------------------------------------------------------------ Contact form
	   TODO: no backend is wired up. This currently reports success without
	   sending anything anywhere. Point it at a real endpoint before launch. */

	var contactForm = document.getElementById('contactForm');

	if (contactForm) {
		contactForm.addEventListener('submit', function (e) {
			e.preventDefault();

			var submitBtn = contactForm.querySelector('.form-submit');
			var honeypot = contactForm.querySelector('#honeypot');
			var isBot = honeypot && honeypot.value.trim() !== '';
			var originalText = submitBtn.textContent;

			submitBtn.textContent = 'Sending...';
			submitBtn.disabled = true;

			// Bots get the same visible response as humans, so they can't detect the trap.
			window.setTimeout(function () {
				if (!isBot) {
					// TODO: POST the form payload here.
				}

				submitBtn.textContent = 'Request sent';
				submitBtn.classList.add('is-sent');
				contactForm.reset();

				window.setTimeout(function () {
					submitBtn.textContent = originalText;
					submitBtn.classList.remove('is-sent');
					submitBtn.disabled = false;
				}, 3000);
			}, 1200);
		});
	}
})();
