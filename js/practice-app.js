function showPracticeCategory(el, categoryId) {
  try {
    var dataKey = categoryKeyMap[categoryId];
    if (!dataKey) {
      var container = document.getElementById('practiceContainer');
      if (container) container.innerHTML = '<div class="concept-box"><h3>Category Not Found</h3><p>This category could not be loaded. Please try another.</p></div>';
      return;
    }
    var data = window.practiceData ? window.practiceData[dataKey] : null;
    var meta = categoryMeta[categoryId];
    if (!data || !meta) {
      var container = document.getElementById('practiceContainer');
      if (container) container.innerHTML = '<div class="concept-box"><h3>No Data Available</h3><p>Practice data for this category is not yet loaded.</p></div>';
      return;
    }
    
    var sidebar = document.getElementById('practiceSidebar');
    if (sidebar) sidebar.classList.remove('open');

    var fileNames = Object.keys(data.files);

    var difficultyHints = { 'Basic': 'easy', 'Easy': 'easy', 'Medium': 'medium', 'Hard': 'hard', 'Advanced': 'advanced' };

    var html = '<div class="lesson-header">';
    html += '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">';
    html += '<h1><i class="fas ' + meta.icon + '" style="color:var(--primary)"></i> ' + meta.title + '</h1>';
    html += '</div></div>';

    html += '<div class="concept-box">';
    html += '<p>' + meta.description + '</p>';
    html += '<div style="display:flex;gap:16px;margin-top:12px;flex-wrap:wrap">';
    html += '<span style="display:inline-flex;align-items:center;gap:6px;font-size:.9rem"><i class="fas fa-file-code" style="color:var(--primary)"></i> <strong>' + fileNames.length + '</strong> programs</span>';
    html += '</div></div>';

    html += '<div id="practiceFileList">';
    fileNames.forEach(function(name, idx) {
      var code = data.files[name];
      var highlighted = highlightJava(code);
      var fileId = 'pf-' + categoryId + '-' + idx;
      window.__practiceCode[fileId] = code;
      var safeCode = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

      var prog = '';
      var totalLines = code.split('\n').length;
      if (totalLines <= 20) prog = 'easy';
      else if (totalLines <= 60) prog = 'medium';
      else prog = 'hard';
      var progLabel = prog.charAt(0).toUpperCase() + prog.slice(1);

      html += '<div class="code-block" style="margin-bottom:12px">';
      html += '<div class="code-header" style="cursor:pointer" onclick="var c=document.getElementById(\'' + fileId + '\');c.style.display=c.style.display===\'none\'?\'block\':\'none\'">';
      html += '<span><i class="fas fa-file-code" style="margin-right:8px"></i>' + name + '</span>';
      html += '<span style="display:flex;align-items:center;gap:8px">';
      html += '<span class="difficulty-badge ' + prog + '" style="font-size:.7rem;padding:2px 8px">' + progLabel + '</span>';
      html += '<span style="font-size:.8rem;color:var(--text-muted)">' + totalLines + ' lines</span>';
      html += '<i class="fas fa-chevron-down"></i>';
      html += '</span></div>';
      html += '<pre id="' + fileId + '" data-code="' + safeCode + '" style="display:none;max-height:500px;overflow:auto;margin:0"><code>' + highlighted + '</code></pre>';
      html += '</div>';
    });
    html += '</div>';

    document.getElementById('practiceContainer').innerHTML = html;
    addCopyButtons();

    document.querySelectorAll('#practiceSidebar .sidebar-item').forEach(function(item) {
      item.classList.remove('active');
    });
    if (el) el.classList.add('active');
    document.getElementById('practiceMainContent').scrollTo(0, 0);
    window.scrollTo(0, 0);
  } catch (e) {
    console.error('showPracticeCategory error:', e);
    var container = document.getElementById('practiceContainer');
    if (container) container.innerHTML = '<div class="concept-box"><h3>Error Loading Category</h3><p>Something went wrong. Please refresh and try again.</p></div>';
  }
}

function showPracticeFile(categoryId, fileName) {
  // Click the correct sidebar item
  var sidebarItems = document.querySelectorAll('#practiceSidebar .sidebar-item');
  sidebarItems.forEach(function(item) {
    if (item.getAttribute('onclick').indexOf("'" + categoryId + "'") !== -1) {
      item.click();
    }
  });
  // After rendering, expand the specific file
  setTimeout(function() {
    var codeBlocks = document.querySelectorAll('#practiceContainer .code-header');
    codeBlocks.forEach(function(header) {
      if (header.textContent.indexOf(fileName) !== -1) {
        header.click();
        header.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
  var firstItem = document.querySelector('#practiceSidebar .sidebar-item');
  if (firstItem) showPracticeCategory(firstItem, 'basic');
});

// JavaPro Book functions