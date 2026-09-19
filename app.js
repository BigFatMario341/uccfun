// ========== MOCK DATA ==========
const EMOJIS = ['🐸', '🚀', '💎', '🔥', '🐕', '🐱', '🦄', '👽', '🧠', '💸', '🌙', '⚡', '🍔', '🎮', '👑'];

const INITIAL_COINS = [
  {
    id: '1',
    name: 'Pepe UCC',
    ticker: 'PEPEUCC',
    desc: 'The original frog, now on UCC. Rare pepe energy only.',
    logo: '🐸',
    mcap: 42000,
    price: 0.000042,
    change: 128.5,
    created: Date.now() - 3600000 * 5,
  },
  {
    id: '2',
    name: 'Degen Dog',
    ticker: 'DDOG',
    desc: 'Just a dog that only knows how to ape. Woof or die.',
    logo: '🐕',
    mcap: 18500,
    price: 0.0000185,
    change: 45.2,
    created: Date.now() - 3600000 * 2,
  },
  {
    id: '3',
    name: 'Moon Cat',
    ticker: 'MCAT',
    desc: 'This cat is going to the moon. No brakes.',
    logo: '🐱',
    mcap: 89000,
    price: 0.000089,
    change: -12.3,
    created: Date.now() - 3600000 * 12,
  },
  {
    id: '4',
    name: 'Based Unicorn',
    ticker: 'BASED',
    desc: 'Magical and based. Rainbows and alpha only.',
    logo: '🦄',
    mcap: 6700,
    price: 0.0000067,
    change: 312.0,
    created: Date.now() - 1800000,
  },
  {
    id: '5',
    name: 'Alien Pump',
    ticker: 'ALIEN',
    desc: 'They are among us. Buying the dip from space.',
    logo: '👽',
    mcap: 153000,
    price: 0.000153,
    change: 8.7,
    created: Date.now() - 3600000 * 48,
  },
  {
    id: '6',
    name: 'Brain Rot',
    ticker: 'ROT',
    desc: 'Your timeline, but as a coin. Infinite scroll energy.',
    logo: '🧠',
    mcap: 3200,
    price: 0.0000032,
    change: 89.1,
    created: Date.now() - 900000,
  },
  {
    id: '7',
    name: 'Cash Cow',
    ticker: 'COW',
    desc: 'Moo money, moo problems. Print it.',
    logo: '💸',
    mcap: 27800,
    price: 0.0000278,
    change: -5.4,
    created: Date.now() - 3600000 * 8,
  },
  {
    id: '8',
    name: 'Night Owl',
    ticker: 'OWL',
    desc: 'Trading at 3am hits different. Stay up.',
    logo: '🌙',
    mcap: 11200,
    price: 0.0000112,
    change: 22.0,
    created: Date.now() - 3600000 * 3,
  },
];

// ========== STATE ==========
let coins = [...INITIAL_COINS];
let currentUser = null;
let currentView = 'home';
let currentCoinId = null;
let tradeSide = 'buy';
let filter = 'trending';

// ========== DOM ==========
const authScreen = document.getElementById('auth-screen');
const app = document.getElementById('app');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const coinGrid = document.getElementById('coin-grid');
const exploreGrid = document.getElementById('explore-grid');
const toastEl = document.getElementById('toast');

// ========== HELPERS ==========
function formatMcap(n) {
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + n.toFixed(0);
}

function formatPrice(p) {
  if (p < 0.00001) return p.toExponential(2) + ' UCC';
  return p.toFixed(8) + ' UCC';
}

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.remove('hidden');
  setTimeout(() => toastEl.classList.add('hidden'), 2800);
}

function randomEmoji() {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

// ========== AUTH ==========
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const isLogin = tab.dataset.tab === 'login';
    loginForm.classList.toggle('hidden', !isLogin);
    signupForm.classList.toggle('hidden', isLogin);
  });
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('login-user').value.trim() || 'degen';
  currentUser = {
    name: user.includes('@') ? user.split('@')[0] : user,
    balance: 1250.0,
    avatar: '🐸',
  };
  enterApp();
});

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('signup-user').value.trim() || 'newdegen';
  currentUser = {
    name: user,
    balance: 500.0,
    avatar: randomEmoji(),
  };
  showToast('Welcome! You got 500 UCC starter balance 🎉');
  enterApp();
});

