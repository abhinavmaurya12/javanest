// === JavaNest Learning Platform - Progress, Gamification & Challenges ===

// ========== PROGRESS SYSTEM ==========
var Progress = {
  get: function(key) {
    try { return JSON.parse(localStorage.getItem('javanest_' + key)) || null; } catch(e) { return null; }
  },
  set: function(key, val) {
    localStorage.setItem('javanest_' + key, JSON.stringify(val));
  },
  getJavaCompleted: function() {
    return this.get('java_completed') || [];
  },
  markJavaComplete: function(chapterIdx) {
    var completed = this.getJavaCompleted();
    if (completed.indexOf(chapterIdx) === -1) {
      completed.push(chapterIdx);
      this.set('java_completed', completed);
      Gamification.addXP(10, 'Complete Lesson');
      this.updateUI();
      Gamification.checkBadges();
    }
  },
  getDSACompleted: function() {
    return this.get('dsa_completed') || [];
  },
  markDSAComplete: function(topicId) {
    var completed = this.getDSACompleted();
    if (completed.indexOf(topicId) === -1) {
      completed.push(topicId);
      this.set('dsa_completed', completed);
      Gamification.addXP(20, 'Solve Practice');
      this.updateUI();
      Gamification.checkBadges();
    }
  },
  getInterviewCompleted: function() {
    return this.get('interview_completed') || [];
  },
  markInterviewComplete: function(qId) {
    var completed = this.getInterviewCompleted();
    if (completed.indexOf(qId) === -1) {
      completed.push(qId);
      this.set('interview_completed', completed);
      Gamification.addXP(30, 'Pass Quiz');
      this.updateUI();
      Gamification.checkBadges();
    }
  },
  getProjectsCompleted: function() {
    return this.get('projects_completed') || [];
  },
  markProjectComplete: function(projectId) {
    var completed = this.getProjectsCompleted();
    if (completed.indexOf(projectId) === -1) {
      completed.push(projectId);
      this.set('projects_completed', completed);
      Gamification.addXP(100, 'Complete Project');
      this.updateUI();
    }
  },
  getFrontendCompleted: function(track) {
    return this.get('frontend_' + track + '_completed') || [];
  },
  markFrontendComplete: function(track, chapterIdx) {
    var completed = this.getFrontendCompleted(track);
    if (completed.indexOf(chapterIdx) === -1) {
      completed.push(chapterIdx);
      this.set('frontend_' + track + '_completed', completed);
      Gamification.addXP(10, 'Complete ' + track.toUpperCase() + ' Lesson');
      this.updateUI();
      Gamification.checkBadges();
    }
  },
  getFrontendProgress: function(track, total) {
    var completed = this.getFrontendCompleted(track).length;
    return {
      completed: completed,
      total: total,
      pct: Math.round((completed / total) * 100)
    };
  },
  getLastLesson: function() {
    return this.get('last_lesson');
  },
  setLastLesson: function(idx, title) {
    this.set('last_lesson', { idx: idx, title: title, time: Date.now() });
  },
  updateUI: function() {
    var javaCompleted = this.getJavaCompleted().length;
    var dsaCompleted = this.getDSACompleted().length;
    var javaPct = Math.round((javaCompleted / 15) * 100);
    var dsaPct = Math.round((dsaCompleted / 30) * 100);

    var javaPctEl = document.getElementById('java-pct');
    var javaBarEl = document.getElementById('java-bar');
    var javaCompEl = document.getElementById('java-completed');
    var dsaPctEl = document.getElementById('dsa-pct');
    var dsaBarEl = document.getElementById('dsa-bar');
    var dsaCompEl = document.getElementById('dsa-completed');

    if (javaPctEl) javaPctEl.textContent = javaPct + '%';
    if (javaBarEl) javaBarEl.style.width = javaPct + '%';
    if (javaCompEl) javaCompEl.textContent = javaCompleted;
    if (dsaPctEl) dsaPctEl.textContent = dsaPct + '%';
    if (dsaBarEl) dsaBarEl.style.width = dsaPct + '%';
    if (dsaCompEl) dsaCompEl.textContent = dsaCompleted;

    var tracks = [
      { track: 'html', total: 6 },
      { track: 'css', total: 8 },
      { track: 'javascript', total: 10 },
      { track: 'react', total: 8 }
    ];
    tracks.forEach(function(t) {
      var prog = Progress.getFrontendProgress(t.track, t.total);
      var pctEl = document.getElementById(t.track + '-pct');
      var barEl = document.getElementById(t.track + '-bar');
      var compEl = document.getElementById(t.track + '-completed');
      if (pctEl) pctEl.textContent = prog.pct + '%';
      if (barEl) barEl.style.width = prog.pct + '%';
      if (compEl) compEl.textContent = prog.completed;
    });

    var section = document.getElementById('progress-section');
    if (section) section.style.display = '';

    var last = this.getLastLesson();
    var continueCard = document.getElementById('continue-card');
    var continueText = document.getElementById('continue-text');
    var continueBtn = document.getElementById('continue-btn');
    if (continueCard) {
      if (last && last.title) {
        continueCard.style.display = 'flex';
        if (continueText) continueText.textContent = 'You were learning: ' + last.title;
        if (continueBtn) continueBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
      } else {
        continueCard.style.display = 'flex';
        if (continueText) continueText.textContent = 'Begin with Java Fundamentals';
        if (continueBtn) {
          continueBtn.innerHTML = '<i class="fas fa-play"></i> Start Learning';
          continueBtn.onclick = function() { showPage('learn'); showLesson(0); };
        }
      }
    }
  }
};

