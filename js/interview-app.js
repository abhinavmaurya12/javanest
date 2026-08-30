function initInterviewSidebar() {
  var list = document.getElementById('interviewSidebarList');
  if (!list) return;
  var html = '';
  interviewQuestions.forEach(function(q) {
    html += '<div class="sidebar-item' + (q.id===1?' active':'') + '" onclick="showInterviewQuestion('+q.id+',this)"><i class="fas fa-check-circle"></i> Q'+q.id+': '+q.title+'</div>';
  });
  list.innerHTML = html;
}

function showInterviewQuestion(id, el) {
  var q = interviewQuestions.find(function(x){return x.id===id;});
  if (!q) return;
  var container = document.getElementById('interviewContainer');
  container.innerHTML = '<div class="lesson-header"><h1><i class="fas fa-comments" style="color:var(--primary)"></i> Q'+q.id+': '+q.title+'</h1><p style="color:var(--text-muted)">Java Core Interview Question '+q.id+' of 51</p></div>' + q.content +
    '<div style="display:flex;justify-content:space-between;margin-top:32px;padding-top:20px;border-top:1px solid var(--border)">' +
    (id>1?'<button class="btn btn-outline" onclick="showInterviewQuestion('+(id-1)+')" style="padding:10px 20px;border-radius:8px;cursor:pointer"><i class="fas fa-arrow-left"></i> Previous</button>':'<div></div>') +
    (id<51?'<button class="btn btn-primary" onclick="showInterviewQuestion('+(id+1)+')" style="padding:10px 20px;border-radius:8px;cursor:pointer;background:var(--primary);color:#fff;border:none">Next <i class="fas fa-arrow-right"></i></button>':'<div></div>') +
    '</div>';
  addCopyButtons();
  document.querySelectorAll('#interviewSidebar .sidebar-item').forEach(function(item){item.classList.remove('active');});
  if (el) el.classList.add('active');
  var sidebar = document.getElementById('interviewSidebar');
  if (sidebar) sidebar.classList.remove('open');
  window.scrollTo(0,0);
}

// Interview improvements
function filterInterviewQuestions(category) {
  var items = document.querySelectorAll('#interviewSidebar .sidebar-item');
  items.forEach(function(item) {
    if (category === 'all') {
      item.style.display = '';
    } else {
      var text = item.textContent.toLowerCase();
      item.style.display = text.indexOf(category) !== -1 ? '' : 'none';
    }
  });
}

function toggleInterviewAnswer(id) {
  var answer = document.getElementById('answer-' + id);
  if (answer) {
    answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
  }
}