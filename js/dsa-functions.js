function showDSATopic(el, topicId) {
  try {
    if (!topicId) return;

    var topic = dsaTopics[topicId];
    if (!topic) {
      var container = document.getElementById('dsaContainer');
      if (container) {
        container.innerHTML = '<div class="concept-box"><h3>Topic Not Found</h3><p>The requested DSA topic could not be loaded. Please select another topic from the sidebar.</p></div>';
      }
      return;
    }

    var topicKeys = Object.keys(dsaTopics);
    var currentIdx = topicKeys.indexOf(topicId);
    var prevKey = currentIdx > 0 ? topicKeys[currentIdx - 1] : null;
    var nextKey = currentIdx < topicKeys.length - 1 ? topicKeys[currentIdx + 1] : null;

    var isCompleted = Progress.getDSACompleted().indexOf(topicId) !== -1;
    var difficulty = 'Beginner';
    if (topic.content.indexOf('intermediate') !== -1) difficulty = 'Intermediate';
    else if (topic.content.indexOf('advanced') !== -1) difficulty = 'Advanced';

    var diffClass = difficulty.toLowerCase();

    var headerHtml = '<div class="lesson-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">';
    headerHtml += '<div><h1><i class="fas ' + (topic.icon || 'fa-book') + '" style="color:var(--primary)"></i> ' + topic.title + '</h1>';
    headerHtml += '<span class="badge ' + diffClass + '">' + difficulty + '</span>';
    headerHtml += '</div>';
    headerHtml += '<div style="display:flex;gap:8px;align-items:center">';
    if (isCompleted) {
      headerHtml += '<span style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:8px;background:#27ae60;color:#fff;font-size:.85rem;font-weight:600"><i class="fas fa-check-circle"></i> Completed</span>';
    } else {
      headerHtml += '<button class="btn btn-primary" onclick="markDSATopicComplete(\'' + topicId + '\')" style="display:inline-flex;align-items:center;gap:6px"><i class="fas fa-check"></i> Mark Complete</button>';
    }
    headerHtml += '</div></div>';

    var navHtml = '<div style="display:flex;justify-content:space-between;margin-top:32px;padding:16px 0;border-top:1px solid var(--border)">';
    if (prevKey) {
      var prevTopic = dsaTopics[prevKey];
      navHtml += '<button class="btn btn-outline" onclick="navigateDSATopic(\'' + prevKey + '\')"><i class="fas fa-arrow-left"></i> ' + prevTopic.title + '</button>';
    } else {
      navHtml += '<div></div>';
    }
    if (nextKey) {
      var nextTopic = dsaTopics[nextKey];
      navHtml += '<button class="btn btn-outline" onclick="navigateDSATopic(\'' + nextKey + '\')">' + nextTopic.title + ' <i class="fas fa-arrow-right"></i></button>';
    } else {
      navHtml += '<div></div>';
    }
    navHtml += '</div>';

    var content = topic.content.replace(/<div class="lesson-header">[\s\S]*?<\/div>/, '');

    var container = document.getElementById('dsaContainer');
    if (container) {
      container.innerHTML = headerHtml + content + navHtml;
    }

    document.querySelectorAll('#dsaSidebar .sidebar-item').forEach(function(item) {
      item.classList.remove('active');
    });
    if (el) {
      el.classList.add('active');
    } else {
      var sidebarItem = document.querySelector('#dsaSidebar .sidebar-item[onclick*="' + topicId + '"]');
      if (sidebarItem) sidebarItem.classList.add('active');
    }

    var sidebar = document.getElementById('dsaSidebar');
    if (sidebar) sidebar.classList.remove('open');

    Progress.setLastLesson('dsa-' + topicId, topic.title);
    window.scrollTo(0, 0);
  } catch (e) {
    console.error('showDSATopic error:', e);
  }
}

function markDSATopicComplete(topicId) {
  try {
    Progress.markDSAComplete(topicId);
    var btn = document.querySelector('#dsaContainer .btn-primary');
    if (btn) {
      btn.outerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:8px;background:#27ae60;color:#fff;font-size:.85rem;font-weight:600"><i class="fas fa-check-circle"></i> Completed</span>';
    }
  } catch (e) {
    console.error('markDSATopicComplete error:', e);
  }
}

