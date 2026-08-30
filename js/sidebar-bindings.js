(function(){
  function bindSearch(id, sidebarId) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function(){ filterSidebarItems(sidebarId, this.value); });
      el.addEventListener('keyup', function(){ filterSidebarItems(sidebarId, this.value); });
    }
  }
  function init() {
    bindSearch('learnSearchInput', 'sidebar');
    bindSearch('dsaSearchInput', 'dsaSidebar');
    bindSearch('practiceSearchInput', 'practiceSidebar');
    bindSearch('interviewSearchInput', 'interviewSidebar');
    bindSearch('javaproSearchInput', 'javaproSidebar');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('load', init);
})();