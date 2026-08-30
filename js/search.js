function showSearchResults(query) {
  var results = document.getElementById('searchResults');
  if (!query || query.length < 2) { results.innerHTML = ''; results.classList.remove('show'); return; }
  var q = query.toLowerCase();
  var html = '';
  var seen = {};

  lessons.forEach(function(l, idx) {
    var titleMatch = l.title.toLowerCase().includes(q);
    var content = (typeof l.content === 'string') ? l.content.toLowerCase() : '';
    var codeMatch = content.includes(q);
    if (titleMatch || codeMatch) {
      var label = titleMatch ? 'Learn' : 'Code in chapter';
      if (!seen['lesson-' + idx]) {
        seen['lesson-' + idx] = true;
        html += '<div class="search-item" onclick="searchGoLearn(' + idx + ')"><i class="fas fa-book" style="color:var(--secondary)"></i><span>' + (idx + 1) + '. ' + l.title + '</span><span class="search-label">' + label + '</span></div>';
      }
    }
  });

  if (window.practiceData) {
    Object.keys(window.practiceData).forEach(function(catName) {
      var cat = window.practiceData[catName];
      var catId = categoryNameToId[catName] || 'basic';
      if (!cat || !cat.files) return;
      Object.keys(cat.files).forEach(function(fileName) {
        var match = false;
        if (fileName.toLowerCase().includes(q)) { match = true; }
        else {
          var fileData = cat.files[fileName];
          var code = '';
          if (typeof fileData === 'string') { code = fileData; }
          else if (fileData && typeof fileData === 'object') { code = fileData.code || fileData.content || JSON.stringify(fileData); }
          if (code.toLowerCase().includes(q)) match = true;
        }
        if (match && !seen['practice-' + fileName]) {
          seen['practice-' + fileName] = true;
          var safeFile = fileName.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
          var safeCat = catId ? catId.replace(/'/g, "\\'") : 'basic';
          html += '<div class="search-item" onclick="searchGoPractice(\'' + safeCat + '\',\'' + safeFile + '\')"><i class="fas fa-file-code" style="color:var(--primary)"></i><span>' + fileName + '</span><span class="search-label">' + catName + '</span></div>';
        }
      });
    });
  }

  if (window.javaproData) {
    window.javaproData.forEach(function(ch) {
      var match = false;
      if (ch.title.toLowerCase().includes(q)) { match = true; }
      else if (ch.content && ch.content.toLowerCase().includes(q)) { match = true; }
      if (match && !seen['javapro-' + ch.id]) {
        seen['javapro-' + ch.id] = true;
        html += '<div class="search-item" onclick="searchGoJavaPro(' + ch.id + ')"><i class="fas fa-book" style="color:#e91e63"></i><span>Ch ' + ch.id + ': ' + ch.title + '</span><span class="search-label">JavaPro Book</span></div>';
      }
    });
  }

  if (typeof dsaTopics !== 'undefined') {
    Object.keys(dsaTopics).forEach(function(key) {
      var t = dsaTopics[key];
      if (!t) return;
      var titleMatch = key.toLowerCase().includes(q) || (t.title && t.title.toLowerCase().includes(q));
      var contentMatch = t.content && t.content.toLowerCase().includes(q);
      if (titleMatch || contentMatch) {
        if (!seen['dsa-' + key]) {
          seen['dsa-' + key] = true;
          var label = titleMatch ? 'DSA Topic' : 'In DSA code';
          var displayName = t.title || key.replace(/-/g, ' ');
          html += '<div class="search-item" onclick="searchGoDSA(\'' + key.replace(/'/g, "\\'") + '\')"><i class="fas fa-project-diagram" style="color:#27ae60"></i><span>' + displayName + '</span><span class="search-label">' + label + '</span></div>';
        }
      }
    });
  }

  if (typeof interviewQuestions !== 'undefined' && interviewQuestions.length) {
    interviewQuestions.forEach(function(qq) {
      var titleMatch = qq.title.toLowerCase().includes(q);
      var contentStr = (typeof qq.content === 'string') ? qq.content.toLowerCase() : '';
      var contentMatch = contentStr.includes(q);
      if (titleMatch || contentMatch) {
        if (!seen['interview-' + qq.id]) {
          seen['interview-' + qq.id] = true;
          var label = titleMatch ? 'Interview Q' : 'In answer';
          html += '<div class="search-item" onclick="searchGoInterview(' + qq.id + ')"><i class="fas fa-comments" style="color:#f39c12"></i><span>Q' + qq.id + ': ' + qq.title + '</span><span class="search-label">' + label + '</span></div>';
        }
      }
    });
  }

  if (typeof frontendTracks !== 'undefined') {
    Object.keys(frontendTracks).forEach(function(trackName) {
      var track = frontendTracks[trackName];
      if (!track || !track.chapters) return;
      track.chapters.forEach(function(ch, idx) {
        var titleMatch = ch.title.toLowerCase().includes(q);
        var contentMatch = ch.content && ch.content.toLowerCase().includes(q);
        if (titleMatch || contentMatch) {
          if (!seen['frontend-' + trackName + '-' + idx]) {
            seen['frontend-' + trackName + '-' + idx] = true;
            var label = titleMatch ? track.title : 'In ' + track.title;
            html += '<div class="search-item" onclick="searchGoFrontend(\'' + trackName + '\',' + idx + ')"><i class="fas fa-book" style="color:#61dafb"></i><span>' + track.title + ': ' + ch.title + '</span><span class="search-label">' + label + '</span></div>';
          }
        }
      });
    });
  }

  if (!html) { html = '<div class="search-item" style="color:var(--text-muted);cursor:default">No results found</div>'; }
  results.innerHTML = html;
  results.classList.add('show');
}

function searchGoLearn(idx) {
  hideSearchResults();
  document.getElementById('searchInput').value = '';
  showPage('learn');
  showLesson(idx);
}

function searchGoPractice(catId, fileName) {
  hideSearchResults();
  document.getElementById('searchInput').value = '';
  showPage('practice-code');
  showPracticeFile(catId, fileName);
}

function searchGoJavaPro(id) {
  hideSearchResults();
  document.getElementById('searchInput').value = '';
  showPage('javapro');
  showJavaProChapter(null, id);
}

function searchGoDSA(topicId) {
  hideSearchResults();
  document.getElementById('searchInput').value = '';
  showPage('dsa');
  var item = document.querySelector('#dsaSidebar .sidebar-item[onclick*=\'' + topicId + '\']');
  showDSATopic(item || document.querySelector('#dsaSidebar .sidebar-item'), topicId);
}

function searchGoInterview(id) {
  hideSearchResults();
  document.getElementById('searchInput').value = '';
  showPage('interview-questions');
  var item = document.querySelector('#interviewSidebar .sidebar-item[onclick*=\'' + id + ',this\']');
  showInterviewQuestion(id, item);
}

function searchGoFrontend(trackName, chapterIdx) {
  hideSearchResults();
  document.getElementById('searchInput').value = '';
  var pageMap = {
    'html': 'frontend-html',
    'css': 'frontend-css',
    'javascript': 'frontend-javascript',
    'react': 'frontend-react'
  };
  showPage(pageMap[trackName] || 'frontend-html');
  showFrontendChapter(trackName, chapterIdx);
}

function hideSearchResults() {
  var el = document.getElementById('searchResults');
  if (el) { el.innerHTML = ''; el.classList.remove('show'); }
}

document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('input', function() { showSearchResults(this.value); });
    input.addEventListener('focus', function() { showSearchResults(this.value); });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { hideSearchResults(); this.blur(); }
    });
  }
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-box')) { hideSearchResults(); }
  });
});

