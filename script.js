/* =========================================================
   CARRARA IA — SCRIPT
   ========================================================= */

/* --- LOADER --- */
(function () {
    const loader = document.getElementById('loader');
    const bar = document.getElementById('loaderProgress');

    window.addEventListener('load', () => {
        setTimeout(() => {
            bar.style.width = '100%';
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
                initAnimations();
            }, 400);
        }, 200);
    });

    document.body.style.overflow = 'hidden';
})();

/* --- CUSTOM CURSOR --- */
(function () {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.09;
        followerY += (mouseY - followerY) * 0.09;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
})();

/* --- NAVBAR --- */
(function () {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
})();

/* --- HERO CANVAS PARTICLES --- */
(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], mouse = { x: -1000, y: -1000 };
    const COUNT = 70;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    class Particle {
        constructor() { this.reset(true); }
        reset(init) {
            this.x = Math.random() * W;
            this.y = init ? Math.random() * H : Math.random() * H;
            this.r = Math.random() * 1.8 + .4;
            this.vx = (Math.random() - .5) * .4;
            this.vy = (Math.random() - .5) * .4;
            this.alpha = Math.random() * .5 + .15;
        }
        update() {
            const dx = this.x - mouse.x, dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                this.x += dx / dist * 1.2;
                this.y += dy / dist * 1.2;
            }
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset(false);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139,92,246,${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(139,92,246,${.15 * (1 - d / 120)})`;
                    ctx.lineWidth = .6;
                    ctx.stroke();
                }
            }
        }
    }

    function frame() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(frame);
    }
    frame();
})();

/* --- TYPING ANIMATION --- */
(function () {
    const el = document.getElementById('typingText');
    if (!el) return;
    const words = ['impressionam', 'vendem', 'convertem', 'encantam', 'se destacam'];
    let wi = 0, ci = 0, deleting = false, paused = false;

    function type() {
        if (paused) { setTimeout(type, 1800); paused = false; return; }
        const word = words[wi];
        if (!deleting) {
            el.textContent = word.slice(0, ++ci);
            if (ci === word.length) { paused = true; deleting = true; setTimeout(type, 100); return; }
            setTimeout(type, 80);
        } else {
            el.textContent = word.slice(0, --ci);
            if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 300); return; }
            setTimeout(type, 45);
        }
    }
    type();
})();

/* --- SCROLL ANIMATIONS (AOS-like) --- */
function initAnimations() {
    const items = document.querySelectorAll('[data-aos]');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const delay = parseInt(e.target.dataset.aosDelay || 0);
                setTimeout(() => e.target.classList.add('aos-in'), delay);
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
}

/* --- COUNTER ANIMATION --- */
(function () {
    const counters = document.querySelectorAll('.counter');
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animateCounter(e.target);
                io.unobserve(e.target);
            }
        });
    }, { threshold: .5 });
    counters.forEach(c => io.observe(c));

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 1600;
        const start = performance.now();
        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(ease * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
    }
})();


/* --- TILT EFFECT (service cards) --- */
(function () {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const tX = (y / rect.height) * 8;
            const tY = -(x / rect.width) * 8;
            card.style.transform = `translateY(-6px) rotateX(${tX}deg) rotateY(${tY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();

/* --- ACTIVE NAV ON SCROLL --- */
(function () {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
        });
        links.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }, { passive: true });
})();

/* --- CONTACT FORM --- */
(function () {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('button[type=submit]');
        const origHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = origHTML;
            btn.disabled = false;
            form.reset();
            success.classList.add('show');
            setTimeout(() => success.classList.remove('show'), 5000);
        }, 1600);
    });
})();

/* --- BACK TO TOP --- */
(function () {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* --- SMOOTH SCROLL FOR ANCHOR LINKS --- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

/* --- PHONE MASK --- */
(function () {
    const tel = document.getElementById('telefone');
    if (!tel) return;
    tel.addEventListener('input', () => {
        let v = tel.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
        else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
        tel.value = v;
    });
})();

/* --- CSS ANIMATION (fadeInUp for portfolio) --- */
(function () {
    const style = document.createElement('style');
    style.textContent = `@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`;
    document.head.appendChild(style);
})();