function continueLearning() {
  var last = Progress.getLastLesson();
  if (last) {
    showPage('learn');
    showLesson(last.idx);
  }
}

// ========== GAMIFICATION ==========
var Gamification = {
  getXP: function() { return Progress.get('xp') || 0; },
  addXP: function(amount, label) {
    var xp = this.getXP() + amount;
    Progress.set('xp', xp);
    var history = Progress.get('xp_history') || [];
    history.push({ amount: amount, label: label || 'General', time: Date.now() });
    Progress.set('xp_history', history);
    this.updateUI();
  },
  getStreak: function() {
    var data = Progress.get('streak') || { count: 0, lastDate: null };
    var today = new Date().toDateString();
    var yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.lastDate === today) return data.count;
    if (data.lastDate === yesterday) return data.count;
    return 0;
  },
  updateStreak: function() {
    var data = Progress.get('streak') || { count: 0, lastDate: null };
    var today = new Date().toDateString();
    if (data.lastDate === today) return;
    var yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.lastDate === yesterday) {
      data.count++;
    } else {
      data.count = 1;
    }
    data.lastDate = today;
    Progress.set('streak', data);
    this.updateUI();
  },
  getSolved: function() {
    return (Progress.getJavaCompleted().length + Progress.getDSACompleted().length + Progress.getInterviewCompleted().length);
  },
  getBadges: function() {
    return Progress.get('badges') || [];
  },
  unlockBadge: function(badgeId) {
    var badges = this.getBadges();
    if (badges.indexOf(badgeId) === -1) {
      badges.push(badgeId);
      Progress.set('badges', badges);
      this.updateUI();
    }
  },
  checkBadges: function() {
    try {
      var javaCount = Progress.getJavaCompleted().length;
      var dsaCount = Progress.getDSACompleted().length;
      var interviewCount = Progress.getInterviewCompleted().length;
      var htmlCount = Progress.getFrontendCompleted('html').length;
      var cssCount = Progress.getFrontendCompleted('css').length;
      var jsCount = Progress.getFrontendCompleted('javascript').length;
      var reactCount = Progress.getFrontendCompleted('react').length;

      if (javaCount >= 1) this.unlockBadge('java-beginner');
      if (javaCount >= 5) this.unlockBadge('java-explorer');
      if (javaCount >= 15) this.unlockBadge('java-master');
      if (dsaCount >= 1) this.unlockBadge('dsa-starter');
      if (dsaCount >= 10) this.unlockBadge('dsa-warrior');
      if (interviewCount >= 20) this.unlockBadge('interview-ready');
      if (htmlCount >= 1) this.unlockBadge('html-beginner');
      if (htmlCount >= 6) this.unlockBadge('html-master');
      if (cssCount >= 1) this.unlockBadge('css-beginner');
      if (cssCount >= 8) this.unlockBadge('css-master');
      if (jsCount >= 1) this.unlockBadge('js-beginner');
      if (jsCount >= 10) this.unlockBadge('js-master');
      if (reactCount >= 1) this.unlockBadge('react-beginner');
      if (reactCount >= 8) this.unlockBadge('react-master');
    } catch (e) {
      console.error('Gamification checkBadges error:', e);
    }
  },
  updateUI: function() {
    try {
      var xpEl = document.getElementById('xp-value');
      var streakEl = document.getElementById('streak-value');
      var solvedEl = document.getElementById('solved-value');
      var badgeEl = document.getElementById('badge-value');

      if (xpEl) xpEl.textContent = this.getXP();
      if (streakEl) streakEl.textContent = this.getStreak();
      if (solvedEl) solvedEl.textContent = this.getSolved();
      if (badgeEl) badgeEl.textContent = this.getBadges().length;

      var badges = this.getBadges();
      badges.forEach(function(id) {
        var el = document.querySelector('[data-badge="' + id + '"]');
        if (el) {
          el.classList.add('unlocked');
          el.classList.remove('locked');
        }
      });
    } catch (e) {
      console.error('Gamification updateUI error:', e);
    }
  }
};