// DSA Visualizer Component
var DSAVisualizer = {
  container: null,
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 500,
  
  init: function(containerId) {
    this.container = document.getElementById(containerId);
    this.currentStep = 0;
    this.isPlaying = false;
  },
  
  render: function() {
    if (!this.container || !this.steps.length) return;
    var step = this.steps[this.currentStep];
    var html = '<div class="dsa-visualizer">';
    html += '<div class="visualizer-array">';
    if (step.array) {
      step.array.forEach(function(val, i) {
        var cls = 'visualizer-cell';
        if (step.highlight && step.highlight.indexOf(i) !== -1) cls += ' highlight';
        if (step.compare && step.compare.indexOf(i) !== -1) cls += ' compare';
        if (step.sorted && step.sorted.indexOf(i) !== -1) cls += ' sorted';
        html += '<div class="' + cls + '">' + val + '</div>';
      });
    }
    html += '</div>';
    if (step.pointers) {
      html += '<div class="visualizer-pointers">';
      step.pointers.forEach(function(p) {
        html += '<div class="pointer-label" style="left:' + (p.index * 52 + 10) + 'px">' + p.label + '</div>';
      });
      html += '</div>';
    }
    if (step.description) {
      html += '<div class="visualizer-desc">' + step.description + '</div>';
    }
    html += '<div class="visualizer-controls">';
    html += '<button class="btn btn-outline" onclick="DSAVisualizer.reset()"><i class="fas fa-undo"></i> Reset</button>';
    html += '<button class="btn btn-outline" onclick="DSAVisualizer.prev()"><i class="fas fa-step-backward"></i> Prev</button>';
    html += '<button class="btn btn-primary" onclick="DSAVisualizer.togglePlay()"><i class="fas fa-' + (this.isPlaying ? 'pause' : 'play') + '"></i> ' + (this.isPlaying ? 'Pause' : 'Play') + '</button>';
    html += '<button class="btn btn-outline" onclick="DSAVisualizer.next()"><i class="fas fa-step-forward"></i> Next</button>';
    html += '<span class="step-counter">Step ' + (this.currentStep + 1) + ' / ' + this.steps.length + '</span>';
    html += '</div>';
    html += '</div>';
    this.container.innerHTML = html;
  },
  
  setSteps: function(steps) {
    this.steps = steps;
    this.currentStep = 0;
    this.isPlaying = false;
    this.render();
  },
  
  next: function() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.render();
    }
  },
  
  prev: function() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
    }
  },
  
  togglePlay: function() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) this.play();
    else this.render();
  },
  
  play: function() {
    if (!this.isPlaying) return;
    var self = this;
    setTimeout(function() {
      if (self.currentStep < self.steps.length - 1) {
        self.currentStep++;
        self.render();
        self.play();
      } else {
        self.isPlaying = false;
        self.render();
      }
    }, this.speed);
  },
  
  reset: function() {
    this.currentStep = 0;
    this.isPlaying = false;
    this.render();
  },
  
  setSpeed: function(ms) {
    this.speed = ms;
  }
};

// Sample visualizations
var DSAVisualizations = {
  linearSearch: function(arr, target) {
    var steps = [];
    for (var i = 0; i < arr.length; i++) {
      steps.push({
        array: arr.slice(),
        highlight: [i],
        description: 'Comparing arr[' + i + '] = ' + arr[i] + ' with target = ' + target + (arr[i] === target ? ' ✓ Found!' : ' ✗ Not equal')
      });
    }
    return steps;
  },
  
  bubbleSort: function(arr) {
    var steps = [];
    var a = arr.slice();
    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < a.length - i - 1; j++) {
        steps.push({
          array: a.slice(),
          compare: [j, j + 1],
          description: 'Comparing ' + a[j] + ' and ' + a[j + 1] + (a[j] > a[j + 1] ? ' → Swapping' : ' → No swap')
        });
        if (a[j] > a[j + 1]) {
          var temp = a[j]; a[j] = a[j + 1]; a[j + 1] = temp;
          steps.push({
            array: a.slice(),
            highlight: [j, j + 1],
            description: 'Swapped ' + a[j + 1] + ' and ' + a[j]
          });
        }
      }
      steps.push({
        array: a.slice(),
        sorted: [a.length - 1 - i],
        description: a[a.length - 1 - i] + ' is now in its final position'
      });
    }
    steps.push({
      array: a.slice(),
      sorted: a.map(function(_, i) { return i; }),
      description: 'Array is sorted! ✓'
    });
    return steps;
  },
  
  binarySearch: function(arr, target) {
    var steps = [];
    var low = 0, high = arr.length - 1;
    while (low <= high) {
      var mid = Math.floor((low + high) / 2);
      steps.push({
        array: arr.slice(),
        highlight: [mid],
        description: 'low=' + low + ', high=' + high + ', mid=' + mid + ', arr[' + mid + ']=' + arr[mid]
      });
      if (arr[mid] === target) {
        steps.push({ array: arr.slice(), highlight: [mid], description: 'Found ' + target + ' at index ' + mid + ' ✓' });
        return steps;
      } else if (arr[mid] < target) {
        steps.push({ array: arr.slice(), highlight: [mid], description: arr[mid] + ' < ' + target + ' → Search right half' });
        low = mid + 1;
      } else {
        steps.push({ array: arr.slice(), highlight: [mid], description: arr[mid] + ' > ' + target + ' → Search left half' });
        high = mid - 1;
      }
    }
    steps.push({ array: arr.slice(), description: 'Element not found ✗' });
    return steps;
  }
};

function navigateDSATopic(topicId) {
  var sidebarItem = document.querySelector('#dsaSidebar .sidebar-item[onclick*="' + topicId + '"]');
  showDSATopic(sidebarItem, topicId);
}