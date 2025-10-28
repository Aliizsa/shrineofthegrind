(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const header = document.getElementById('siteHeader');
        const navToggle = document.getElementById('navToggle');
        const nav = document.getElementById('primaryNav');
        const navLinks = nav ? Array.from(nav.querySelectorAll('.nav-link')) : [];
        const sections = document.querySelectorAll('main section[id]');
        const yearEl = document.getElementById('currentYear');
        const comingSoonStatus = document.getElementById('comingSoonStatus');
        let statusTimer = null;

        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }

        if (navToggle && nav) {
            navToggle.addEventListener('click', () => {
                const isOpen = nav.classList.toggle('open');
                navToggle.setAttribute('aria-expanded', String(isOpen));
            });

            document.addEventListener('click', (event) => {
                if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
                    nav.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        navLinks.forEach((link) => {
            const href = link.getAttribute('href') || '';
            if (href.startsWith('#')) {
                link.addEventListener('click', () => {
                    if (nav) {
                        nav.classList.remove('open');
                    }
                    if (navToggle) {
                        navToggle.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });

        if (header) {
            const updateHeaderState = () => {
                if (window.scrollY > 40) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            };

            updateHeaderState();
            window.addEventListener('scroll', updateHeaderState, { passive: true });
        }

        if (sections.length > 0 && navLinks.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        navLinks.forEach((link) => {
                            const href = link.getAttribute('href') || '';
                            const matches = href.startsWith('#') && href.slice(1) === id;
                            link.classList.toggle('active', matches);
                        });
                    }
                });
            }, {
                threshold: 0.5,
            });

            sections.forEach((section) => observer.observe(section));
        }

        if (comingSoonStatus) {
            const links = document.querySelectorAll('.music-link[data-coming-soon="true"]');
            links.forEach((link) => {
                link.setAttribute('aria-disabled', 'true');
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    const platform = link.dataset.platform || 'This release';
                    comingSoonStatus.textContent = `${platform} release coming soon.`;
                    comingSoonStatus.classList.add('visible');
                    clearTimeout(statusTimer);
                    statusTimer = setTimeout(() => {
                        comingSoonStatus.classList.remove('visible');
                    }, 2800);
                });
            });
        }
    });
}());
