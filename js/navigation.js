function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  var activeLink = document.querySelector('[data-page="' + pageId + '"]');
  if (activeLink) activeLink.classList.add('active');
  document.getElementById('navLinks').classList.remove('open');
  document.querySelectorAll('.sidebar').forEach(s => s.classList.remove('open'));
  window.scrollTo(0, 0);

  var frontendMap = {
    'frontend-html': 'html',
    'frontend-css': 'css',
    'frontend-javascript': 'javascript',
    'frontend-react': 'react'
  };
  if (frontendMap[pageId] && typeof showFrontendChapter === 'function') {
    showFrontendChapter(frontendMap[pageId], 0);
  }
}

function toggleChatbot() {
  var panel = document.getElementById('chatPanel');
  var fab = document.getElementById('chatFab');
  if (!panel || !fab) return;
  var isOpen = panel.classList.contains('open');
  if (isOpen) {
    panel.classList.remove('open');
    fab.style.animation = '';
  } else {
    panel.classList.add('open');
    fab.style.animation = 'none';
    var input = document.getElementById('chatInput');
    if (input) input.focus();
  }
}

function toggleTheme() {
  try {
    var html = document.documentElement;
    var current = html.getAttribute('data-theme') || 'dark';
    var next;
    if (current === 'dark') next = 'light';
    else next = 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    var icon = document.querySelector('.theme-btn i');
    if (icon) {
      icon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
    var btn = document.querySelector('.theme-btn');
    if (btn) btn.title = next.charAt(0).toUpperCase() + next.slice(1) + ' Mode';
  } catch(e) {
    console.error('toggleTheme error:', e);
  }
}

function toggleMobileMenu() {
  var navLinks = document.getElementById('navLinks');
  var sidebar = document.getElementById('sidebar');
  navLinks.classList.toggle('open');
  if (sidebar) sidebar.classList.remove('open');
}

function closeNavDropdowns() {
  document.querySelectorAll('.nav-dropdown.open').forEach(function(d) {
    d.classList.remove('open');
  });
}

document.addEventListener('click', function(e) {
  if (window.innerWidth > 768) return;
  var navLinks = document.getElementById('navLinks');
  if (!navLinks || !navLinks.classList.contains('open')) return;
  if (!e.target.closest('.nav-links')) {
    navLinks.classList.remove('open');
    closeNavDropdowns();
  }
});

function toggleNavDropdown(e) {
  if (window.innerWidth > 768) return;
  e.stopPropagation();
  var dropdown = e.currentTarget.closest('.nav-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('open');
    var navLinks = dropdown.querySelector('.nav-links');
    if (navLinks) navLinks.classList.remove('open');
  }
}

function toggleSidebar() {
  var sidebars = document.querySelectorAll('.sidebar');
  var isDesktop = window.innerWidth > 768;
  sidebars.forEach(function(s) {
    if (isDesktop) {
      s.classList.toggle('closed');
    } else {
      s.classList.toggle('open');
    }
  });
}