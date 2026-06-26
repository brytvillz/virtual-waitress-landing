const nav = document.getElementById('lpNav');
const hamburger = document.getElementById('lpNavHamburger');
const mobileMenu = document.getElementById('lpMobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });
}

const io = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (i * 60) + 'ms';
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ── Pricing toggle ──────────────────────────────────────────────────────────

const PRICES = {
  growth: {
    ngn: { monthly: '4,900', '6month': '4,700', annual: '4,000' },
    usd: { monthly: '5',     '6month': '4.50',  annual: '4'     },
  },
  pro: {
    ngn: { monthly: '15,000', '6month': '14,700', annual: '13,500' },
    usd: { monthly: '12',     '6month': '11',      annual: '10'    },
  },
};

const CYCLE_LABEL = {
  monthly:  'per month',
  '6month': 'per month, billed every 6 months',
  annual:   'per month, billed annually',
};

let activeCurrency = 'ngn';
let activeCycle    = 'monthly';

function updatePrices() {
  const sym = activeCurrency === 'ngn' ? '₦' : '$';
  document.querySelectorAll('.lp-price-sym').forEach(el => el.textContent = sym);
  const gEl = document.getElementById('priceGrowth');
  const pEl = document.getElementById('pricePro');
  const gcEl = document.getElementById('cycleGrowth');
  const pcEl = document.getElementById('cyclePro');
  if (gEl) gEl.textContent = PRICES.growth[activeCurrency][activeCycle];
  if (pEl) pEl.textContent = PRICES.pro[activeCurrency][activeCycle];
  if (gcEl) gcEl.textContent = CYCLE_LABEL[activeCycle];
  if (pcEl) pcEl.textContent = CYCLE_LABEL[activeCycle];
}

document.querySelectorAll('.lp-currency-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lp-currency-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCurrency = btn.dataset.currency;
    updatePrices();
  });
});

document.querySelectorAll('.lp-cycle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lp-cycle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCycle = btn.dataset.cycle;
    updatePrices();
  });
});

// ── Hero Slider ──────────────────────────────────────────────────────────────

const slides      = document.querySelectorAll('.hero-slide');
const dots        = document.querySelectorAll('.hero-dot');
const progressBar = document.getElementById('heroProgress');
const prevBtn     = document.getElementById('heroPrev');
const nextBtn     = document.getElementById('heroNext');

const SLIDE_DURATION = 10000;
let currentSlide = 0;
let autoTimer    = null;
let progTimer    = null;
let progStart    = null;
let progElapsed  = 0;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function startProgress(remaining) {
  if (progressBar) {
    const startWidth = ((SLIDE_DURATION - remaining) / SLIDE_DURATION) * 100;
    progressBar.style.transition = 'none';
    progressBar.style.width = startWidth + '%';
    requestAnimationFrame(() => {
      progressBar.style.transition = `width ${remaining}ms linear`;
      progressBar.style.width = '100%';
    });
  }
}

function resetProgress() {
  if (progressBar) {
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
  }
}

function startAuto() {
  clearTimeout(autoTimer);
  resetProgress();
  progStart = Date.now();
  progElapsed = 0;
  startProgress(SLIDE_DURATION);
  autoTimer = setTimeout(() => {
    goToSlide(currentSlide + 1);
    startAuto();
  }, SLIDE_DURATION);
}

function pauseAuto() {
  clearTimeout(autoTimer);
  if (progStart !== null) {
    progElapsed = Date.now() - progStart;
  }
  if (progressBar) {
    const computed = getComputedStyle(progressBar).width;
    progressBar.style.transition = 'none';
    progressBar.style.width = computed;
  }
}

function resumeAuto() {
  const remaining = Math.max(0, SLIDE_DURATION - progElapsed);
  progStart = Date.now() - progElapsed;
  startProgress(remaining);
  autoTimer = setTimeout(() => {
    goToSlide(currentSlide + 1);
    startAuto();
  }, remaining);
}

if (slides.length) {
  goToSlide(0);
  startAuto();

  if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); startAuto(); });
  });

  const slider = document.querySelector('.lp-hero-slider');
  if (slider) {
    slider.addEventListener('mouseenter', pauseAuto);
    slider.addEventListener('mouseleave', resumeAuto);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goToSlide(currentSlide - 1); startAuto(); }
    if (e.key === 'ArrowRight') { goToSlide(currentSlide + 1); startAuto(); }
  });
}
