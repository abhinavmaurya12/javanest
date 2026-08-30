var JavaChatbot = {
  isOpen: false,
  messages: [],
  hasShownSuggestions: false,
  _pendingTimers: [],

  knowledgeBase: {
    keywords: {
      'inheritance': {
        title: 'Inheritance in Java',
        content: 'Inheritance allows a class to inherit fields and methods from another class. Use the <code>extends</code> keyword.',
        code: 'class Animal {\n    void eat() { System.out.println("Eating..."); }\n}\n\nclass Dog extends Animal {\n    void bark() { System.out.println("Barking..."); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Dog d = new Dog();\n        d.eat();   // inherited\n        d.bark();  // own method\n    }\n}',
        explanation: 'Types: Single, Multilevel, Hierarchical. Java does NOT support multiple inheritance through classes (use interfaces instead).'
      },
      'polymorphism': {
        title: 'Polymorphism in Java',
        content: 'Polymorphism means "many forms". Two types: Compile-time (Method Overloading) and Runtime (Method Overriding).',
        code: '// Compile-time (Overloading)\nclass Calculator {\n    int add(int a, int b) { return a + b; }\n    double add(double a, double b) { return a + b; }\n}\n\n// Runtime (Overriding)\nclass Animal {\n    void sound() { System.out.println("Animal sound"); }\n}\nclass Dog extends Animal {\n    void sound() { System.out.println("Dog barks"); }\n}',
        explanation: 'Overloading = same method name, different parameters. Overriding = same method signature in parent & child.'
      },
      'abstraction': {
        title: 'Abstraction in Java',
        content: 'Abstraction hides implementation details. Achieved using abstract classes and interfaces.',
        code: 'abstract class Shape {\n    abstract double area();\n    void display() { System.out.println("I am a shape"); }\n}\n\nclass Circle extends Shape {\n    double radius;\n    Circle(double r) { this.radius = r; }\n    double area() { return Math.PI * radius * radius; }\n}',
        explanation: 'Abstract classes can have both abstract and concrete methods. Interfaces (Java 8+) can have default and static methods.'
      },
      'encapsulation': {
        title: 'Encapsulation in Java',
        content: 'Encapsulation wraps data and code together, restricting direct access through access modifiers and getters/setters.',
        code: 'public class BankAccount {\n    private double balance;  // hidden\n    \n    public double getBalance() { return balance; }\n    public void deposit(double amt) {\n        if (amt > 0) balance += amt;\n    }\n}',
        explanation: 'Access modifiers: public, protected, default (package), private. Benefits: data protection, controlled access.'
      },
      'exception': {
        title: 'Exception Handling in Java',
        content: 'Exception handling manages runtime errors using try-catch-finally blocks.',
        code: 'try {\n    int[] arr = {1, 2, 3};\n    System.out.println(arr[5]);\n} catch (ArrayIndexOutOfBoundsException e) {\n    System.out.println("Index out of bounds!");\n} finally {\n    System.out.println("Finally block always runs");\n}',
        explanation: 'Checked exceptions (IOException) must be handled. Unchecked (NullPointerException) are runtime errors. Use throw/throws for custom exceptions.'
      },
      'thread': {
        title: 'Multithreading in Java',
        content: 'Multithreading allows concurrent execution of multiple threads.',
        code: 'class MyThread extends Thread {\n    public void run() {\n        for (int i = 0; i < 5; i++) {\n            System.out.println(Thread.currentThread().getName() + ": " + i);\n        }\n    }\n}\n\n// Usage:\nMyThread t1 = new MyThread();\nt1.start();',
        explanation: 'Thread lifecycle: New -> Runnable -> Running -> Waiting -> Terminated. Use synchronized for thread safety.'
      },
      'string': {
        title: 'Java Strings',
        content: 'String is immutable. StringBuffer is mutable and thread-safe. StringBuilder is mutable but not thread-safe.',
        code: 'String s = "Hello";\ns.concat(" World");  // s is still "Hello"\nString s2 = s + " World";  // s2 = "Hello World"\n\nStringBuilder sb = new StringBuilder("Hello");\nsb.append(" World");  // sb = "Hello World"',
        explanation: 'String methods: length(), charAt(), substring(), toLowerCase(), trim(), equals(), indexOf(), replace(), split().'
      },
      'class': {
        title: 'Classes and Objects in Java',
        content: 'A class is a blueprint for creating objects. Objects are instances of classes with state (fields) and behavior (methods).',
        code: 'class Student {\n    String name;\n    int age;\n    \n    void display() {\n        System.out.println(name + " is " + age + " years old");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student s1 = new Student();\n        s1.name = "Alice";\n        s1.age = 20;\n        s1.display();\n        \n        Student s2 = new Student();\n        s2.name = "Bob";\n        s2.age = 22;\n        s2.display();\n    }\n}',
        explanation: 'Use new keyword to create objects. Fields store data, methods define behavior. Every class extends Object implicitly.'
      },
      'array': {
        title: 'Java Arrays',
        content: 'Arrays hold fixed number of values of a single type.',
        code: 'int[] nums = {10, 20, 30, 40, 50};\nSystem.out.println(nums[0]);  // 10\nSystem.out.println(nums.length);  // 5\n\n// 2D Array\nint[][] matrix = {{1,2,3}, {4,5,6}, {7,8,9}};',
        explanation: 'Arrays are objects with fixed length. Use clone() or System.arraycopy() to copy arrays.'
      },
      'constructor': {
        title: 'Constructors in Java',
        content: 'A constructor is called automatically when an object is created. Same name as class, no return type.',
        code: 'class Employee {\n    String name;\n    double salary;\n    \n    Employee() { name = "Unknown"; salary = 0; }\n    Employee(String n, double s) { name = n; salary = s; }\n}',
        explanation: 'Types: Default (no args), Parameterized, Copy constructor. If you define ANY constructor, compiler won\'t provide default.'
      },
      'static': {
        title: 'Static Keyword in Java',
        content: 'static means the member belongs to the class, not to any object.',
        code: 'class Counter {\n    static int count = 0;\n    Counter() { count++; }\n    static void showCount() { System.out.println(count); }\n}\n\nCounter c1 = new Counter();\nCounter.showCount();  // 1',
        explanation: 'Static variables are shared by all objects. Static methods can be called without objects. Static block executes once when class loads.'
      },
      'java_this': {
        title: 'this Keyword in Java',
        content: 'this refers to the current object. Distinguishes instance variables from parameters.',
        code: 'class Person {\n    String name;\n    int age;\n    Person(String name, int age) {\n        this.name = name;  // instance var = param\n        this.age = age;\n    }\n}',
        explanation: 'this can refer to current object, invoke another constructor (this()), or pass as argument.'
      },
      'java_super': {
        title: 'super Keyword in Java',
        content: 'super refers to the parent class. Used to access parent methods, fields, constructors.',
        code: 'class Child extends Parent {\n    Child() {\n        super();  // call parent constructor\n    }\n    void show() {\n        super.show();  // call parent method\n    }\n}',
        explanation: 'super() must be first statement in constructor. Cannot use this() and super() together.'
      },
      'interface': {
        title: 'Interfaces in Java',
        content: 'An interface is a contract that a class must follow. A class can implement multiple interfaces.',
        code: 'interface Vehicle {\n    void start();\n    void stop();\n}\n\ninterface Electric {\n    void charge();\n}\n\nclass Tesla implements Vehicle, Electric {\n    public void start() { System.out.println("Tesla started"); }\n    public void stop() { System.out.println("Tesla stopped"); }\n    public void charge() { System.out.println("Charging..."); }\n}',
        explanation: 'All methods are implicitly public abstract (pre Java 8). Java 8+: default and static methods allowed.'
      },
      'overloading': {
        title: 'Method Overloading',
        content: 'Same method name with different parameter lists in the same class.',
        code: 'class Calculator {\n    int add(int a, int b) { return a + b; }\n    double add(double a, double b) { return a + b; }\n    int add(int a, int b, int c) { return a + b + c; }\n}',
        explanation: 'Overloading is compile-time polymorphism. Can vary by number, type, or order of parameters.'
      },
      'overriding': {
        title: 'Method Overriding',
        content: 'Subclass provides specific implementation of parent\'s method with same signature.',
        code: 'class Animal {\n    void sound() { System.out.println("Animal makes sound"); }\n}\nclass Dog extends Animal {\n    @Override\n    void sound() { System.out.println("Dog barks"); }\n}',
        explanation: 'Overriding is runtime polymorphism. Cannot override static, final, or private methods. Access modifier can be same or less restrictive.'
      },
      'wrapper': {
        title: 'Wrapper Classes in Java',
        content: 'Wrapper classes provide object representations of primitive types.',
        code: 'Integer i = 10;       // Autoboxing\nint n = i;            // Unboxing\n\nInteger.parseInt("123");  // String to int\nString.valueOf(123);       // int to String',
        explanation: 'byte->Byte, short->Short, int->Integer, long->Long, float->Float, double->Double, char->Character, boolean->Boolean'
      },
      'recursion': {
        title: 'Recursion in Java',
        content: 'A method that calls itself to solve a problem by breaking it into smaller sub-problems.',
        code: 'static int factorial(int n) {\n    if (n == 0 || n == 1) return 1;  // base case\n    return n * factorial(n - 1);      // recursive case\n}\n\n// factorial(5) = 5*4*3*2*1 = 120',
        explanation: 'Must have a base case to stop recursion. Java uses stack to track recursive calls.'
      },
      'stream': {
        title: 'Java Streams & File I/O',
        content: 'Streams handle I/O operations. Byte streams for binary, character streams for text.',
        code: 'import java.io.*;\n\ntry (FileWriter fw = new FileWriter("file.txt")) {\n    fw.write("Hello Java!");\n} catch (IOException e) {\n    e.printStackTrace();\n}',
        explanation: 'Use try-with-resources for auto-close. InputStream/OutputStream for bytes, Reader/Writer for characters.'
      },
      'jvm': {
        title: 'JVM, JRE, JDK',
        content: 'JVM executes bytecode. JRE = JVM + class libraries. JDK = JRE + development tools.',
        code: '// Compile and run:\n// javac HelloWorld.java  (compile)\n// java HelloWorld        (run)',
        explanation: 'JDK includes JRE includes JVM. JVM is platform-specific. Bytecode is platform-independent.'
      },
      'oops': {
        title: '4 Pillars of OOP',
        content: 'Encapsulation, Inheritance, Polymorphism, and Abstraction.',
        code: '// Encapsulation: private fields + getters/setters\n// Inheritance: class B extends A\n// Polymorphism: method overloading/overriding\n// Abstraction: abstract class / interface',
        explanation: 'These four principles help organize code, promote reusability, and make programs easier to maintain.'
      },
      'arraylist': {
        title: 'ArrayList in Java',
        content: 'ArrayList is a dynamic array that grows and shrinks as needed.',
        code: 'import java.util.ArrayList;\n\nArrayList<String> list = new ArrayList<>();\nlist.add("Java");\nlist.add("Python");\nlist.remove(0);\nSystem.out.println(list.size());',
        explanation: 'ArrayList methods: add(), remove(), get(), size(), contains(), isEmpty(). Use generics for type safety.'
      },
      'hashmap': {
        title: 'HashMap in Java',
        content: 'HashMap stores key-value pairs. No duplicate keys allowed.',
        code: 'import java.util.HashMap;\n\nHashMap<String, Integer> map = new HashMap<>();\nmap.put("Java", 1);\nmap.put("Python", 2);\nSystem.out.println(map.get("Java"));  // 1\nmap.remove("Python");',
        explanation: 'HashMap methods: put(), get(), remove(), containsKey(), keySet(), values(). Not synchronized.'
      },
      'pattern': {
        title: 'Pattern Programs in Java',
        content: 'Pattern programs use nested loops to print star, number, or alphabet patterns. They are great for practicing loop logic.',
        code: '// Star Triangle Pattern\npublic class StarPattern {\n    public static void main(String[] args) {\n        int n = 5;\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= i; j++) {\n                System.out.print("* ");\n            }\n            System.out.println();\n        }\n    }\n}\n\n// Output:\n// *\n// * *\n// * * *\n// * * * *\n// * * * * *',
        explanation: 'Common patterns: Star triangle, number pyramid, inverted triangle, Floyd\'s triangle, butterfly pattern.'
      },
      'collections': {
        title: 'Java Collections Framework',
        content: 'Collections provide data structures like List, Set, Queue, and Map for storing groups of objects.',
        code: 'import java.util.*;\n\n// ArrayList - ordered, duplicates allowed\nArrayList<String> list = new ArrayList<>();\nlist.add("Java");\nlist.add("Python");\n\n// HashSet - no duplicates\nHashSet<String> set = new HashSet<>();\nset.add("Java");\nset.add("Java"); // ignored\n\n// HashMap - key-value pairs\nHashMap<String, Integer> map = new HashMap<>();\nmap.put("Java", 1);',
        explanation: 'Key interfaces: List (ArrayList, LinkedList), Set (HashSet, TreeSet), Map (HashMap, TreeMap), Queue (PriorityQueue).'
      },
      'enum': {
        title: 'Enum in Java',
        content: 'Enum is a special class that represents a group of constants. Use when you have a fixed set of values.',
        code: 'enum Day {\n    MONDAY, TUESDAY, WEDNESDAY,\n    THURSDAY, FRIDAY, SATURDAY, SUNDAY\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Day today = Day.MONDAY;\n        switch (today) {\n            case MONDAY: System.out.println("Start of work week"); break;\n            case SUNDAY: System.out.println("Rest day"); break;\n        }\n        System.out.println(Day.values().length); // 7\n    }\n}',
        explanation: 'Enum methods: values(), valueOf(), ordinal(), name(). Enums can have fields, constructors, and methods.'
      },
      'package': {
        title: 'Packages in Java',
        content: 'Packages group related classes together. They prevent naming conflicts and control access.',
        code: '// File: com/javanest/utils/Calculator.java\npackage com.javanest.utils;\n\npublic class Calculator {\n    public static int add(int a, int b) { return a + b; }\n}\n\n// File: Main.java\nimport com.javanest.utils.Calculator;\n\npublic class Main {\n    public static void main(String[] args) {\n        int result = Calculator.add(5, 3);\n        System.out.println(result);\n    }\n}',
        explanation: 'java.lang is auto-imported. Use import for other packages. Use import * for all classes in a package.'
      },
      'garbage': {
        title: 'Garbage Collection in Java',
        content: 'Garbage collection automatically reclaims memory by destroying objects that are no longer referenced.',
        code: 'public class GCDemo {\n    public static void main(String[] args) {\n        GCDemo obj1 = new GCDemo();\n        GCDemo obj2 = new GCDemo();\n        obj1 = null; // eligible for GC\n        obj2 = null; // eligible for GC\n        System.gc(); // request GC (not guaranteed)\n    }\n    @Override\n        protected void finalize() {\n        System.out.println("Object destroyed");\n    }\n}',
        explanation: 'Objects with no references become eligible for GC. System.gc() suggests GC but doesn\'t guarantee. finalize() is deprecated in Java 9+.'
      },
      'for': {
        title: 'For Loop in Java',
        content: 'The for loop executes a block of code a fixed number of times.',
        code: '// Basic for loop\nfor (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}\n\n// Enhanced for loop (for-each)\nint[] nums = {10, 20, 30};\nfor (int n : nums) {\n    System.out.println(n);\n}\n\n// Nested for loop\nfor (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 3; j++) {\n        System.out.print(i * j + " ");\n    }\n    System.out.println();\n}',
        explanation: 'Java also has while and do-while loops. Use break to exit and continue to skip iterations.'
      },
      'switch': {
        title: 'Switch Statement in Java',
        content: 'Switch selects one of many code blocks based on an expression value.',
        code: 'int day = 3;\nswitch (day) {\n    case 1: System.out.println("Monday"); break;\n    case 2: System.out.println("Tuesday"); break;\n    case 3: System.out.println("Wednesday"); break;\n    default: System.out.println("Other day");\n}\n\n// Java 14+ switch expression\nString result = switch (day) {\n    case 1 -> "Monday";\n    case 2 -> "Tuesday";\n    case 3 -> "Wednesday";\n    default -> "Other";\n};',
        explanation: 'Works with byte, short, int, char, String, and enum. Missing break causes fall-through.'
      },
      'try': {
        title: 'Try-With-Resources in Java',
        content: 'Auto-closes resources like streams and connections. Used since Java 7.',
        code: 'import java.io.*;\n\ntry (BufferedReader br = new BufferedReader(new FileReader("file.txt"));\n     BufferedWriter bw = new BufferedWriter(new FileWriter("out.txt"))) {\n    String line;\n    while ((line = br.readLine()) != null) {\n        bw.write(line);\n        bw.newLine();\n    }\n} catch (IOException e) {\n    e.printStackTrace();\n}\n// Resources auto-closed here',
        explanation: 'Resources must implement AutoCloseable. Multiple resources separated by semicolons. Finally block still runs if present.'
      },
      'lambda': {
        title: 'Lambda Expressions in Java',
        content: 'Lambdas provide a concise way to implement functional interfaces (single abstract method).',
        code: '// Lambda syntax\n(MathematicalOperation) -> { return a + b; }\n\n// Examples\nList<String> list = Arrays.asList("Java", "Python", "C++");\nlist.forEach(s -> System.out.println(s));\n\nlist.sort((a, b) -> a.compareTo(b));\n\n// With functional interface\n@FunctionalInterface\ninterface Calculator {\n    int calculate(int a, int b);\n}\nCalculator add = (a, b) -> a + b;',
        explanation: 'Lambda is an anonymous function. Used with streams, collections, and functional interfaces. Can capture effectively final variables.'
      },
      'stream_api': {
        title: 'Streams API in Java',
        content: 'Streams provide a functional approach to process collections of data.',
        code: 'import java.util.*;\nimport java.util.stream.*;\n\nList<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");\n\n// Filter, map, collect\nList<String> result = names.stream()\n    .filter(n -> n.length() > 3)\n    .map(String::toUpperCase)\n    .sorted()\n    .collect(Collectors.toList());\n\nSystem.out.println(result); // [ALICE, BOB, CHARLIE, DAVID]\n\n// Sum of even numbers\nint sum = IntStream.range(1, 10)\n    .filter(n -> n % 2 == 0)\n    .sum();',
        explanation: 'Stream operations: filter, map, reduce, collect, sorted, distinct, forEach. Intermediate ops are lazy, terminal ops trigger execution.'
      },
      'default_method': {
        title: 'Default Methods in Interfaces',
        content: 'Java 8 introduced default methods that have a body in interfaces.',
        code: 'interface Vehicle {\n    void start();\n    \n    default void honk() {\n        System.out.println("Beep beep!");\n    }\n}\n\nclass Car implements Vehicle {\n    public void start() {\n        System.out.println("Car started");\n    }\n    // honk() is inherited from interface\n}\n\n// Call:\nCar c = new Car();\nc.start();\nc.honk(); // "Beep beep!"',
        explanation: 'Default methods allow adding new methods to interfaces without breaking existing implementations. Static methods also allowed in interfaces since Java 8.'
      },
      'finalize': {
        title: 'Finalize Method in Java',
        content: 'finalize() is called by GC before destroying an object. Deprecated since Java 9.',
        code: 'class MyClass {\n    @Override\n    protected void finalize() throws Throwable {\n        try {\n            System.out.println("Object is being finalized");\n        } finally {\n            super.finalize();\n        }\n    }\n    public static void main(String[] args) {\n        MyClass obj = new MyClass();\n        obj = null; // eligible for GC\n        System.gc(); // request GC\n    }\n}',
        explanation: 'finalize() is unreliable and deprecated. Use try-with-resources or Cleaner API instead for resource cleanup.'
      },
      'clone': {
        title: 'Clone Method in Java',
        content: 'clone() creates a copy of an object. Class must implement Cloneable.',
        code: 'class Student implements Cloneable {\n    String name;\n    int age;\n    \n    Student(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n    \n    @Override\n    protected Object clone() throws CloneNotSupportedException {\n        return super.clone();\n    }\n}\n\nStudent s1 = new Student("Alice", 20);\nStudent s2 = (Student) s1.clone();\nSystem.out.println(s2.name); // Alice',
        explanation: 'Shallow copy: copies references. Deep copy: copies objects. Use @Override clone() for custom copy logic.'
      },
      'autoboxing': {
        title: 'Autoboxing & Unboxing in Java',
        content: 'Automatic conversion between primitive types and their wrapper classes.',
        code: '// Autoboxing: primitive -> wrapper\nInteger num = 10;          // int -> Integer\nDouble d = 3.14;           // double -> Double\nBoolean b = true;          // boolean -> Boolean\n\n// Unboxing: wrapper -> primitive\nint n = num;               // Integer -> int\ndouble val = d;            // Double -> double\n\n// In collections\nArrayList<Integer> list = new ArrayList<>();\nlist.add(42);              // autoboxing\nint x = list.get(0);      // unboxing',
        explanation: 'Java automatically converts between primitives and wrappers. Happens in assignments, method calls, and collections.'
      },
      'casting': {
        title: 'Type Casting in Java',
        content: 'Converting one data type to another. Two types: widening (implicit) and narrowing (explicit).',
        code: '// Widening (implicit) - smaller to larger\nint i = 100;\nlong l = i;      // int -> long\nfloat f = l;     // long -> float\n\n// Narrowing (explicit) - larger to smaller\ndouble d = 9.78;\nint n = (int) d;  // double -> int, result: 9\n\n// Upcasting (implicit)\nAnimal a = new Dog();  // Dog -> Animal\n\n// Downcasting (explicit)\nDog d2 = (Dog) a;  // Animal -> Dog',
        explanation: 'Widening: automatic, no data loss. Narrowing: manual, may lose data. Use instanceof before downcasting.'
      },
      'var': {
        title: 'Var Keyword in Java',
        content: 'Java 10 introduced var for local variable type inference.',
        code: '// Before Java 10\nString name = "Java";\nArrayList<String> list = new ArrayList<>();\n\n// With var (Java 10+)\nvar name = "Java";              // inferred as String\nvar list = new ArrayList<String>(); // inferred as ArrayList<String>\nvar num = 100;                  // inferred as int\nvar PI = 3.14;                  // inferred as double\n\n// Enhanced for loop\nfor (var item : list) {\n    System.out.println(item);\n}',
        explanation: 'var can only be used for local variables with initializers. Not for fields, parameters, or return types. Makes code concise.'
      }
    },

    relatedTerms: {
      'inheritance': ['extends', 'child', 'parent', 'subclass', 'base class', 'is-a'],
      'polymorphism': ['overload', 'override', 'overloading', 'overriding', 'runtime polymorphism', 'compile time'],
      'abstraction': ['abstract class', 'abstract', 'interface', 'implements'],
      'encapsulation': ['private', 'getter', 'setter', 'access modifier', 'data hiding'],
      'exception': ['try', 'catch', 'finally', 'throw', 'throws', 'exception', 'error', 'checked', 'unchecked'],
      'thread': ['thread', 'synchronized', 'concurrent', 'parallel', 'multithreading', 'deadlock'],
      'string': ['stringbuffer', 'stringbuilder', 'immutable', 'mutable', 'string'],
      'array': ['arrays', 'array', 'index', 'length'],
      'arraylist': ['arraylist', 'dynamic array', 'list', 'collection', 'arraylist vs'],
      'constructor': ['constructor', 'default constructor', 'parameterized', 'copy constructor'],
      'class': ['class', 'object', 'instance', 'blueprint', 'fields', 'methods', 'new'],
      'this': ['this keyword', 'this.', 'this()'],
      'super': ['super keyword', 'super.', 'super()'],
      'interface': ['interface', 'implements', 'default method', 'functional interface'],
      'wrapper': ['autoboxing', 'unboxing', 'wrapper', 'parseint', 'integer', 'boxing'],
      'recursion': ['recursive', 'factorial', 'fibonacci', 'base case', 'call stack'],
      'stream': ['file', 'io', 'inputstream', 'outputstream', 'reader', 'writer', 'buffered'],
      'jvm': ['jvm', 'jre', 'jdk', 'bytecode', 'virtual machine', 'garbage collection'],
      'oops': ['oop', 'object', 'pillars', 'four pillars'],
      'hashmap': ['hashmap', 'map', 'key value', 'hashtable', 'linkedhashmap'],
      'overloading': ['method overloading', 'compile time polymorphism'],
      'overriding': ['method overriding', 'runtime polymorphism', '@override'],
      'static': ['static keyword', 'static method', 'static variable', 'static block'],
      'wrapper': ['autoboxing', 'unboxing', 'wrapper class', 'integer', 'parseint'],
      'pattern': ['pattern', 'star pattern', 'number pattern', 'triangle', 'pyramid', 'floyd', 'butterfly', 'diamond', 'hollow'],
      'collections': ['collection', 'arraylist', 'hashset', 'treeset', 'linkedlist', 'list', 'set', 'map', 'queue', 'deque'],
      'enum': ['enum', 'enumeration', 'constants', 'enum values'],
      'package': ['package', 'import', 'java.lang', 'java.util', 'java.io'],
      'garbage': ['garbage', 'gc', 'finalize', 'memory', 'heap', 'collect'],
      'for': ['for loop', 'for-each', 'enhanced for', 'nested loop', 'loops'],
      'switch': ['switch', 'case', 'break', 'default', 'fall-through'],
      'try': ['try-with-resources', 'auto close', 'try', 'resources'],
      'lambda': ['lambda', 'arrow', 'functional interface', 'anonymous function', '->'],
      'stream_api': ['stream', 'filter', 'map', 'reduce', 'collect', 'streams'],
      'default_method': ['default method', 'default', 'interface method'],
      'finalize': ['finalize', 'finalizer', 'object destruction'],
      'clone': ['clone', 'cloneable', 'copy', 'shallow copy', 'deep copy'],
      'autoboxing': ['autoboxing', 'unboxing', 'auto', 'primitive', 'wrapper'],
      'casting': ['casting', 'type cast', 'widening', 'narrowing', 'upcast', 'downcast', 'instanceof'],
      'var': ['var', 'inference', 'local variable', 'type inference', 'java 10']
    },

    greetings: {
      'hello': 'Hello! I\'m JavaNest AI Assistant. I can help you with Java concepts, code examples, interview preparation, practice programs, DSA topics, and guide you through the entire website. What would you like to know?',
      'hi': 'Hi there! I\'m here to help you with Java. Ask me about any concept, interview question, practice program, or DSA topic!',
      'hey': 'Hey! Ready to help with Java. I can answer from 51 interview questions, 15 chapters, 200+ practice programs, 80+ book chapters, and 30 DSA topics. Ask away!',
      'good morning': 'Good morning! Ready to learn some Java? I can help with concepts, code, interviews, and more.',
      'good afternoon': 'Good afternoon! What Java topic can I help with today?',
      'good evening': 'Good evening! Let\'s dive into Java together. Ask me anything!'
    },

    fallbacks: [
      'I can help with many Java topics! Try asking about: inheritance, polymorphism, abstraction, encapsulation, exception handling, threads, strings, arrays, patterns, collections, lambda, streams, enums, packages, constructors, static keyword, or try-with-resources.',
      'I know many Java concepts! Ask me about OOP principles, data types, loops, switch, casting, var keyword, autoboxing, cloning, garbage collection, or streams API.',
      'I\'m not sure about that. Try topics like: "What is pattern program?", "Explain polymorphism", "Java collections", "Lambda expressions", or "What is enum?"'
    ]
  },

  escapeHtml: function(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  },

  stripHtml: function(html) {
    var d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent || d.innerText || '';
  },

  extractCode: function(html) {
    if (!html) return '';
    var matches = html.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/g);
    if (matches) {
      var codes = [];
      matches.forEach(function(m) {
        var c = m.replace(/<\/?pre>/g, '').replace(/<\/?code>/g, '').replace(/<span class="kw">/g, '').replace(/<span class="cls">/g, '').replace(/<span class="mth">/g, '').replace(/<span class="str">/g, '').replace(/<span class="cmt">/g, '').replace(/<\/span>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/<br\s*\/?>/g, '\n').trim();
        if (c.length > 20) codes.push(c);
      });
      return codes.length > 0 ? codes[0] : '';
    }
    if (typeof html === 'string' && html.length > 20) return html.trim();
    return '';
  },

  extractOutput: function(html) {
    var m = html.match(/<div class="output-block">([\s\S]*?)<\/div>/);
    if (!m) return '';
    return m[1].replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').trim();
  },

  searchInterview: function(q) {
    if (typeof interviewQuestions === 'undefined') return null;
    var scored = [];
    var keywords = q.replace(/[?!.]/g, '').split(/\s+/).filter(function(w) { return w.length > 2; });
    interviewQuestions.forEach(function(qq) {
      var titleLow = qq.title.toLowerCase();
      var textLow = this.stripHtml(qq.content).toLowerCase();
      var score = 0;
      keywords.forEach(function(kw) {
        if (titleLow.includes(kw)) score += 10;
        if (textLow.includes(kw)) score += 2;
      });
      if (score >= 6) scored.push({ q: qq, score: score });
    }.bind(this));
    scored.sort(function(a, b) { return b.score - a.score; });
    if (scored.length > 0) {
      var best = scored[0].q;
      var text = this.stripHtml(best.content);
      var code = this.extractCode(best.content);
      var output = this.extractOutput(best.content);
      var shortText = text.length > 600 ? text.substring(0, 600) + '...' : text;
      var answer = '<b>Q' + best.id + ': ' + best.title + '</b><br><br>' + shortText;
      if (code) answer += '<div class="agent-code">' + code + '</div>';
      if (output) answer += '<br><b>Output:</b><br><code>' + output + '</code>';
      answer += '<br><br><span class="agent-tag" onclick="askChatbot(\'related questions to ' + best.title.replace(/'/g, "\\'") + '\')">Related questions</span>';
      return answer;
    }
    return null;
  },

  searchLessons: function(q) {
    if (typeof lessons === 'undefined') return null;
    for (var i = 0; i < lessons.length; i++) {
      var content = (typeof lessons[i].content === 'string') ? lessons[i].content.toLowerCase() : '';
      if (content.includes(q)) {
        return 'This topic is covered in <b>Chapter ' + (i + 1) + ': ' + lessons[i].title + '</b><br><br>Click <span class="agent-tag" onclick="searchGoLearn(' + i + ')">Open Chapter ' + (i + 1) + '</span> to read the full content with code examples!';
      }
    }
    return null;
  },

  searchPractice: function(q) {
    if (!window.practiceData) return null;
    var files = [];
    Object.keys(window.practiceData).forEach(function(cat) {
      var c = window.practiceData[cat];
      if (c && c.files) {
        Object.keys(c.files).forEach(function(f) {
          var code = (typeof c.files[f] === 'string') ? c.files[f] : '';
          if (f.toLowerCase().includes(q) || code.toLowerCase().includes(q)) {
            var catId = (typeof categoryNameToId !== 'undefined' && categoryNameToId[cat]) ? categoryNameToId[cat] : 'basic';
            files.push({ name: f, cat: cat, catId: catId, code: code });
          }
        });
      }
    });
    if (files.length > 0) {
      var r = 'Found <b>' + files.length + '</b> matching .java file(s):<br><br>';
      files.slice(0, 3).forEach(function(f) {
        r += '<b>' + f.name + '</b> <span style="color:var(--text-muted);font-size:.75rem">(' + f.cat + ')</span><br>';
        r += '<div class="agent-code">' + f.code + '</div>';
        var safeFile = f.name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        r += '<span class="agent-tag" onclick="searchGoPractice(\'' + f.catId + '\',\'' + safeFile + '\')">Open in Practice Code</span> ';
      });
      if (files.length > 3) r += '<br><span style="color:var(--text-muted);font-size:.8rem">...and ' + (files.length - 3) + ' more. Use the search bar to find them all.</span>';
      return r;
    }
    return null;
  },

  searchJavaPro: function(q) {
    if (!window.javaproData) return null;
    for (var j = 0; j < javaproData.length; j++) {
      if (javaproData[j].title.toLowerCase().includes(q)) {
        return 'Found in <b>JavaPro Book — Ch ' + javaproData[j].id + ': ' + javaproData[j].title + '</b><br><br><span class="agent-tag" onclick="searchGoJavaPro(' + javaproData[j].id + ')">Open Chapter</span>';
      }
    }
    return null;
  },

  searchDSA: function(q) {
    if (typeof dsaTopics === 'undefined') return null;
    var bestMatch = null;
    var bestScore = 0;
    Object.keys(dsaTopics).forEach(function(key) {
      var topic = dsaTopics[key];
      var titleLow = (topic.title || '').toLowerCase();
      var contentLow = (topic.content || '').toLowerCase();
      var score = 0;
      if (titleLow.includes(q)) score += 10;
      if (contentLow.includes(q)) score += 2;
      var words = q.replace(/[?!.]/g, '').split(/\s+/);
      words.forEach(function(w) {
        if (w.length > 2 && titleLow.includes(w)) score += 5;
        if (w.length > 2 && contentLow.includes(w)) score += 1;
      });
      if (score > bestScore) {
        bestScore = score;
        bestMatch = topic;
      }
    });
    if (bestMatch && bestScore >= 5) {
      var text = this.stripHtml(bestMatch.content);
      var shortText = text.length > 500 ? text.substring(0, 500) + '...' : text;
      var answer = '<b>' + bestMatch.title + '</b> (DSA Topic)<br><br>' + shortText;
      if (bestMatch.videoSection) {
        answer += '<br><br><span class="agent-tag" onclick="showPage(\'dsa\')">Open DSA Chapter</span>';
      }
      return answer;
    }
    return null;
  },

  searchKeywordKB: function(q) {
    var kb = this.knowledgeBase.keywords;
    var related = this.knowledgeBase.relatedTerms;
    var bestMatch = null;
    var bestScore = 0;

    for (var keyword in kb) {
      var score = 0;
      var searchKey = keyword === 'java_this' ? 'this' : (keyword === 'java_super' ? 'super' : keyword);
      var regex = new RegExp('\\b' + searchKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
      if (regex.test(q)) score += 5;
      else if (q.includes(searchKey)) score += 2;

      if (related[keyword]) {
        for (var r = 0; r < related[keyword].length; r++) {
          if (q.includes(related[keyword][r])) {
            score += 1;
          }
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = keyword;
      }
    }

    if (bestMatch && bestScore >= 3) {
      var entry = kb[bestMatch];
      var response = '<strong>' + entry.title + '</strong>\n\n' + entry.content;
      if (entry.code) {
        response += '\n<pre><code>' + entry.code + '</code></pre>';
      }
      if (entry.explanation) {
        response += '\n<p style="margin-top:8px;color:var(--text-muted);font-size:.85rem">' + entry.explanation + '</p>';
      }
      return response;
    }
    return null;
  },

  processQuery: function(query) {
    var q = query.toLowerCase().trim();

    // Check greetings
    var greetings = this.knowledgeBase.greetings;
    for (var gKey in greetings) {
      if (q === gKey || q.startsWith(gKey + ' ') || q.endsWith(' ' + gKey) || q === gKey + '!' || q === gKey + '?') {
        return greetings[gKey];
      }
    }

    // Capability questions
    if (q.match(/what can you|what do you|help me|how to use|guide me|capability/)) {
      return 'I can answer questions from multiple sources:<br><br>' +
        '<b>Data Sources:</b><br>' +
        '• 51 Interview Q&A with code & output<br>' +
        '• 15 Learn chapters with full content<br>' +
        '• 200+ Practice .java programs<br>' +
        '• 80+ JavaPro book chapters<br>' +
        '• 30 DSA topics with video lectures<br>' +
        '• 28 core Java concepts with code<br><br>' +
        '<b>Quick Actions:</b><br>' +
        '• "Interview questions" — browse all Q&A<br>' +
        '• "Practice programs" — find code examples<br>' +
        '• "JavaPro chapters" — book reference<br>' +
        '• "DSA topics" — data structures & algorithms<br>' +
        '• "Learn Java" — open chapter content<br><br>' +
        'Just ask about any Java topic!';
    }

    // Website navigation help
    if (q.match(/how to use|how.*website|navigate|find|search/)) {
      return 'Here\'s how to use JavaNest:<br><br>' +
        '<b>Learn</b> — 15 structured chapters from basics to advanced<br>' +
        '<b>DSA</b> — 30 data structure & algorithm topics with video lectures<br>' +
        '<b>Practice Code</b> — 200+ runnable .java programs in 16 categories<br>' +
        '<b>Projects</b> — Hands-on Java projects<br>' +
        '<b>Interview Q&A</b> — 51 questions with answers and code<br>' +
        '<b>Book</b> — 80+ JavaPro reference chapters<br>' +
        '<b>Try It</b> — Online Java compiler<br><br>' +
        'Use the <b>search bar</b> (Ctrl+K) to find any topic instantly across all sections!';
    }

    // Search all data sources in priority order
    var result = this.searchInterview(q);
    if (result) return result;

    result = this.searchLessons(q);
    if (result) return result;

    result = this.searchPractice(q);
    if (result) return result;

    result = this.searchJavaPro(q);
    if (result) return result;

    result = this.searchDSA(q);
    if (result) return result;

    result = this.searchKeywordKB(q);
    if (result) return result;

    // Specific pattern: "difference / vs"
    if (q.includes('difference') || q.includes(' vs ')) {
      if (q.includes('string') && (q.includes('stringbuffer') || q.includes('stringbuilder'))) {
        return '<strong>String vs StringBuffer vs StringBuilder</strong>\n\n<pre><code>// String - immutable\nString s = "Hello";\ns.concat(" World"); // s is still "Hello"\n\n// StringBuffer - mutable, synchronized\nStringBuffer sb = new StringBuffer("Hello");\nsb.append(" World"); // sb = "Hello World"\n\n// StringBuilder - mutable, NOT synchronized\nStringBuilder sb2 = new StringBuilder("Hello");\nsb2.append(" World"); // sb2 = "Hello World"</code></pre>\n\n<p style="margin-top:8px;color:var(--text-muted);font-size:.85rem">String: immutable, slow for concatenation<br>StringBuffer: mutable, thread-safe (synchronized)<br>StringBuilder: mutable, fastest (not thread-safe)</p>';
      }
      if (q.includes('array') && q.includes('arraylist')) {
        return '<strong>Array vs ArrayList</strong>\n\n<pre><code>// Array - fixed size\nint[] arr = new int[5];\narr[0] = 10;\n\n// ArrayList - dynamic size\nArrayList&lt;Integer&gt; list = new ArrayList&lt;&gt;();\nlist.add(10);\nlist.remove(0);</code></pre>\n\n<p style="margin-top:8px;color:var(--text-muted);font-size:.85rem">Array: fixed size, faster, primitive types<br>ArrayList: dynamic, slower, objects only, rich API</p>';
      }
      if (q.includes('abstract') && q.includes('interface')) {
        return '<strong>Abstract Class vs Interface</strong>\n\n<pre><code>// Abstract class\nabstract class Shape {\n    abstract double area();\n    void display() { } // concrete method\n}\n\n// Interface\ninterface Drawable {\n    void draw();\n    default void color() { } // Java 8+\n}</code></pre>\n\n<p style="margin-top:8px;color:var(--text-muted);font-size:.85rem">Abstract Class: single inheritance, constructors, any variable type<br>Interface: multiple inheritance, no constructors, public static final vars only</p>';
      }
    }

    if (q.includes('what is') && (q.includes('java') || q.includes('jvm') || q.includes('jre') || q.includes('jdk'))) {
      return '<strong>Java Programming Language</strong>\n\nJava is a high-level, object-oriented, platform-independent language developed by Sun Microsystems in 1995.\n\nKey features:\n- Platform Independent (WORA)\n- Object-Oriented\n- Simple and Secure\n- Robust and Multithreaded\n- High Performance\n\nAsk about specific Java topics like inheritance, polymorphism, or exception handling!';
    }

    if (q.includes('how') && q.includes('compile')) {
      return '<strong>How to Compile Java</strong>\n\n<pre><code>javac HelloWorld.java    // Compile\njava HelloWorld          // Run</code></pre>\n\nRequires JDK installed. Use <code>java -version</code> to verify installation.';
    }

    // Code examples
    if (q.match(/code|program|example|show.*me|practice/)) {
      var topics = ['Hello World', 'Arrays', 'Inheritance', 'Polymorphism', 'Exception Handling', 'Multithreading', 'Constructors', 'Encapsulation', 'Abstract Classes', 'Interfaces', 'String Methods', 'Collections', 'File I/O', 'Patterns', 'Switch Statement'];
      return 'What topic do you want?<br><br>' + topics.map(function(t) { return '<span class="agent-tag" onclick="askChatbot(\'' + t + ' code example\')">' + t + '</span>'; }).join(' ');
    }

    if (q.match(/hello.*world|first.*program|basic.*code|start/))
      return 'Hello World Program:<div class="agent-code">public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}</div>This is Chapter 1 of JavaNest!';
    if (q.match(/array.*code|show.*array|code.*array/))
      return 'Array Example:<div class="agent-code">public class ArrayDemo {\n    public static void main(String[] args) {\n        int[] nums = {10, 20, 30, 40, 50};\n        for (int i = 0; i < nums.length; i++) {\n            System.out.println(nums[i]);\n        }\n    }\n}</div>';
    if (q.match(/inheritance.*code|extends.*code|show.*inherit/))
      return 'Inheritance Example:<div class="agent-code">class Animal {\n    void eat() { System.out.println("Animal eats"); }\n}\nclass Dog extends Animal {\n    void bark() { System.out.println("Dog barks"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Dog d = new Dog();\n        d.eat();\n        d.bark();\n    }\n}</div>';
    if (q.match(/exception.*code|try.*catch.*code/))
      return 'Exception Handling:<div class="agent-code">try {\n    int result = 10 / 0;\n} catch (ArithmeticException e) {\n    System.out.println("Cannot divide by zero!");\n} finally {\n    System.out.println("Finally always runs");\n}</div>';
    if (q.match(/thread.*code|multithread.*code/))
      return 'Multithreading:<div class="agent-code">class MyThread extends Thread {\n    public void run() {\n        for (int i = 1; i <= 5; i++) {\n            System.out.println(getName() + " - " + i);\n            try { Thread.sleep(500); }\n            catch (InterruptedException e) {}\n        }\n    }\n}\n// MyThread t1 = new MyThread();\n// t1.start();</div>';
    if (q.match(/encapsul|getter.*setter/))
      return 'Encapsulation:<div class="agent-code">public class BankAccount {\n    private double balance;\n    public double getBalance() { return balance; }\n    public void deposit(double amt) {\n        if (amt > 0) balance += amt;\n    }\n    public void withdraw(double amt) {\n        if (amt > 0 && amt <= balance)\n            balance -= amt;\n    }\n}</div>';
    if (q.match(/constructor|this\(\)|super\(\)/))
      return 'Constructor Chaining:<div class="agent-code">public class Student {\n    String name; int age;\n    Student() { this("Unknown", 0); }\n    Student(String name) { this(name, 25); }\n    Student(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n}</div>';
    if (q.match(/polymorphi|method.*overrid/))
      return 'Polymorphism:<div class="agent-code">class Shape {\n    double area() { return 0; }\n}\nclass Circle extends Shape {\n    double r;\n    Circle(double r) { this.r = r; }\n    double area() { return Math.PI * r * r; }\n}\nclass Rect extends Shape {\n    double w, h;\n    Rect(double w, double h) { this.w=w; this.h=h; }\n    double area() { return w * h; }\n}</div>';
    if (q.match(/interface.*code|implements/))
      return 'Interface:<div class="agent-code">interface Vehicle {\n    void start();\n    void stop();\n}\nclass Car implements Vehicle {\n    public void start() {\n        System.out.println("Car starts with key");\n    }\n    public void stop() {\n        System.out.println("Car stops");\n    }\n}</div>';
    if (q.match(/abstract.*code|abstract.*class.*code/))
      return 'Abstract Class:<div class="agent-code">abstract class Shape {\n    String color;\n    Shape(String c) { color = c; }\n    abstract double area();\n    void display() {\n        System.out.println(color + " area=" + area());\n    }\n}\nclass Circle extends Shape {\n    double r;\n    Circle(String c, double r) { super(c); this.r=r; }\n    double area() { return Math.PI*r*r; }\n}</div>';

    if (q.match(/thank|thanks|great|awesome|perfect|nice/))
      return 'You\'re welcome! 😊 Happy learning! Ask me anything else about Java.';

    if (q.match(/interview|prepare|exam|job/))
      return 'You have <b>51 interview questions</b> with full answers, code examples, and output. Topics include OOP, constructors, polymorphism, access modifiers, exception handling, and more. Click <b>Interview Q&A</b> in the nav bar, or ask me any specific question!';

    // Final fallback
    var fallbacks = this.knowledgeBase.fallbacks;
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  },

  init: function() {
    this.createUI();
    this.bindEvents();
    this.addBotMessage('Hello! I\'m JavaNest AI Assistant. I can help you with Java concepts, code examples, interview preparation, practice programs, DSA topics, and guide you through the entire website.\n\nAsk me anything about Java!');
  },

  createUI: function() {
    var fab = document.createElement('button');
    fab.className = 'chatbot-fab';
    fab.id = 'chatFab';
    fab.innerHTML = '<i class="fas fa-robot"></i>';
    fab.title = 'Java AI Assistant';
    document.body.appendChild(fab);

    var panel = document.createElement('div');
    panel.className = 'chatbot-panel';
    panel.id = 'chatPanel';
    panel.innerHTML = '<div class="chatbot-header">' +
      '<div class="chatbot-header-avatar"><i class="fas fa-robot"></i></div>' +
      '<div class="chatbot-header-info"><h3>JavaNest AI</h3><p>Ask me about Java</p></div>' +
      '<button class="chatbot-header-close" id="chatClose"><i class="fas fa-times"></i></button>' +
      '</div>' +
      '<div class="chatbot-messages" id="chatMessages"></div>' +
      '<div class="chat-suggestions" id="chatSuggestions">' +
      '<button class="chat-suggestion-btn" data-q="Interview questions">Interview Q&A</button>' +
      '<button class="chat-suggestion-btn" data-q="Practice programs">Practice Code</button>' +
      '<button class="chat-suggestion-btn" data-q="JavaPro chapters">JavaPro Book</button>' +
      '<button class="chat-suggestion-btn" data-q="DSA topics">DSA Topics</button>' +
      '<button class="chat-suggestion-btn" data-q="What is inheritance?">Inheritance</button>' +
      '<button class="chat-suggestion-btn" data-q="Explain polymorphism">Polymorphism</button>' +
      '<button class="chat-suggestion-btn" data-q="What is abstraction?">Abstraction</button>' +
      '<button class="chat-suggestion-btn" data-q="What is encapsulation?">Encapsulation</button>' +
      '<button class="chat-suggestion-btn" data-q="Explain exception handling">Exceptions</button>' +
      '<button class="chat-suggestion-btn" data-q="What is multithreading?">Threading</button>' +
      '<button class="chat-suggestion-btn" data-q="Java strings">Strings</button>' +
      '<button class="chat-suggestion-btn" data-q="Java arrays">Arrays</button>' +
      '<button class="chat-suggestion-btn" data-q="What is pattern program?">Patterns</button>' +
      '<button class="chat-suggestion-btn" data-q="Java collections">Collections</button>' +
      '<button class="chat-suggestion-btn" data-q="Explain lambda expressions">Lambda</button>' +
      '<button class="chat-suggestion-btn" data-q="What is enum in Java?">Enum</button>' +
      '</div>' +
      '<div class="chatbot-input">' +
      '<input type="text" id="chatInput" placeholder="Ask about Java..." autocomplete="off">' +
      '<button id="chatSend"><i class="fas fa-paper-plane"></i></button>' +
      '</div>';
    document.body.appendChild(panel);
  },

  bindEvents: function() {
    var self = this;
    document.getElementById('chatFab').addEventListener('click', function() { self.toggle(); });
    document.getElementById('chatClose').addEventListener('click', function() { self.toggle(); });
    document.getElementById('chatSend').addEventListener('click', function() { self.sendMessage(); });
    document.getElementById('chatInput').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') self.sendMessage();
    });
    document.querySelectorAll('.chat-suggestion-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var q = this.getAttribute('data-q');
        document.getElementById('chatInput').value = q;
        self.sendMessage();
      });
    });
  },

  toggle: function() {
    this.isOpen = !this.isOpen;
    var panel = document.getElementById('chatPanel');
    var fab = document.getElementById('chatFab');
    panel.classList.toggle('open', this.isOpen);
    if (this.isOpen) {
      fab.style.animation = 'none';
      document.getElementById('chatInput').focus();
      this.scrollToBottom();
    } else {
      fab.style.animation = '';
    }
  },

  addMessageToDOM: function(msg) {
    var container = document.getElementById('chatMessages');
    var div = document.createElement('div');
    div.className = 'chat-msg ' + msg.role;
    var avatarIcon = msg.role === 'bot' ? 'fa-robot' : 'fa-user';
    div.innerHTML = '<div class="chat-msg-avatar"><i class="fas ' + avatarIcon + '"></i></div>' +
      '<div class="chat-msg-bubble">' + msg.text + '</div>';
    container.appendChild(div);
    if (msg.role === 'bot') {
      this.highlightCodeInElement(div.querySelector('.chat-msg-bubble'));
    }
  },

  addBotMessage: function(text) {
    this.messages.push({ role: 'bot', text: text });
    this.addMessageToDOM(this.messages[this.messages.length - 1]);
    this.scrollToBottom();
  },

  addUserMessage: function(text) {
    var safeText = this.escapeHtml(text);
    this.messages.push({ role: 'user', text: safeText });
    this.addMessageToDOM(this.messages[this.messages.length - 1]);
    this.scrollToBottom();
  },

  highlightCodeInElement: function(el) {
    if (!el) return;
    var codeEls = el.querySelectorAll('pre code');
    codeEls.forEach(function(codeEl) {
      var text = codeEl.textContent;
      var html = text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|try|void|volatile|while|var)\b/g, '<span class="kw">$1</span>')
        .replace(/@(\w+)/g, '<span class="kw">@$1</span>')
        .replace(/\b([A-Z]\w*)\b/g, '<span class="cls">$1</span>')
        .replace(/\b([a-z_]\w*)\s*\(/g, '<span class="mth">$1</span>(')
        .replace(/"([^"]*)"/g, '<span class="str">"$1"</span>');
      codeEl.innerHTML = html;
    });
  },

  scrollToBottom: function() {
    var el = document.getElementById('chatMessages');
    if (!el) return;
    requestAnimationFrame(function() { el.scrollTop = el.scrollHeight; });
  },

  hideSuggestions: function() {
    if (!this.hasShownSuggestions) {
      this.hasShownSuggestions = true;
      var sug = document.getElementById('chatSuggestions');
      if (sug) sug.style.display = 'none';
    }
  },

  sendMessage: function() {
    var input = document.getElementById('chatInput');
    var text = input.value.trim();
    if (!text) return;

    this.hideSuggestions();
    this.addUserMessage(text);
    input.value = '';

    for (var t = 0; t < this._pendingTimers.length; t++) {
      clearTimeout(this._pendingTimers[t]);
    }
    this._pendingTimers = [];

    var container = document.getElementById('chatMessages');
    var typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot';
    typingDiv.id = 'chatTypingIndicator';
    typingDiv.innerHTML = '<div class="chat-msg-avatar"><i class="fas fa-robot"></i></div>' +
      '<div class="chat-msg-bubble"><div class="chat-typing"><span></span><span></span><span></span></div></div>';
    container.appendChild(typingDiv);
    this.scrollToBottom();

    var self = this;
    var timer = setTimeout(function() {
      var indicator = document.getElementById('chatTypingIndicator');
      if (indicator) indicator.parentNode.removeChild(indicator);
      var response = self.processQuery(text);
      self.addBotMessage(response);
    }, 600 + Math.random() * 600);
    this._pendingTimers.push(timer);
  }
};

function askChatbot(query) {
  if (typeof JavaChatbot === 'undefined') return;
  var panel = document.getElementById('chatPanel');
  var input = document.getElementById('chatInput');
  if (!panel || !input) return;
  if (!panel.classList.contains('open')) {
    JavaChatbot.toggle();
  }
  input.value = query;
  JavaChatbot.sendMessage();
}

document.addEventListener('DOMContentLoaded', function() {
  JavaChatbot.init();
});