// ========== DAILY CHALLENGE ==========
var dailyChallenges = [
  {
    id: 1,
    title: "Reverse an Array",
    difficulty: "easy",
    topic: "Arrays",
    description: "Write a Java program to reverse an array without using another array.",
    input: "N = 5\nArr = 1 2 3 4 5",
    output: "5 4 3 2 1",
    hint: "Use two pointers \u2014 one at the start and one at the end. Swap elements and move towards the center.",
    solution: "class ReverseArray {\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3, 4, 5};\n        int start = 0, end = arr.length - 1;\n        while (start < end) {\n            int temp = arr[start];\n            arr[start] = arr[end];\n            arr[end] = temp;\n            start++;\n            end--;\n        }\n        for (int num : arr) System.out.print(num + \" \");\n    }\n}"
  },
  {
    id: 2,
    title: "Fibonacci Series",
    difficulty: "medium",
    topic: "Recursion",
    description: "Print the first N numbers of the Fibonacci series using recursion.",
    input: "N = 8",
    output: "0 1 1 2 3 5 8 13",
    hint: "Each Fibonacci number is the sum of the two preceding ones. Base cases: F(0)=0, F(1)=1.",
    solution: "class Fibonacci {\n    static int fib(int n) {\n        if (n <= 1) return n;\n        return fib(n - 1) + fib(n - 2);\n    }\n    public static void main(String[] args) {\n        int n = 8;\n        for (int i = 0; i < n; i++) {\n            System.out.print(fib(i) + \" \");\n        }\n    }\n}"
  },
  {
    id: 3,
    title: "Check Palindrome",
    difficulty: "easy",
    topic: "Strings",
    description: "Write a Java program to check if a given string is a palindrome.",
    input: "madam",
    output: "true",
    hint: "Compare characters from both ends moving towards the center.",
    solution: "class CheckPalindrome {\n    public static void main(String[] args) {\n        String s = \"madam\";\n        int start = 0, end = s.length() - 1;\n        boolean isPalindrome = true;\n        while (start < end) {\n            if (s.charAt(start) != s.charAt(end)) {\n                isPalindrome = false;\n                break;\n            }\n            start++;\n            end--;\n        }\n        System.out.println(isPalindrome);\n    }\n}"
  },
  {
    id: 4,
    title: "Find Largest Element",
    difficulty: "easy",
    topic: "Arrays",
    description: "Write a Java program to find the largest element in an integer array.",
    input: "N = 5\nArr = 3 7 2 9 5",
    output: "9",
    hint: "Initialize max with the first element, then iterate and compare each element.",
    solution: "class FindLargest {\n    public static void main(String[] args) {\n        int[] arr = {3, 7, 2, 9, 5};\n        int max = arr[0];\n        for (int i = 1; i < arr.length; i++) {\n            if (arr[i] > max) max = arr[i];\n        }\n        System.out.println(max);\n    }\n}"
  },
  {
    id: 5,
    title: "Bubble Sort",
    difficulty: "medium",
    topic: "Sorting",
    description: "Implement bubble sort to sort an integer array in ascending order.",
    input: "N = 5\nArr = 64 34 25 12 22",
    output: "12 22 25 34 64",
    hint: "Repeatedly swap adjacent elements if they are in the wrong order.",
    solution: "class BubbleSort {\n    public static void main(String[] args) {\n        int[] arr = {64, 34, 25, 12, 22};\n        int n = arr.length;\n        for (int i = 0; i < n - 1; i++) {\n            for (int j = 0; j < n - i - 1; j++) {\n                if (arr[j] > arr[j + 1]) {\n                    int temp = arr[j];\n                    arr[j] = arr[j + 1];\n                    arr[j + 1] = temp;\n                }\n            }\n        }\n        for (int num : arr) System.out.print(num + \" \");\n    }\n}"
  },
  {
    id: 6,
    title: "Linear Search",
    difficulty: "easy",
    topic: "Searching",
    description: "Implement linear search to find the index of a target element in an array.",
    input: "N = 4\nArr = 10 20 30 40\ntarget = 30",
    output: "Found at index 2",
    hint: "Iterate through each element and compare with the target value.",
    solution: "class LinearSearch {\n    public static void main(String[] args) {\n        int[] arr = {10, 20, 30, 40};\n        int target = 30;\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] == target) {\n                System.out.println(\"Found at index \" + i);\n                return;\n            }\n        }\n        System.out.println(\"Not found\");\n    }\n}"
  },
  {
    id: 7,
    title: "Count Vowels",
    difficulty: "easy",
    topic: "Strings",
    description: "Write a Java program to count the number of vowels in a given string.",
    input: "Programming",
    output: "3",
    hint: "Check if each character is a, e, i, o, or u (case-insensitive).",
    solution: "class CountVowels {\n    public static void main(String[] args) {\n        String s = \"Programming\";\n        int count = 0;\n        for (char c : s.toLowerCase().toCharArray()) {\n            if (\"aeiou\".indexOf(c) != -1) count++;\n        }\n        System.out.println(count);\n    }\n}"
  },
  {
    id: 8,
    title: "Factorial of N",
    difficulty: "easy",
    topic: "Recursion",
    description: "Write a Java program to find the factorial of a number N using recursion.",
    input: "N = 5",
    output: "120",
    hint: "Factorial of N is N * factorial(N-1). Base case: factorial(0) = 1.",
    solution: "class Factorial {\n    static long factorial(int n) {\n        if (n == 0 || n == 1) return 1;\n        return n * factorial(n - 1);\n    }\n    public static void main(String[] args) {\n        int n = 5;\n        System.out.println(factorial(n));\n    }\n}"
  },
  {
    id: 9,
    title: "Matrix Addition",
    difficulty: "medium",
    topic: "Arrays",
    description: "Write a Java program to add two matrices of the same size.",
    input: "Matrix A:\n1 2 3\n4 5 6\n\nMatrix B:\n7 8 9\n10 11 12",
    output: "8 10 12\n14 16 18",
    hint: "Add corresponding elements: result[i][j] = A[i][j] + B[i][j].",
    solution: "class MatrixAddition {\n    public static void main(String[] args) {\n        int[][] A = {{1, 2, 3}, {4, 5, 6}};\n        int[][] B = {{7, 8, 9}, {10, 11, 12}};\n        int rows = 2, cols = 3;\n        int[][] result = new int[rows][cols];\n        for (int i = 0; i < rows; i++) {\n            for (int j = 0; j < cols; j++) {\n                result[i][j] = A[i][j] + B[i][j];\n            }\n        }\n        for (int i = 0; i < rows; i++) {\n            for (int j = 0; j < cols; j++) {\n                System.out.print(result[i][j] + \" \");\n            }\n            System.out.println();\n        }\n    }\n}"
  },
  {
    id: 10,
    title: "Binary Search",
    difficulty: "medium",
    topic: "Searching",
    description: "Implement binary search on a sorted array to find the index of a target element.",
    input: "Arr = 2 5 8 12 16 23 38\ntarget = 23",
    output: "Found at index 5",
    hint: "Divide the search interval in half. Compare target with the middle element.",
    solution: "class BinarySearch {\n    public static void main(String[] args) {\n        int[] arr = {2, 5, 8, 12, 16, 23, 38};\n        int target = 23;\n        int low = 0, high = arr.length - 1;\n        while (low <= high) {\n            int mid = (low + high) / 2;\n            if (arr[mid] == target) {\n                System.out.println(\"Found at index \" + mid);\n                return;\n            } else if (arr[mid] < target) {\n                low = mid + 1;\n            } else {\n                high = mid - 1;\n            }\n        }\n        System.out.println(\"Not found\");\n    }\n}"
  }
];