function enterApp() {
  authScreen.classList.add('hidden');
  app.classList.remove('hidden');
  document.getElementById('user-name').textContent = currentUser.name;
  document.getElementById('user-avatar').textContent = currentUser.avatar;
  updateBalance();
  renderCoins();
  showView('home');
}

document.getElementById('logout-btn').addEventListener('click', () => {
  currentUser = null;
  app.classList.add('hidden');
  authScreen.classList.remove('hidden');
  document.getElementById('user-dropdown').classList.add('hidden');
});

document.getElementById('user-btn').addEventListener('click', () => {
  document.getElementById('user-dropdown').classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-menu')) {
    document.getElementById('user-dropdown').classList.add('hidden');
  }
});

function updateBalance() {
  document.getElementById('user-balance').textContent =
    currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ========== NAVIGATION ==========
function showView(view) {
  currentView = view;
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById('view-' + view).classList.remove('hidden');

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.view === view);
  });

  if (view === 'explore') renderExplore();
  if (view === 'home') renderCoins();
}

document.querySelectorAll('[data-view]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const v = el.dataset.view;
    if (v) showView(v);
  });
});

document.getElementById('logo-home').addEventListener('click', (e) => {
  e.preventDefault();
  showView('home');
});

document.getElementById('back-btn').addEventListener('click', () => {
  showView('home');
});

// ========== RENDER COINS ==========
function getSortedCoins() {
  let list = [...coins];
  if (filter === 'new') {
    list.sort((a, b) => b.created - a.created);
  } else if (filter === 'mcap') {
    list.sort((a, b) => b.mcap - a.mcap);
  } else if (filter === 'trending' || filter === 'live') {
    list.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  }
  return list;
}