// Group search results by category
function groupSearchResults(results) {
  var groups = { 'Java': [], 'DSA': [], 'Practice': [], 'Interview': [], 'Book': [], 'Frontend': [] };
  results.forEach(function(r) {
    if (r.type === 'java' || r.type === 'chapter') groups['Java'].push(r);
    else if (r.type === 'dsa') groups['DSA'].push(r);
    else if (r.type === 'practice') groups['Practice'].push(r);
    else if (r.type === 'interview') groups['Interview'].push(r);
    else if (r.type === 'book' || r.type === 'javapro') groups['Book'].push(r);
    else if (r.type === 'frontend') groups['Frontend'].push(r);
    else groups['Java'].push(r);
  });
  return groups;
}

// Keyboard navigation for search results
(function() {
  var selectedIdx = -1;
  document.addEventListener('keydown', function(e) {
    var results = document.getElementById('searchResults');
    var items = results ? results.querySelectorAll('.search-item') : [];
    if (items.length === 0) return;
    var input = document.getElementById('searchInput');
    if (!input || document.activeElement !== input) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIdx = Math.min(selectedIdx + 1, items.length - 1);
      items.forEach(function(item, i) { item.style.background = i === selectedIdx ? 'var(--surface)' : ''; });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIdx = Math.max(selectedIdx - 1, 0);
      items.forEach(function(item, i) { item.style.background = i === selectedIdx ? 'var(--surface)' : ''; });
    } else if (e.key === 'Enter' && selectedIdx >= 0 && items[selectedIdx]) {
      e.preventDefault();
      items[selectedIdx].click();
    }
  });
  if (document.getElementById('searchInput')) {
    document.getElementById('searchInput').addEventListener('input', function() { selectedIdx = -1; });
  }
})();