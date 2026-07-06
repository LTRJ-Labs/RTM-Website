// JavaScript Document

/*

TemplateMo 599 Noir Fashion

https://templatemo.com/tm-599-noir-fashion

*/

 // Hero Carousel
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            // Remove active class from all slides and indicators
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // Add active class to current slide and indicator
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
            
            currentSlide = index;
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function startSlideShow() {
            slideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        // Start automatic slideshow
        if (slides.length > 0) {
            startSlideShow();
            
            // Manual navigation via indicators
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    stopSlideShow();
                    showSlide(index);
                    startSlideShow(); // Restart automatic slideshow
                });
            });

            // Pause on hover
            const carousel = document.querySelector('.hero-carousel');
            if (carousel) {
                carousel.addEventListener('mouseenter', stopSlideShow);
                carousel.addEventListener('mouseleave', startSlideShow);
            }
        }

        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const mobileNav = document.getElementById('mobileNav');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });

        // Navbar scroll effect and scroll spy
        const navbar = document.getElementById('navbar');
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        function updateActiveNav() {
            const scrollY = window.pageYOffset;
            const navHeight = navbar.offsetHeight;
            
            // Navbar background on scroll
            if (scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Scroll spy for active navigation
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - navHeight - 10;
                const sectionId = section.getAttribute('id');
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
            
            // Keep Product highlighted when the user is at the top of the landing page
            if (scrollY < 100) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#product') {
                        link.classList.add('active');
                    }
                });
            }
        }

        window.addEventListener('scroll', updateActiveNav);
        window.addEventListener('resize', updateActiveNav); // Update on resize
        updateActiveNav(); // Call on load

        // Category filter
        const tabButtons = document.querySelectorAll('.tab-btn');
        const collectionCards = document.querySelectorAll('.collection-card');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                // Update active button
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter cards
                collectionCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                        card.style.opacity = '1';
                        card.style.animation = '';
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                let target = null;
                if (targetId && targetId !== '#') {
                    try {
                        target = document.querySelector(targetId);
                    } catch (e) {
                        target = null;
                    }
                }
                
                if (target) {
                    // Get navbar height dynamically (it changes on medium screens)
                    const navHeight = navbar.offsetHeight;
                    let offsetTop;
                    
                    // If scrolling to home, go to top
                    if (targetId === '#home') {
                        offsetTop = 0;
                    } else {
                        offsetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                    }
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-content');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        // Contact form handling
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Honeypot anti-spam check
                const honeypot = contactForm.querySelector('#honeypot');
                const isSpam = honeypot && honeypot.value.trim() !== '';
                
                // Animate submit button
                const submitBtn = contactForm.querySelector('.form-submit');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.style.opacity = '0.7';
                submitBtn.disabled = true;
                
                if (isSpam) {
                    // Silent fail for bots: pretend it succeeded to prevent bot retry loops
                    setTimeout(() => {
                        submitBtn.textContent = 'Message Sent! ✓';
                        submitBtn.style.background = '#4CAF50';
                        
                        // Reset form
                        contactForm.reset();
                        
                        // Reset button after delay
                        setTimeout(() => {
                            submitBtn.textContent = originalText;
                            submitBtn.style.background = '';
                            submitBtn.style.opacity = '';
                            submitBtn.disabled = false;
                        }, 3000);
                    }, 1500);
                    return;
                }
                
                // Simulate sending for humans (replace with actual API call)
                setTimeout(() => {
                    submitBtn.textContent = 'Message Sent! ✓';
                    submitBtn.style.background = '#4CAF50';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button after delay
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = '';
                        submitBtn.style.opacity = '';
                        submitBtn.disabled = false;
                    }, 3000);
                }, 1500);
            });
        }

        // Reviews Carousel
        const reviewsTrack = document.querySelector('.testimonials-carousel-track');
        const reviewsCards = document.querySelectorAll('.testimonials-carousel-track .testimonial-card');
        const reviewsPrevBtn = document.querySelector('.reviews-prev');
        const reviewsNextBtn = document.querySelector('.reviews-next');
        
        if (reviewsTrack && reviewsCards.length > 0) {
            let activeIndex = 0;
            const totalReviews = reviewsCards.length;
            
            function updateCarousel(index) {
                if (index < 0) {
                    activeIndex = totalReviews - 1;
                } else if (index >= totalReviews) {
                    activeIndex = 0;
                } else {
                    activeIndex = index;
                }

                const card = reviewsCards[activeIndex];
                if (card) {
                    const cardRect = card.getBoundingClientRect();
                    const trackRect = reviewsTrack.getBoundingClientRect();
                    const offset = cardRect.left - trackRect.left + reviewsTrack.scrollLeft;
                    reviewsTrack.scrollTo({ left: offset, behavior: 'smooth' });
                }

                reviewsCards.forEach((reviewCard, idx) => {
                    reviewCard.classList.toggle('active', idx === activeIndex);
                });
            }
            
            if (reviewsPrevBtn) {
                reviewsPrevBtn.addEventListener('click', () => {
                    updateCarousel(activeIndex - 1);
                });
            }
            
            if (reviewsNextBtn) {
                reviewsNextBtn.addEventListener('click', () => {
                    updateCarousel(activeIndex + 1);
                });
            }

            let autoRotateInterval = setInterval(() => {
                updateCarousel(activeIndex + 1);
            }, 18000);

            const stopAutoRotate = () => {
                clearInterval(autoRotateInterval);
            };

            if (reviewsPrevBtn) reviewsPrevBtn.addEventListener('click', stopAutoRotate);
            if (reviewsNextBtn) reviewsNextBtn.addEventListener('click', stopAutoRotate);
        }


