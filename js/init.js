function colorJavaFiles() {
  document.querySelectorAll('.code-header span:first-child').forEach(function(span) {
    if (span.textContent.indexOf('.java') !== -1 && !span.classList.contains('java-file')) {
      span.classList.add('java-file');
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  addCopyButtons();
  colorJavaFiles();
  new MutationObserver(function() { addCopyButtons(); colorJavaFiles(); }).observe(document.body, { childList: true, subtree: true });
  var firstItem = document.querySelector('#practiceSidebar .sidebar-item');
  if (firstItem && window.practiceData) showPracticeCategory(firstItem, 'basic');
  initJavaPro();
  initInterviewSidebar();
  showInterviewQuestion(1);

  // Ctrl+K search shortcut
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      var input = document.getElementById('searchInput');
      if (input) {
        showPage('home');
        input.focus();
        input.select();
      }
    }
  });
});