var Challenge = {
  getCurrent: function() {
    var dayOfMonth = new Date().getDate();
    return dailyChallenges[dayOfMonth % dailyChallenges.length];
  },
  isSolved: function(id) {
    var solved = Progress.get('challenges_solved') || [];
    return solved.indexOf(id) !== -1;
  },
  markSolved: function() {
    var challenge = this.getCurrent();
    if (!challenge) return;
    var solved = Progress.get('challenges_solved') || [];
    if (solved.indexOf(challenge.id) === -1) {
      solved.push(challenge.id);
      Progress.set('challenges_solved', solved);
      Gamification.addXP(50, 'Daily Challenge');
      Gamification.updateStreak();
    }
    this.updateUI();
  },
  getSolvedCount: function() {
    return (Progress.get('challenges_solved') || []).length;
  },
  updateUI: function() {
    try {
      var c = this.getCurrent();
      if (!c) return;

      var titleEl = document.getElementById('challenge-title');
      var diffEl = document.getElementById('challenge-difficulty');
      var descEl = document.getElementById('challenge-description');
      var inputEl = document.getElementById('challenge-input');
      var outputEl = document.getElementById('challenge-output');
      var hintEl = document.getElementById('challenge-hint');
      var solCodeEl = document.getElementById('challenge-solution-code');
      var streakEl = document.getElementById('challenge-streak');
      var solvedEl = document.getElementById('challenge-solved');

      if (titleEl) titleEl.textContent = c.title;
      if (diffEl) {
        diffEl.textContent = c.difficulty.charAt(0).toUpperCase() + c.difficulty.slice(1);
        diffEl.className = 'difficulty-badge ' + c.difficulty;
      }
      if (descEl) descEl.textContent = c.description;
      if (inputEl) inputEl.textContent = c.input;
      if (outputEl) outputEl.textContent = c.output;
      if (hintEl) hintEl.textContent = c.hint;
      if (solCodeEl) solCodeEl.textContent = c.solution;
      if (streakEl) streakEl.textContent = Gamification.getStreak();
      if (solvedEl) solvedEl.textContent = this.getSolvedCount();

      var solved = Progress.get('challenges_solved') || [];
      var historyEl = document.getElementById('challenge-history');
      if (historyEl) {
        var html = '<h4>Previous Challenges</h4>';
        solved.slice(-5).reverse().forEach(function(id) {
          var ch = dailyChallenges.find(function(x) { return x.id === id; });
          if (ch) html += '<div class="history-item"><span class="difficulty-badge ' + ch.difficulty + '">' + ch.difficulty + '</span><span>' + ch.title + '</span><span class="solved"><i class="fas fa-check-circle"></i> Solved</span></div>';
        });
        if (solved.length === 0) html += '<p style="color:var(--text-muted);font-size:.88rem;text-align:center;padding:20px">No challenges solved yet. Start with today\'s challenge!</p>';
        historyEl.innerHTML = html;
      }

      var solvedStatusEl = document.getElementById('challenge-solved-status');
      if (solvedStatusEl) {
        if (solved.indexOf(c.id) !== -1) {
          solvedStatusEl.textContent = 'Solved!';
          solvedStatusEl.className = 'solved';
        } else {
          solvedStatusEl.textContent = 'Not solved';
          solvedStatusEl.className = '';
        }
      }
    } catch (e) {
      console.error('Challenge updateUI error:', e);
    }
  }
};

