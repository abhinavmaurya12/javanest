function filterSidebarItems(sidebarId, query) {
  var q = query.toLowerCase().trim();
  var sidebar = document.getElementById(sidebarId);
  if (!sidebar) return;
  sidebar.querySelectorAll('.sidebar-section').forEach(function(section) {
    var items = section.querySelectorAll('.sidebar-item');
    var anyVisible = false;
    items.forEach(function(item) {
      var text = item.textContent.toLowerCase();
      if (!q || text.indexOf(q) !== -1) {
        item.classList.remove('sidebar-hidden');
        anyVisible = true;
      } else {
        item.classList.add('sidebar-hidden');
      }
    });
    if (anyVisible) {
      section.classList.remove('sidebar-hidden');
    } else {
      section.classList.add('sidebar-hidden');
    }
  });
  // Also filter DSA topic cards if on DSA page
  if (sidebarId === 'dsaSidebar') {
    var container = document.getElementById('dsaContainer');
    if (container) {
      container.querySelectorAll('.cards-grid .card').forEach(function(card) {
        var text = card.textContent.toLowerCase();
        card.style.display = (!q || text.indexOf(q) !== -1) ? '' : 'none';
      });
    }
  }
}