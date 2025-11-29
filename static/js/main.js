/**
 * LightLoad - Minimal JavaScript
 * Only essential interactions, no heavy libraries
 */

(function() {
    'use strict';

    // Speed demo animation
    function initSpeedDemo() {
        const slowTimer = document.getElementById('slow-timer');
        const fastTimer = document.getElementById('fast-timer');
        const slowScreen = document.getElementById('slow-screen');
        const fastScreen = document.getElementById('fast-screen');
        const replayBtn = document.getElementById('demo-replay');

        if (!slowTimer || !fastTimer) return;

        let slowInterval, fastInterval;
        let slowTime = 0;
        let fastTime = 0;
        const slowTarget = 20.0;
        const fastTarget = 2.6;

        function runDemo() {
            // Reset
            slowTime = 0;
            fastTime = 0;
            slowTimer.textContent = '0.0s';
            fastTimer.textContent = '0.0s';

            if (slowScreen) {
                slowScreen.innerHTML = `
                    <div class="skeleton-loader">
                        <div class="skeleton-header"></div>
                        <div class="skeleton-hero"></div>
                        <div class="skeleton-content">
                            <div class="skeleton-line"></div>
                            <div class="skeleton-line short"></div>
                            <div class="skeleton-line"></div>
                        </div>
                    </div>`;
            }

            // Fast timer - completes quickly
            fastInterval = setInterval(function() {
                fastTime += 0.1;
                fastTimer.textContent = fastTime.toFixed(1) + 's';

                if (fastTime >= fastTarget) {
                    clearInterval(fastInterval);
                    fastTimer.textContent = fastTarget.toFixed(1) + 's';
                }
            }, 100);

            // Slow timer - takes much longer
            slowInterval = setInterval(function() {
                slowTime += 0.1;
                slowTimer.textContent = slowTime.toFixed(1) + 's';

                if (slowTime >= slowTarget) {
                    clearInterval(slowInterval);
                    slowTimer.textContent = slowTarget.toFixed(1) + 's';

                    // Finally show content on slow side
                    if (slowScreen) {
                        slowScreen.innerHTML = `
                            <div class="demo-content-preview">
                                <div class="preview-header"></div>
                                <div class="preview-hero"></div>
                                <div class="preview-text">
                                    <div class="preview-line"></div>
                                    <div class="preview-line"></div>
                                </div>
                            </div>`;
                    }
                }
            }, 100);
        }

        // Initial run when section comes into view
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    runDemo();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const demoSection = document.querySelector('.speed-demo-section');
        if (demoSection) {
            observer.observe(demoSection);
        }

        // Replay button
        if (replayBtn) {
            replayBtn.addEventListener('click', function() {
                clearInterval(slowInterval);
                clearInterval(fastInterval);
                runDemo();
            });
        }
    }

    // Form handling
    function initForms() {
        const forms = document.querySelectorAll('.audit-form');

        forms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                const urlInput = form.querySelector('input[name="website_url"]');
                const url = urlInput ? urlInput.value.trim() : '';

                if (!url) return;

                // Show simple confirmation (replace with actual API call)
                const button = form.querySelector('button[type="submit"]');
                const originalText = button.textContent;

                button.textContent = 'Analyzing...';
                button.disabled = true;

                // Simulate API call - replace with actual endpoint
                setTimeout(function() {
                    button.textContent = 'Check your email!';

                    setTimeout(function() {
                        button.textContent = originalText;
                        button.disabled = false;
                        urlInput.value = '';
                    }, 3000);
                }, 1500);
            });
        });
    }

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Fade-in animations on scroll
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.explainer-card, .cwv-metric, .step-card'
        );

        if (!animatedElements.length) return;

        // Add initial hidden state
        animatedElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    // Check for reduced motion preference
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        initForms();
        initSmoothScroll();

        if (!prefersReducedMotion()) {
            initSpeedDemo();
            initScrollAnimations();
        }
    });
})();