function toggleChallengeHint() {
  var box = document.getElementById('challenge-hint-box');
  if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function toggleChallengeSolution() {
  var box = document.getElementById('challenge-solution-box');
  if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function solveChallenge() {
  Challenge.markSolved();
}

// ========== COUNTDOWN TIMER ==========
function updateCountdown() {
  var now = new Date();
  var cycleStart = new Date('2026-01-01');
  var cycleLength = 5 * 24 * 60 * 60 * 1000;
  var elapsed = (now.getTime() - cycleStart.getTime()) % cycleLength;
  var remaining = cycleLength - elapsed;

  var days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  var hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  var mins = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  var secs = Math.floor((remaining % (60 * 1000)) / 1000);

  var dEl = document.getElementById('countdown-days');
  var hEl = document.getElementById('countdown-hours');
  var mEl = document.getElementById('countdown-mins');
  var sEl = document.getElementById('countdown-secs');

  if (dEl) dEl.textContent = days;
  if (hEl) hEl.textContent = hours;
  if (mEl) mEl.textContent = mins;
  if (sEl) sEl.textContent = secs < 10 ? '0' + secs : secs;
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', function() {
  Progress.updateUI();
  Gamification.updateUI();
  Challenge.updateUI();
  Gamification.updateStreak();
  updateCountdown();
  setInterval(updateCountdown, 1000);
});

// Hook into existing showLesson to track progress
var _origShowLesson = typeof showLesson === 'function' ? showLesson : null;
var _origShowDSATopic = typeof showDSATopic === 'function' ? showDSATopic : null;

// Override showLesson to track last lesson
if (typeof showLesson === 'function') {
  var origShowLesson = showLesson;
  window.showLesson = function(id) {
    origShowLesson(id);
    if (typeof lessons !== 'undefined' && lessons[id]) {
      Progress.setLastLesson(id, lessons[id].title);
    }
  };
}