function renderCoinCard(coin) {
  const changeClass = coin.change >= 0 ? 'up' : 'down';
  const changeStr = (coin.change >= 0 ? '+' : '') + coin.change.toFixed(1) + '%';
  return `
    <div class="coin-card" data-id="${coin.id}">
      <div class="coin-card-top">
        <div class="coin-logo">${coin.logo.startsWith('http') ? `<img src="${coin.logo}" alt="" />` : coin.logo}</div>
        <div class="coin-info">
          <h3>${escapeHtml(coin.name)}</h3>
          <span class="ticker">$${escapeHtml(coin.ticker)}</span>
        </div>
      </div>
      <div class="coin-stats">
        <span class="mcap">${formatMcap(coin.mcap)}</span>
        <span class="change ${changeClass}">${changeStr}</span>
      </div>
      <p class="coin-desc">${escapeHtml(coin.desc || '')}</p>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderCoins() {
  const list = getSortedCoins();
  coinGrid.innerHTML = list.map(renderCoinCard).join('');
  attachCardListeners(coinGrid);
}

function renderExplore() {
  const list = [...coins].sort((a, b) => b.mcap - a.mcap);
  exploreGrid.innerHTML = list.map(renderCoinCard).join('');
  attachCardListeners(exploreGrid);
}

function attachCardListeners(container) {
  container.querySelectorAll('.coin-card').forEach(card => {
    card.addEventListener('click', () => {
      openCoin(card.dataset.id);
    });
  });
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    renderCoins();
  });
});

// Search
document.getElementById('search-input').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) {
    renderCoins();
    return;
  }
  const filtered = coins.filter(c =>
    c.name.toLowerCase().includes(q) || c.ticker.toLowerCase().includes(q)
  );
  coinGrid.innerHTML = filtered.map(renderCoinCard).join('');
  attachCardListeners(coinGrid);
  showView('home');
});

// ========== COIN DETAIL ==========
function openCoin(id) {
  const coin = coins.find(c => c.id === id);
  if (!coin) return;
  currentCoinId = id;

  document.getElementById('detail-name').textContent = coin.name;
  document.getElementById('detail-ticker').textContent = '$' + coin.ticker;
  document.getElementById('detail-mcap').textContent = formatMcap(coin.mcap);
  document.getElementById('detail-price').textContent = formatPrice(coin.price);
  document.getElementById('detail-desc').textContent = coin.desc || 'No description.';

  const logoEl = document.getElementById('detail-logo');
  if (coin.logo.startsWith('http')) {
    logoEl.innerHTML = `<img src="${coin.logo}" alt="" />`;
  } else {
    logoEl.textContent = coin.logo;
  }

  const socials = document.getElementById('detail-socials');
  socials.innerHTML = '';
  if (coin.twitter) {
    socials.innerHTML += `<a href="https://x.com/${coin.twitter.replace('@','')}" target="_blank">𝕏 Twitter</a>`;
  }
  if (coin.tg) {
    socials.innerHTML += `<a href="https://${coin.tg}" target="_blank">Telegram</a>`;
  }

  tradeSide = 'buy';
  document.querySelectorAll('.trade-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.side === 'buy');
  });
  document.getElementById('trade-btn').textContent = 'Buy';
  document.getElementById('trade-amount').value = '';
  updateEstimate();

  showView('coin');
}

// Trade tabs
document.querySelectorAll('.trade-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    tradeSide = tab.dataset.side;
    document.querySelectorAll('.trade-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('trade-btn').textContent = tradeSide === 'buy' ? 'Buy' : 'Sell';
    updateEstimate();
  });
});

document.querySelectorAll('.quick-amounts button').forEach(btn => {
  btn.addEventListener('click', () => {
    const amt = btn.dataset.amt;
    const input = document.getElementById('trade-amount');
    if (amt === 'max') {
      input.value = currentUser.balance.toFixed(2);
    } else {
      input.value = amt;
    }
    updateEstimate();
  });
});

document.getElementById('trade-amount').addEventListener('input', updateEstimate);

function updateEstimate() {
  const amount = parseFloat(document.getElementById('trade-amount').value) || 0;
  const coin = coins.find(c => c.id === currentCoinId);
  if (!coin) return;
  const tokens = (amount / coin.price) * 0.99;
  document.getElementById('est-tokens').textContent =
    tokens > 1e6 ? (tokens / 1e6).toFixed(2) + 'M' :
    tokens > 1e3 ? (tokens / 1e3).toFixed(1) + 'K' :
    tokens.toFixed(0);
}

document.getElementById('trade-btn').addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('trade-amount').value) || 0;
  if (amount <= 0) {
    showToast('Enter an amount');
    return;
  }
  const coin = coins.find(c => c.id === currentCoinId);
  if (!coin) return;

  if (tradeSide === 'buy') {
    if (amount > currentUser.balance) {
      showToast('Not enough UCC');
      return;
    }
    currentUser.balance -= amount;
    coin.mcap += amount * 50;
    coin.price = coin.mcap / 1e9;
    coin.change = Math.min(coin.change + Math.random() * 15, 999);
    showToast(`Bought $${coin.ticker} for ${amount.toFixed(2)} UCC 🚀`);
  } else {
    const received = amount * 0.9;
    currentUser.balance += received;
    coin.mcap = Math.max(100, coin.mcap - amount * 40);
    coin.price = coin.mcap / 1e9;
    coin.change = Math.max(coin.change - Math.random() * 10, -99);
    showToast(`Sold $${coin.ticker} for ${received.toFixed(2)} UCC`);
  }

  updateBalance();
  document.getElementById('detail-mcap').textContent = formatMcap(coin.mcap);
  document.getElementById('detail-price').textContent = formatPrice(coin.price);
  document.getElementById('trade-amount').value = '';
  updateEstimate();
  renderCoins();
});

// ========== CREATE COIN ==========
document.getElementById('create-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('coin-name').value.trim();
  const ticker = document.getElementById('coin-ticker').value.trim().toUpperCase();
  const desc = document.getElementById('coin-desc').value.trim();
  const image = document.getElementById('coin-image').value.trim();
  const twitter = document.getElementById('coin-twitter').value.trim();
  const tg = document.getElementById('coin-tg').value.trim();

  if (!name || !ticker) {
    showToast('Name and ticker required');
    return;
  }

  const newCoin = {
    id: String(Date.now()),
    name,
    ticker,
    desc: desc || 'A brand new coin on UCC.fun',
    logo: image || randomEmoji(),
    mcap: 100 + Math.random() * 500,
    price: 0.0000001 + Math.random() * 0.000001,
    change: 0,
    created: Date.now(),
    twitter: twitter || null,
    tg: tg || null,
  };

  coins.unshift(newCoin);
  showToast(`$${ticker} launched successfully! 🎉`);
  document.getElementById('create-form').reset();
  openCoin(newCoin.id);
});

// ========== INIT ==========
// Stay on auth screen until login
