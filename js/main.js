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
