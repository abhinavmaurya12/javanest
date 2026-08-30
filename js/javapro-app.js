function initJavaPro() {
  if (!window.javaproData) return;
  var list = document.getElementById('javaproChapterList');
  if (!list) return;
  var html = '';
  window.javaproData.forEach(function(ch) {
    html += '<div class="sidebar-item" onclick="showJavaProChapter(this,' + ch.id + ')"><i class="fas fa-file-alt" style="margin-right:6px;font-size:.8rem"></i>' + ch.id + '. ' + ch.title + '</div>';
  });
  list.innerHTML = html;
}

function showJavaProChapter(el, id) {
  if (!window.javaproData) return;
  var ch = window.javaproData.find(function(c) { return c.id === id; });
  if (!ch) return;
  
  // Close sidebar on mobile
  var sidebar = document.getElementById('javaproSidebar');
  if (sidebar) sidebar.classList.remove('open');
  
  var content = ch.content;
  var lines = content.split('\n');
  var result = [];
  var inCode = false;
  var codeBlock = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var trimmed = line.trim();

    var isCode = /^(public |private |protected |static |class |interface |import |package |void |int |String |boolean |return |if\s*\(|for\s*\(|while\s*\(|try\s*\{|catch\s*\(|else\s*\{|switch\s*\(|case |break;|\/\/|\/\*|\*\/|new |throw |throws |final |abstract |@|System\.out|System\.in|try\s*\(|finally\s*\{|\}|{|}|if\s+\(|else\s+\(|System\.)/.test(trimmed) ||
      /^[\s]*\/\/.*$/.test(line) ||
      /^\s*\{/.test(trimmed) ||
      /^\s*\}/.test(trimmed) ||
      /^\s*\*\//.test(trimmed) ||
      /^\s*\/\*/.test(trimmed) ||
      /^\s*\*/.test(line) ||
      /^(int|long|double|float|char|byte|short|boolean|var)\s+\w+/.test(trimmed) ||
      /^\s*(import|package)\s+/.test(trimmed) ||
      /^\s*(public|private|protected)\s+(static\s+)?(void|int|long|double|float|char|boolean|String|class|interface|abstract|final)\s/.test(trimmed) ||
      /^\s*(if|else|for|while|do|switch|case|break|continue|return|throw|try|catch|finally)\b/.test(trimmed) ||
      /^\s*\/\//.test(line) ||
      /^\s*System\.(out|in)/.test(trimmed) ||
      /^\s*@\w+/.test(trimmed) ||
      /^\s*new\s+\w+/.test(trimmed) ||
      /^\s*\w+\.\w+\(/.test(trimmed) ||
      /^\s*}\s*(catch|finally|else)/.test(trimmed);

    if (isCode && trimmed.length > 0) {
      if (!inCode) { inCode = true; }
      codeBlock.push(line);
      continue;
    }

    if (inCode && codeBlock.length > 0) {
      result.push('<div class="code-block"><pre>' + codeBlock.join('\n').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre></div>');
      codeBlock = [];
      inCode = false;
    }

    if (trimmed.length === 0) { result.push('<br>'); continue; }

    if (/^Chapter \d+:/.test(trimmed)) {
      result.push('<p style="font-weight:bold;font-size:1.1em;margin:18px 0 8px;color:var(--text)">' + trimmed + '</p>');
      continue;
    }
    if (/^Section [\d.]+:/.test(trimmed)) {
      result.push('<p style="font-weight:bold;margin:14px 0 6px;color:var(--text)">' + trimmed + '</p>');
      continue;
    }
    if (/^(Output|Result|Example output)/.test(trimmed)) {
      result.push('<p style="font-weight:bold;margin:10px 0 4px;color:var(--text)">' + trimmed + '</p>');
      continue;
    }
    result.push('<p style="margin:3px 0;line-height:1.55;color:var(--text);font-size:.93rem">' + trimmed + '</p>');
  }

  if (codeBlock.length > 0) {
    result.push('<div class="code-block"><pre>' + codeBlock.join('\n').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre></div>');
  }

  content = result.join('\n');
  content = content.replace(/Java® Notes for Professionals \d+/g, '<p style="text-align:center;color:var(--text-muted);font-size:.8rem;margin:14px 0;border-top:1px solid var(--border);padding-top:6px">$&</p>');

  var html = '<div style="max-width:860px;margin:0 auto;padding:20px;background:var(--card);color:var(--text)">';
  html += '<h1 style="font-size:1.5em;margin-bottom:16px;color:var(--primary);border-bottom:2px solid var(--border);padding-bottom:6px;font-family:Georgia,serif">Chapter ' + ch.id + ': ' + ch.title + '</h1>';
  html += '<div style="font-family:Georgia,serif;color:var(--text)">' + content + '</div>';
  html += '<div style="display:flex;justify-content:space-between;margin-top:28px;padding-top:12px;border-top:2px solid var(--border)">';
  if (id > 1) html += '<button class="btn btn-outline" onclick="showJavaProChapter(this,' + (id - 1) + ')"><i class="fas fa-arrow-left"></i> Previous</button>';
  else html += '<span></span>';
  if (id < window.javaproData.length) html += '<button class="btn btn-primary" onclick="showJavaProChapter(this,' + (id + 1) + ')">Next <i class="fas fa-arrow-right"></i></button>';
  html += '</div></div>';
  document.getElementById('javaproContainer').innerHTML = html;
  addCopyButtons();
  document.querySelectorAll('#javaproSidebar .sidebar-item').forEach(function(item) { item.classList.remove('active'); });
  if (el && el.classList) el.classList.add('active');
  document.getElementById('javaproMainContent').scrollTo(0, 0);
  window.scrollTo(0, 0);
}

// JavaBook reading progress
function updateBookProgress(chapterIdx) {
  var total = typeof javaproData !== 'undefined' ? Object.keys(javaproData).length : 0;
  if (total === 0) return;
  var read = JSON.parse(localStorage.getItem('javanest_book_read') || '[]');
  if (read.indexOf(chapterIdx) === -1) {
    read.push(chapterIdx);
    localStorage.setItem('javanest_book_read', JSON.stringify(read));
  }
  var pct = Math.round((read.length / total) * 100);
  var bar = document.getElementById('book-progress-bar');
  var label = document.getElementById('book-progress-label');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = pct + '% complete';
}

function markChapterRead(chapterIdx) {
  updateBookProgress(chapterIdx);
  var btn = document.querySelector('.mark-read-btn');
  if (btn) {
    btn.innerHTML = '<i class="fas fa-check"></i> Read';
    btn.classList.add('btn-secondary');
    btn.classList.remove('btn-primary');
  }
}