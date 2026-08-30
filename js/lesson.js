function showLesson(id) {
  currentLesson = id;
  const lesson = lessons[id];
  if (!lesson) {
    if (typeof showLessonEmptyState === 'function') showLessonEmptyState();
    return;
  }
  const isComplete = completedLessons.includes(id);
  const prevBtn = id > 0 ? '<button class="btn btn-outline" onclick="showLesson(' + (id - 1) + ')"><i class="fas fa-arrow-left"></i> Previous</button>' : '<span></span>';
  const nextBtn = id < lessons.length - 1 ? '<button class="btn btn-primary" onclick="showLesson(' + (id + 1) + ')">Next <i class="fas fa-arrow-right"></i></button>' : '<span></span>';
  const completeBtn = '<button class="btn ' + (isComplete ? 'btn-secondary' : 'btn-outline') + '" onclick="markAsComplete(' + id + ')"><i class="fas fa-check"></i> ' + (isComplete ? 'Completed' : 'Mark Complete') + '</button>';
  
  // Close sidebar on mobile
  var sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('open');

  document.getElementById('lessonContainer').innerHTML = `
    <div class="lesson-header">
      <h1>Chapter ${id + 1}: ${lesson.title}</h1>
      <span class="badge ${lesson.badgeClass}">${lesson.difficulty}</span>
    </div>
    ${lesson.content}
    <div class="lesson-nav">${prevBtn}${completeBtn}${nextBtn}</div>
  `;

  addCopyButtons();
  document.querySelectorAll('.sidebar-item').forEach((item, i) => item.classList.remove('active'));
  document.querySelectorAll('.sidebar-item')[id]?.classList.add('active');
  document.querySelector('.main-content').scrollTo(0, 0);
  window.scrollTo(0, 0);
}

function markAsComplete(id) {
  if (!completedLessons.includes(id)) {
    completedLessons.push(id);
    localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
    if (typeof Progress !== 'undefined' && Progress.markJavaComplete) {
      Progress.markJavaComplete(id);
    }
    if (typeof showToast === 'function') {
      showToast('Lesson completed! +10 XP');
    }
  }
  showLesson(id);
}

(function() {
  var saved = localStorage.getItem('theme');
  if (saved !== 'dark' && saved !== 'light') saved = 'light';
  document.documentElement.setAttribute('data-theme', saved);
  var icon = document.querySelector('.theme-btn i');
  if (icon) {
    icon.className = saved === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
  showLesson(0);
})();

// practiceCategories replaced by window.practiceData from practice-data.js
// Old orphaned code removed - see practice-data.js for all file data

// Category metadata
const categoryMeta = {
  'basic': { icon: 'fa-code', title: 'Basic Programs', description: 'Fundamental Java programs covering variables, operators, conditionals, and basic I/O operations.' },
  'patterns': { icon: 'fa-th', title: 'Pattern Programs', description: 'Star patterns, number patterns, alphabet patterns — the foundation of nested loop logic.' },
  'pattern-assignment': { icon: 'fa-puzzle-piece', title: 'Pattern Assignment', description: 'Pattern assignment practice problems covering star, number, and alphabet patterns.' },
  'number-patterns': { icon: 'fa-hashtag', title: 'Number Patterns', description: 'Number-based pattern programs using loops and conditional logic.' },
  'loops': { icon: 'fa-redo', title: 'Loop Examples', description: 'For, while, do-while loop variations and control flow demonstrations.' },
  'arrays': { icon: 'fa-layer-group', title: 'Array Programs', description: 'Array declaration, initialization, traversal, sorting, and manipulation.' },
  'strings': { icon: 'fa-font', title: 'String Handling', description: 'String operations, StringBuffer, StringBuilder, and string manipulation.' },
  'oop': { icon: 'fa-cube', title: 'OOP Concepts', description: 'Abstraction, constructors, inheritance, and object-oriented programming principles.' },
  'exceptions': { icon: 'fa-exclamation-triangle', title: 'Exception Handling', description: 'Try-catch, custom exceptions, and error handling patterns.' },
  'threading': { icon: 'fa-sync-alt', title: 'Multithreading', description: 'Thread creation, synchronization, and concurrent programming.' },
  'switch-continue': { icon: 'fa-exchange-alt', title: 'Switch & Continue', description: 'Switch statements and continue/break control flow.' },
  'this-super': { icon: 'fa-link', title: 'This & Super Keywords', description: 'Keyword usage for referencing objects and parent classes.' },
  'gc': { icon: 'fa-trash-alt', title: 'Garbage Collection', description: 'Memory management and garbage collection demonstrations.' },
  'packages': { icon: 'fa-box', title: 'Package & Import', description: 'Package declarations, imports, and multi-file Java projects.' },
  'practice': { icon: 'fa-puzzle-piece', title: 'Practice Assignments', description: 'Practice problems and assignment solutions.' },
  'awt-swing': { icon: 'fa-desktop', title: 'AWT/Swing GUI', description: 'GUI programming with AWT components, event handling, layouts, and Swing.' },
  'friday-fun': { icon: 'fa-gamepad', title: 'Friday Fun', description: 'Fun Java programs from Friday coding sessions - patterns, number games, and creative coding challenges.' }
};

// Map display names to practice-data.js keys
const categoryKeyMap = {
  'basic': 'Basic Programs',
  'patterns': 'Pattern Programs',
  'pattern-assignment': 'PatternAssignment',
  'number-patterns': 'Number Patterns',
  'loops': 'Loop Examples',
  'arrays': 'Array Programs',
  'strings': 'String Handling',
  'oop': 'OOP Concepts',
  'exceptions': 'Exception Handling',
  'threading': 'Multithreading',
  'switch-continue': 'Switch & Continue',
  'this-super': 'This & Super Keywords',
  'gc': 'Garbage Collection',
  'packages': 'Package & Import',
  'practice': 'Practice Assignments',
  'awt-swing': 'AWT/Swing GUI',
  'friday-fun': 'Friday Fun'
};

var categoryNameToId = {};
Object.keys(categoryKeyMap).forEach(function(k) { categoryNameToId[categoryKeyMap[k]] = k; });

function highlightJava(code) {
  var s = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Split into code vs comment/string segments
  var segments = [];
  var re = /\/\/.*$|\/\*[\s\S]*?\*\/|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'/gm;
  var last = 0, m;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) segments.push({type:'code', text: s.substring(last, m.index)});
    segments.push({type: m[0].charAt(0)==='/' ? 'cmt' : 'str', text: m[0]});
    last = re.lastIndex;
  }
  if (last < s.length) segments.push({type:'code', text: s.substring(last)});

  // Highlight only code segments
  for (var i = 0; i < segments.length; i++) {
    if (segments[i].type !== 'code') {
      segments[i].text = '<span class="' + segments[i].type + '">' + segments[i].text + '</span>';
      continue;
    }
    var t = segments[i].text;
    t = t.replace(/\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|var|yield|record|sealed|permits|non-sealed)\b/g, '<span class="kw">$1</span>');
    t = t.replace(/@([A-Z]\w*)/g, '<span class="kw">@$1</span>');
    t = t.replace(/\b([A-Z][a-zA-Z0-9]*)\b/g, '<span class="cls">$1</span>');
    t = t.replace(/\b([a-z_]\w*)\s*(?=\()/g, '<span class="mth">$1</span>');
    segments[i].text = t;
  }

  var result = '';
  for (var j = 0; j < segments.length; j++) result += segments[j].text;
  return result;
}