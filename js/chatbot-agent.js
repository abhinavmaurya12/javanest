function toggleAgent(){document.getElementById('agentPanel').classList.toggle('open')}
function agentAsk(q){document.getElementById('agentText').value=q;sendAgentMsg()}
function sendAgentMsg(){
  var input=document.getElementById('agentText');
  var q=input.value.trim();if(!q)return;input.value='';
  addAgentMsg(q,'user');
  setTimeout(function(){var a=agentReply(q);addAgentMsg(a,'bot')},400+Math.random()*600);
}
function addAgentMsg(text,type){
  var msg=document.createElement('div');msg.className='agent-msg '+type;
  var av=type==='bot'?'<div class="agent-avatar"><i class="fas fa-robot"></i></div>':'<div class="agent-avatar"><i class="fas fa-user"></i></div>';
  var bubble='<div class="agent-bubble">'+text+'</div>';
  msg.innerHTML=av+bubble;
  var el=document.getElementById('agentMessages');el.appendChild(msg);el.scrollTop=el.scrollHeight;
}
function stripHtml(html){var d=document.createElement('div');d.innerHTML=html;return d.textContent||d.innerText||''}
function extractCode(html){
  if(!html)return'';
  var matches=html.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/g);
  if(matches){
    var codes=[];
    matches.forEach(function(m){
      var c=m.replace(/<\/?pre>/g,'').replace(/<\/?code>/g,'').replace(/<span class="kw">/g,'').replace(/<span class="cls">/g,'').replace(/<span class="mth">/g,'').replace(/<span class="str">/g,'').replace(/<span class="cmt">/g,'').replace(/<\/span>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/<br\s*\/?>/g,'\n').trim();
      if(c.length>20)codes.push(c);
    });
    return codes.length>0?codes[0]:'';
  }
  // Raw string (practice files)
  if(typeof html==='string'&&html.length>20){return html.trim();}
  return'';
}
function extractOutput(html){
  var m=html.match(/<div class="output-block">([\s\S]*?)<\/div>/);
  if(!m)return'';
  return m[1].replace(/<br\s*\/?>/g,'\n').replace(/<[^>]+>/g,'').trim();
}
function agentReply(q){
  var lq=q.toLowerCase();

  // Greetings
  if(lq.match(/\b(hi|hello|hey|namaste|hola|sup|good\s*(morning|afternoon|evening))\b/))
    return 'Hey there! 👋 I\'m your JavaNest assistant. I can help you with Java, DSA, HTML, CSS, JavaScript, React, code examples, and interview prep. What would you like to know?';

  // How to use
  if(lq.match(/how.*use.*website|how.*work|guide|help.*start/))
    return '📖 <b>Learn</b> — Java chapters + Frontend tracks (HTML, CSS, JS, React)<br>💻 <b>Practice Code</b> — 200+ runnable programs<br>📚 <b>JavaPro Book</b> — 80+ reference chapters<br>🎓 <b>Interview Q&A</b> — 51 questions with code<br>🧪 <b>Try It</b> — Code online without installing<br><br>Use the <b>search bar</b> to find any topic instantly!';

  // Feature list
  if(lq.match(/what.*can.*you|what.*do.*you|feature|capability/))
    return 'I can answer questions from our 51 interview Q&A, explain Java and Frontend concepts, show code examples, search through all content, and guide you to the right chapter. Just ask!';

  // Topics covered
  if(lq.match(/topic|what.*cover|chapter|syllabus|all.*question/))
    return 'JavaNest covers:<br><br><b>Java:</b> Basics, OOP, arrays, strings, exceptions, multithreading, I/O<br><b>DSA:</b> Arrays, strings, sorting, trees, graphs, DP<br><b>HTML:</b> Tags, forms, semantic HTML, accessibility<br><b>CSS:</b> Selectors, flexbox, grid, animations, responsive<br><b>JavaScript:</b> Variables, functions, DOM, async, ES6+, closures<br><b>React:</b> Components, hooks, routing, context API<br><br>Plus 51 interview questions and 200+ practice programs!';

  // Frontend topics
  if(lq.match(/html.*tag|html.*form|semantic.*html|html.*access/))
    return 'HTML covers: document structure, tags & elements, forms & inputs, semantic HTML, tables & lists, accessibility & SEO. Start with <span class="agent-tag" onclick="showPage(\'frontend-html\');showFrontendChapter(\'html\',0)">HTML Track</span>.';

  if(lq.match(/css.*selector|flexbox|css.*grid|css.*animation|responsive|box.*model/))
    return 'CSS covers: introduction, selectors, box model, flexbox, grid, colors/typography, transitions/animations, responsive design. Start with <span class="agent-tag" onclick="showPage(\'frontend-css\');showFrontendChapter(\'css\',0)">CSS Track</span>.';

  if(lq.match(/javascript.*variable|js.*function|dom.*manipulation|event.*listener|async.*js|closure|prototype|es6/))
    return 'JavaScript covers: intro, variables/data types, functions/scope, DOM, events, control flow, arrays/objects, async/promises, ES6+ features, closures/prototypes. Start with <span class="agent-tag" onclick="showPage(\'frontend-javascript\');showFrontendChapter(\'javascript\',0)">JavaScript Track</span>.';

  if(lq.match(/react.*component|react.*hook|jsx|react.*router|context.*api|react.*state|redux/))
    return 'React covers: intro, JSX/components, props/state, hooks, event handling/forms, React Router, Context API, performance/best practices. Start with <span class="agent-tag" onclick="showPage(\'frontend-react\');showFrontendChapter(\'react\',0)">React Track</span>.';

  if(lq.match(/frontend|web.*dev|html.*css|html.*js/))
    return 'Our Frontend Developer Track includes:<br><br>1. <b>HTML</b> — 6 chapters (tags, forms, semantic)<br>2. <b>CSS</b> — 8 chapters (selectors, flexbox, grid, responsive)<br>3. <b>JavaScript</b> — 10 chapters (DOM, async, ES6+, closures)<br>4. <b>React</b> — 8 chapters (components, hooks, routing)<br><br>Start with <span class="agent-tag" onclick="showPage(\'frontend-html\');showFrontendChapter(\'html\',0)">HTML Track</span>!';

  // Search interview questions first (this is the key feature)
  if(typeof interviewQuestions!=='undefined'){
    var keywords=lq.replace(/[?!.]/g,'').split(/\s+/).filter(function(w){return w.length>2});
    var scored=[];
    interviewQuestions.forEach(function(qq){
      var titleLow=qq.title.toLowerCase();
      var textLow=stripHtml(qq.content).toLowerCase();
      var score=0;
      keywords.forEach(function(kw){
        if(titleLow.includes(kw))score+=10;
        if(textLow.includes(kw))score+=2;
      });
      if(score>=6)scored.push({q:qq,score:score});
    });
    scored.sort(function(a,b){return b.score-a.score});
    if(scored.length>0){
      var best=scored[0].q;
      var text=stripHtml(best.content);
      var code=extractCode(best.content);
      var output=extractOutput(best.content);
      var shortText=text.substring(0,600);
      if(text.length>600)shortText+='...';
      var answer='<b>Q'+best.id+': '+best.title+'</b><br><br>'+shortText;
      if(code)answer+='<div class="agent-code">'+code+'</div>';
      if(output)answer+='<br><b>Output:</b><br><code>'+output+'</code>';
      answer+='<br><br><span class="agent-tag" onclick="agentAsk(\'related questions to '+best.title.replace(/'/g,"\\'")+'\')">Related questions</span>';
      return answer;
    }
  }

  // Specific interview question topics
  if(lq.match(/static.*block|initializer/))return agentGetQuestion(1);
  if(lq.match(/constructor.*chain|call.*constructor/))return agentGetQuestion(2);
  if(lq.match(/method.*overrid|overriding/))return agentGetQuestion(3);
  if(lq.match(/super.*keyword/))return agentGetQuestion(4);
  if(lq.match(/overloading.*overriding|overriding.*overloading|difference.*over/))return agentGetQuestion(5);
  if(lq.match(/abstract.*class.*interface|interface.*abstract|abstract.*vs/))return agentGetQuestion(6);
  if(lq.match(/platform.*independ|why.*java.*platform/))return agentGetQuestion(7);
  if(lq.match(/method.*overload|overloading(?!.*overrid)/))return agentGetQuestion(8);
  if(lq.match(/c\+\+.*java|java.*c\+\+|difference.*cpp/))return agentGetQuestion(9);
  if(lq.match(/jit/))return agentGetQuestion(10);
  if(lq.match(/bytecode/))return agentGetQuestion(11);
  if(lq.match(/this\(\).*super\(\)|super\(\).*this\(\)|this.*vs.*super/))return agentGetQuestion(12);
  if(lq.match(/\bclass\b(?!.*naming|.*access|.*abstract|.*interface|.*object)/))return agentGetQuestion(13);
  if(lq.match(/\bobject\b(?!.*oriented)/))return agentGetQuestion(14);
  if(lq.match(/\bmethod\b(?!.*over|.*naming|.*access|.*main)/))return agentGetQuestion(15);
  if(lq.match(/encapsul|getter.*setter|data.*hid/))return agentGetQuestion(16);
  if(lq.match(/main\(\).*sign|why.*main.*public|main.*static.*void/))return agentGetQuestion(17);
  if(lq.match(/main\(\).*method|explain.*main/))return agentGetQuestion(18);
  if(lq.match(/\bconstructor\b(?!.*chain|.*naming)/))return agentGetQuestion(19);
  if(lq.match(/length.*length\(\)|length\(\).*length|length.*vs/))return agentGetQuestion(20);
  if(lq.match(/ascii/))return agentGetQuestion(21);
  if(lq.match(/unicode/))return agentGetQuestion(22);
  if(lq.match(/char.*constant|string.*constant|character.*constant/))return agentGetQuestion(23);
  if(lq.match(/\bconstants?\b(?!.*naming)/))return agentGetQuestion(24);
  if(lq.match(/>*>|unsigned.*shift|right.*shift/))return agentGetQuestion(25);
  if(lq.match(/class.*naming|naming.*class|class.*convention/))return agentGetQuestion(26);
  if(lq.match(/interface.*naming|naming.*interface/))return agentGetQuestion(27);
  if(lq.match(/method.*naming|naming.*method/))return agentGetQuestion(28);
  if(lq.match(/variable.*naming|naming.*variable/))return agentGetQuestion(29);
  if(lq.match(/constant.*naming|naming.*constant/))return agentGetQuestion(30);
  if(lq.match(/overrid.*overload|overload.*overrid|difference.*over/))return agentGetQuestion(31);
  if(lq.match(/is.?a.*relationship|is.?a\b/))return agentGetQuestion(32);
  if(lq.match(/has.?a.*relationship|has.?a\b|composition/))return agentGetQuestion(33);
  if(lq.match(/is.?a.*has.?a|has.?a.*is.?a|is.?a.*vs.*has.?a/))return agentGetQuestion(34);
  if(lq.match(/instanceof/))return agentGetQuestion(35);
  if(lq.match(/\bnull\b/))return agentGetQuestion(36);
  if(lq.match(/multiple.*class|class.*single.*file/))return agentGetQuestion(37);
  if(lq.match(/top.*level.*class|class.*access.*modifier/))return agentGetQuestion(38);
  if(lq.match(/\bpackage\b/))return agentGetQuestion(39);
  if(lq.match(/multiple.*package|package.*statement/))return agentGetQuestion(40);
  if(lq.match(/package.*import|import.*package|order/))return agentGetQuestion(41);
  if(lq.match(/\bidentifier/))return agentGetQuestion(42);
  if(lq.match(/access.*modifier/))return agentGetQuestion(43);
  if(lq.match(/specifier.*modifier|modifier.*specifier/))return agentGetQuestion(44);
  if(lq.match(/class.*access|access.*class/))return agentGetQuestion(45);
  if(lq.match(/method.*access|access.*method/))return agentGetQuestion(46);
  if(lq.match(/variable.*access|access.*variable/))return agentGetQuestion(47);
  if(lq.match(/\bfinal\b|final.*keyword|final.*modifier/))return agentGetQuestion(48);
  if(lq.match(/abstract.*class\b(?!.*vs)/))return agentGetQuestion(49);
  if(lq.match(/constructor.*abstract|abstract.*constructor/))return agentGetQuestion(50);
  if(lq.match(/abstract.*method/))return agentGetQuestion(51);

  // Search lesson content
  if(typeof lessons!=='undefined'){
    for(var i=0;i<lessons.length;i++){
      var content=(typeof lessons[i].content==='string')?lessons[i].content.toLowerCase():'';
      if(content.includes(lq)){
        return 'This topic is covered in <b>Chapter '+(i+1)+': '+lessons[i].title+'</b><br><br>Click <span class="agent-tag" onclick="searchGoLearn('+i+')">Open Chapter '+(i+1)+'</span> to read the full content with code examples!';
      }
    }
  }

  // Search practice files
  if(window.practiceData){
    var files=[];
    Object.keys(window.practiceData).forEach(function(cat){
      var c=window.practiceData[cat];
      if(c&&c.files){Object.keys(c.files).forEach(function(f){
        var code=(typeof c.files[f]==='string')?c.files[f]:'';
        if(f.toLowerCase().includes(lq)||code.toLowerCase().includes(lq)){
          var catId=categoryNameToId[cat]||'basic';
          files.push({name:f,cat:cat,catId:catId,code:code});
        }
      })}
    });
    if(files.length>0){
      var r='Found <b>'+files.length+'</b> matching .java file(s):<br><br>';
      files.slice(0,3).forEach(function(f){
        r+='<b>'+f.name+'</b> <span style="color:var(--text-muted);font-size:.75rem">('+f.cat+')</span><br>';
        r+='<div class="agent-code">'+f.code+'</div>';
        var safeFile=f.name.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
        r+='<span class="agent-tag" onclick="searchGoPractice(\''+f.catId+'\',\''+safeFile+'\')">Open in Practice Code</span> ';
      });
      if(files.length>3)r+='<br><span style="color:var(--text-muted);font-size:.8rem">...and '+(files.length-3)+' more. Use the search bar to find them all.</span>';
      return r;
    }
  }

  // Search JavaPro chapters
  if(window.javaproData){
    for(var j=0;j<javaproData.length;j++){
      if(javaproData[j].title.toLowerCase().includes(lq)){
        return 'Found in <b>JavaPro Book — Ch '+javaproData[j].id+': '+javaproData[j].title+'</b><br><br><span class="agent-tag" onclick="searchGoJavaPro('+javaproData[j].id+')">Open Chapter</span>';
      }
    }
  }

  // Practice code tags
  if(lq.match(/code|program|example|show.*me|practice/)){
    var topics=['Hello World','Arrays','Inheritance','Polymorphism','Exception Handling','Multithreading','Constructors','Encapsulation','Abstract Classes','Interfaces','String Methods','Collections','File I/O','Patterns','Switch Statement'];
    return 'What topic do you want?<br><br>'+topics.map(function(t){return '<span class="agent-tag" onclick="agentAsk(\''+t+' code example\')">'+t+'</span>'}).join(' ');
  }

  // Code examples
  if(lq.match(/hello.*world|first.*program|basic.*code|start/))
    return 'Hello World Program:<div class="agent-code">public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}</div>This is Chapter 1 of JavaNest!';
  if(lq.match(/array.*code|show.*array|code.*array/))
    return 'Array Example:<div class="agent-code">public class ArrayDemo {\n    public static void main(String[] args) {\n        int[] nums = {10, 20, 30, 40, 50};\n        for (int i = 0; i < nums.length; i++) {\n            System.out.println(nums[i]);\n        }\n    }\n}</div>';
  if(lq.match(/inheritance.*code|extends.*code|show.*inherit/))
    return 'Inheritance Example:<div class="agent-code">class Animal {\n    void eat() { System.out.println("Animal eats"); }\n}\nclass Dog extends Animal {\n    void bark() { System.out.println("Dog barks"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Dog d = new Dog();\n        d.eat();\n        d.bark();\n    }\n}</div>';
  if(lq.match(/exception.*code|try.*catch.*code/))
    return 'Exception Handling:<div class="agent-code">try {\n    int result = 10 / 0;\n} catch (ArithmeticException e) {\n    System.out.println("Cannot divide by zero!");\n} finally {\n    System.out.println("Finally always runs");\n}</div>';
  if(lq.match(/thread.*code|multithread.*code/))
    return 'Multithreading:<div class="agent-code">class MyThread extends Thread {\n    public void run() {\n        for (int i = 1; i <= 5; i++) {\n            System.out.println(getName() + " - " + i);\n            try { Thread.sleep(500); }\n            catch (InterruptedException e) {}\n        }\n    }\n}\n// MyThread t1 = new MyThread();\n// t1.start();</div>';
  if(lq.match(/encapsul|getter.*setter/))
    return 'Encapsulation:<div class="agent-code">public class BankAccount {\n    private double balance;\n    public double getBalance() { return balance; }\n    public void deposit(double amt) {\n        if (amt > 0) balance += amt;\n    }\n    public void withdraw(double amt) {\n        if (amt > 0 && amt <= balance)\n            balance -= amt;\n    }\n}</div>';
  if(lq.match(/constructor|this\(\)|super\(\)/))
    return 'Constructor Chaining:<div class="agent-code">public class Student {\n    String name; int age;\n    Student() { this("Unknown", 0); }\n    Student(String name) { this(name, 25); }\n    Student(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n}</div>';
  if(lq.match(/polymorphi|method.*overrid/))
    return 'Polymorphism:<div class="agent-code">class Shape {\n    double area() { return 0; }\n}\nclass Circle extends Shape {\n    double r;\n    Circle(double r) { this.r = r; }\n    double area() { return Math.PI * r * r; }\n}\nclass Rect extends Shape {\n    double w, h;\n    Rect(double w, double h) { this.w=w; this.h=h; }\n    double area() { return w * h; }\n}</div>';
  if(lq.match(/interface.*code|implements/))
    return 'Interface:<div class="agent-code">interface Vehicle {\n    void start();\n    void stop();\n}\nclass Car implements Vehicle {\n    public void start() {\n        System.out.println("Car starts with key");\n    }\n    public void stop() {\n        System.out.println("Car stops");\n    }\n}</div>';
  if(lq.match(/abstract.*code|abstract.*class.*code/))
    return 'Abstract Class:<div class="agent-code">abstract class Shape {\n    String color;\n    Shape(String c) { color = c; }\n    abstract double area();\n    void display() {\n        System.out.println(color + " area=" + area());\n    }\n}\nclass Circle extends Shape {\n    double r;\n    Circle(String c, double r) { super(c); this.r=r; }\n    double area() { return Math.PI*r*r; }\n}</div>';

  if(lq.match(/search|find|look.*for/))
    return 'Use the <b>search bar</b> at the top! It searches all chapters, practice files, Java code, and book chapters instantly.';

  if(lq.match(/thank|thanks|great|awesome|perfect|nice/))
    return 'You\'re welcome! 😊 Happy learning! Ask me anything else about Java.';

  if(lq.match(/interview|prepare|exam|job/))
    return 'You have <b>51 interview questions</b> with full answers, code examples, and output. Topics include OOP, constructors, polymorphism, access modifiers, exception handling, and more. Click <b>Interview Q&A</b> in the nav bar, or ask me any specific question!';

  // Final fallback — search everything broadly
  if(typeof interviewQuestions!=='undefined'){
    for(var k=0;k<interviewQuestions.length;k++){
      var t=stripHtml(interviewQuestions[k].content).toLowerCase();
      if(t.includes(lq)){
        var qq=interviewQuestions[k];
        var ans=stripHtml(qq.content);
        var shortAns=ans.substring(0,500);
        if(ans.length>500)shortAns+='...';
        return '<b>Q'+qq.id+': '+qq.title+'</b><br><br>'+shortAns;
      }
    }
  }

  return 'Try asking about:<br><br>• Any Java concept (inheritance, polymorphism, encapsulation...)<br>• Specific questions ("What is method overriding?")<br>• Code examples ("show me array code")<br>• Interview topics ("overloading vs overriding")<br>• Practice programs ("find Armstrong number code")<br><br>You can also use the <b>search bar</b> to find anything!';
}

function agentGetQuestion(id){
  if(typeof interviewQuestions==='undefined')return 'Interview questions data not loaded.';
  var q=null;
  for(var i=0;i<interviewQuestions.length;i++){if(interviewQuestions[i].id===id){q=interviewQuestions[i];break;}}
  if(!q)return 'Question not found.';
  var text=stripHtml(q.content);
  var code=extractCode(q.content);
  var output=extractOutput(q.content);
  var shortText=text.substring(0,700);
  if(text.length>700)shortText+='...';
  var answer='<b>Q'+q.id+': '+q.title+'</b><br><br>'+shortText;
  if(code)answer+='<div class="agent-code">'+code+'</div>';
  if(output)answer+='<br><b>Output:</b><br><code>'+output+'</code>';
  answer+='<br><br><span class="agent-tag" onclick="showPage(\'interview-questions\');showInterviewQuestion('+q.id+')">Open full question</span>';
  return answer;
}