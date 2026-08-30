/* === Frontend Track App === */

var frontendTracks = {
  html: {
    title: 'HTML',
    icon: 'fa-brands fa-html5',
    color: '#e34f26',
    chapters: []
  },
  css: {
    title: 'CSS',
    icon: 'fa-brands fa-css3-alt',
    color: '#1572b6',
    chapters: []
  },
  javascript: {
    title: 'JavaScript',
    icon: 'fab fa-js',
    color: '#f7df1e',
    chapters: []
  },
  react: {
    title: 'React',
    icon: 'fa-brands fa-react',
    color: '#61dafb',
    chapters: []
  }
};

function loadTrack(trackName) {
  var track = frontendTracks[trackName];
  if (!track) return;
  
  document.querySelectorAll('.frontend-sidebar .sidebar-item').forEach(function(item) {
    item.classList.remove('active');
  });
  
  var container = document.getElementById('frontendContainer');
  if (container) {
    container.innerHTML = '<div class="concept-box"><h3>' + track.title + ' Track</h3><p>Loading ' + track.title + ' chapters...</p></div>';
  }
}

function showFrontendChapter(trackName, chapterIdx) {
  if (typeof Progress === 'undefined') {
    var container = document.getElementById('frontendContainer-' + trackName) || document.getElementById('frontendContainer');
    if (container) container.innerHTML = '<div class="concept-box"><h3>Loading error</h3><p>Progress system unavailable. Please refresh the page.</p></div>';
    return;
  }
  var track = frontendTracks[trackName];
  if (!track || !track.chapters[chapterIdx]) return;
  
  var chapter = track.chapters[chapterIdx];
  var containerId = 'frontendContainer-' + trackName;
  var container = document.getElementById(containerId) || document.getElementById('frontendContainer');
  if (!container) return;
  
  var completed = Progress.getFrontendCompleted(trackName);
  var isComplete = completed.indexOf(chapterIdx) !== -1;
  
  var prevBtn = chapterIdx > 0 ? '<button class="btn btn-outline" onclick="showFrontendChapter(\'' + trackName + '\',' + (chapterIdx - 1) + ')"><i class="fas fa-arrow-left"></i> Previous</button>' : '<span></span>';
  var nextBtn = chapterIdx < track.chapters.length - 1 ? '<button class="btn btn-primary" onclick="showFrontendChapter(\'' + trackName + '\',' + (chapterIdx + 1) + ')">Next <i class="fas fa-arrow-right"></i></button>' : '<span></span>';
  var completeBtn = '<button class="btn ' + (isComplete ? 'btn-secondary' : 'btn-outline') + '" onclick="markFrontendComplete(\'' + trackName + '\',' + chapterIdx + ')"><i class="fas fa-check"></i> ' + (isComplete ? 'Completed' : 'Mark Complete') + '</button>';
  
  container.innerHTML = `
    <div class="frontend-header">
      <h1><i class="${track.icon}" style="color:${track.color}"></i> Chapter ${chapterIdx + 1}: ${chapter.title}</h1>
      <span class="badge ${chapter.difficultyClass}">${chapter.difficulty}</span>
    </div>
    ${chapter.content}
    <div class="frontend-nav" style="display:flex;justify-content:space-between;margin-top:40px;padding-top:20px;border-top:1px solid var(--border);gap:12px;flex-wrap:wrap">${prevBtn}${completeBtn}${nextBtn}</div>
  `;
  
  document.querySelectorAll('.frontend-sidebar .sidebar-item').forEach(function(item) {
    item.classList.remove('active');
  });
  var items = document.querySelectorAll('.frontend-sidebar .sidebar-item');
  if (items[chapterIdx]) items[chapterIdx].classList.add('active');

  // Close sidebar on mobile after chapter selection
  var activePage = document.querySelector('.page.active');
  if (activePage) {
    var sidebarEl = activePage.querySelector('.frontend-sidebar');
    var backdropEl = activePage.querySelector('.frontend-sidebar-backdrop');
    if (sidebarEl && window.innerWidth <= 768) sidebarEl.classList.remove('open');
    if (backdropEl && window.innerWidth <= 768) backdropEl.classList.remove('open');
  }

  window.scrollTo(0, 0);
}

function markFrontendComplete(trackName, chapterIdx) {
  Progress.markFrontendComplete(trackName, chapterIdx);
  showFrontendChapter(trackName, chapterIdx);
}

function toggleFrontendSidebar() {
  var activePage = document.querySelector('.page.active');
  if (!activePage) {
    var sidebar = document.querySelector('.frontend-sidebar');
    var backdrop = document.querySelector('.frontend-sidebar-backdrop');
    if (sidebar) sidebar.classList.toggle('open');
    if (backdrop) backdrop.classList.toggle('open');
    return;
  }
  var sidebar = activePage.querySelector('.frontend-sidebar');
  var backdrop = activePage.querySelector('.frontend-sidebar-backdrop');
  if (sidebar) sidebar.classList.toggle('open');
  if (backdrop) backdrop.classList.toggle('open');
}

function toggleMobileMenu() {
  var navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('open');
}

function toggleNavDropdown(e) {
  if (window.innerWidth > 768) return;
  e.preventDefault();
  var dropdown = e.currentTarget.closest('.nav-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('open');
    var navLinks = dropdown.querySelector('.nav-links');
    if (navLinks) navLinks.classList.remove('open');
  }
}

function toggleTheme() {
  try {
    var html = document.documentElement;
    var current = html.getAttribute('data-theme') || 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    var icon = document.querySelector('.theme-btn i');
    if (icon) {
      icon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
  } catch(e) {
    console.error('toggleTheme error:', e);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var saved = localStorage.getItem('theme');
  if (saved !== 'dark' && saved !== 'light') saved = 'light';
  document.documentElement.setAttribute('data-theme', saved);
  var icon = document.querySelector('.theme-btn i');
  if (icon) {
    icon.className = saved === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
});
