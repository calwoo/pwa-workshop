# JavaScript Fundamentals for PWA Development

## Introduction

This guide covers the JavaScript concepts used in Lessons 1-3. If you're new to web development, this will help you understand **why** the code works the way it does.

---

## Table of Contents

1. [Variables: const, let, and var](#variables-const-let-and-var)
2. [Data Types](#data-types)
3. [Functions and Arrow Functions](#functions-and-arrow-functions)
4. [Objects and Classes](#objects-and-classes)
5. [Arrays and Array Methods](#arrays-and-array-methods)
6. [DOM Manipulation](#dom-manipulation)
7. [Event Listeners](#event-listeners)
8. [LocalStorage API](#localstorage-api)
9. [JSON: JavaScript Object Notation](#json-javascript-object-notation)
10. [Asynchronous JavaScript](#asynchronous-javascript)
11. [Browser APIs](#browser-apis)
12. [Modern JavaScript (ES6+)](#modern-javascript-es6)

---

## Variables: const, let, and var

### The Three Ways to Declare Variables

```javascript
var oldWay = 'avoid this';     // Old style (pre-2015)
let mutable = 'can change';    // Modern mutable variable
const immutable = 'cannot change'; // Modern immutable variable
```

### Why We Use `const` and `let`

**In our code:**
```javascript
const STORAGE_KEY = 'pwa-tasks';  // Never changes
let tasks = [];                   // Changes when we add/remove tasks
```

**Rule of Thumb**:
- Use `const` by default (most things don't need to change)
- Use `let` when you need to reassign (counters, accumulating values)
- Never use `var` (it has confusing scoping rules)

### Example from Our Task Manager

```javascript
const taskInput = document.getElementById('task-input'); // Element never changes
let currentFilter = 'all'; // Changes when user clicks filter buttons
```

---

## Data Types

JavaScript has **7 primitive types** + objects:

### Primitives

```javascript
// 1. String (text)
const name = 'Task Manager';
const template = `Hello ${name}`; // Template literal (uses backticks)

// 2. Number (integers and decimals)
const count = 42;
const price = 19.99;

// 3. Boolean (true/false)
const isCompleted = true;
const isActive = false;

// 4. Undefined (not assigned yet)
let unassigned;
console.log(unassigned); // undefined

// 5. Null (intentionally empty)
const noValue = null;

// 6. BigInt (huge numbers)
const huge = 9007199254740991n;

// 7. Symbol (unique identifier)
const unique = Symbol('description');
```

### Objects (Complex Types)

```javascript
// Object: key-value pairs
const task = {
    id: '123',
    text: 'Learn JavaScript',
    completed: false
};

// Array: ordered list
const tasks = [task1, task2, task3];

// Function: reusable code block
function addTask(text) {
    // code here
}
```

### In Our Task Manager

```javascript
// Task object
class Task {
    constructor(text) {
        this.id = Date.now().toString();      // String
        this.text = text;                     // String
        this.completed = false;               // Boolean
        this.createdAt = new Date().toISOString(); // String
    }
}

// Array of tasks
let tasks = []; // Starts empty, will hold Task objects
```

---

## Functions and Arrow Functions

### Traditional Function Declaration

```javascript
function greet(name) {
    return `Hello, ${name}!`;
}

const message = greet('Calvin'); // "Hello, Calvin!"
```

### Arrow Functions (Modern Syntax)

```javascript
// Single line, implicit return
const greet = (name) => `Hello, ${name}!`;

// Multiple lines, explicit return
const greetFormal = (name) => {
    const greeting = `Hello, ${name}!`;
    return greeting;
};

// No parameters
const sayHello = () => 'Hello!';

// Single parameter (parentheses optional)
const double = x => x * 2;
```

### In Our Code

```javascript
// Traditional function
function loadTasks() {
    try {
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        tasks = storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
        console.error('Error loading tasks:', error);
        tasks = [];
    }
}

// Arrow function as callback
filterButtons.forEach(btn => {
    btn.addEventListener('click', handleFilterChange);
});

// Arrow function in array method
const activeTasks = tasks.filter(task => !task.completed);
```

### When to Use Each?

- **Traditional functions**: Top-level functions, methods, when you need `this` context
- **Arrow functions**: Callbacks, array methods, when you want compact syntax

---

## Objects and Classes

### Objects: Collections of Properties

```javascript
// Object literal
const person = {
    name: 'Calvin',
    age: 25,
    greet: function() {
        console.log(`Hi, I'm ${this.name}`);
    }
};

// Accessing properties
console.log(person.name);     // Dot notation
console.log(person['age']);   // Bracket notation

// Modifying properties
person.age = 26;
person.city = 'San Francisco'; // Add new property
```

### Classes: Blueprints for Objects

```javascript
class Task {
    constructor(text) {
        // Initialize properties
        this.id = Date.now().toString();
        this.text = text;
        this.completed = false;
        this.createdAt = new Date().toISOString();
    }

    // Method
    toggle() {
        this.completed = !this.completed;
    }
}

// Creating instances
const task1 = new Task('Learn PWAs');
const task2 = new Task('Build an app');

console.log(task1.text);  // "Learn PWAs"
task1.toggle();           // Mark as completed
```

### Why We Use Classes in Task Manager

Classes provide a **template** for creating consistent objects:

```javascript
// Without class (manual object creation)
const task = {
    id: Date.now().toString(),
    text: 'Some task',
    completed: false,
    createdAt: new Date().toISOString()
};

// With class (automatic, consistent)
const task = new Task('Some task');
```

**Benefits**:
- Guarantees every task has the same properties
- Centralizes initialization logic
- Easy to add methods later

---

## Arrays and Array Methods

### Creating and Accessing Arrays

```javascript
const tasks = ['Task 1', 'Task 2', 'Task 3'];

console.log(tasks[0]);     // "Task 1" (zero-indexed)
console.log(tasks.length); // 3

tasks.push('Task 4');      // Add to end
tasks.pop();               // Remove from end
tasks.unshift('Task 0');   // Add to beginning
tasks.shift();             // Remove from beginning
```

### Essential Array Methods (Used in Our Code)

#### 1. forEach - Loop Through Array

```javascript
const numbers = [1, 2, 3];

// Traditional for loop
for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i]);
}

// Modern forEach
numbers.forEach(num => {
    console.log(num);
});

// In our code
filterButtons.forEach(btn => {
    btn.addEventListener('click', handleFilterChange);
});
```

#### 2. filter - Create New Array with Matching Items

```javascript
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(num => num % 2 === 0);
// evens = [2, 4]

// In our code: Get active tasks
const activeTasks = tasks.filter(task => !task.completed);

// In our code: Delete task (keep all except the one with matching id)
tasks = tasks.filter(task => task.id !== idToDelete);
```

#### 3. find - Find First Matching Item

```javascript
const tasks = [
    { id: '1', text: 'First' },
    { id: '2', text: 'Second' }
];

const task = tasks.find(task => task.id === '2');
// Returns { id: '2', text: 'Second' }

// In our code: Toggle task
const task = tasks.find(task => task.id === id);
if (task) {
    task.completed = !task.completed;
}
```

#### 4. map - Transform Each Item

```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(num => num * 2);
// doubled = [2, 4, 6]

// In our code: Create DOM elements for each task
tasks.forEach(task => {
    const li = createTaskElement(task);
    taskList.appendChild(li);
});
```

#### 5. unshift - Add to Beginning

```javascript
const tasks = ['Task 2', 'Task 3'];
tasks.unshift('Task 1'); // ['Task 1', 'Task 2', 'Task 3']

// In our code: Add new tasks at the beginning (newest first)
function addTask(text) {
    const task = new Task(text);
    tasks.unshift(task); // Add to start of array
    saveTasks();
}
```

---

## DOM Manipulation

### What is the DOM?

**DOM** = Document Object Model. It's the browser's representation of your HTML as a tree of objects that JavaScript can manipulate.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <h1 id="title">Hello</h1>
    <button class="btn">Click me</button>
  </body>
</html>
```

Becomes this object tree:
```
document
  └─ html
      ├─ head
      │   └─ title
      └─ body
          ├─ h1 (id="title")
          └─ button (class="btn")
```

### Selecting Elements

```javascript
// By ID (returns single element)
const title = document.getElementById('title');

// By class (returns collection)
const buttons = document.querySelectorAll('.btn');

// By CSS selector (returns first match)
const firstButton = document.querySelector('.btn');

// In our code
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
```

### Creating Elements

```javascript
// Create element
const div = document.createElement('div');

// Set properties
div.className = 'task-item';
div.textContent = 'My task';
div.id = 'task-1';

// Set attributes
div.setAttribute('data-id', '123');

// In our code: Create task element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id; // Creates data-id attribute

    // ... add more elements

    return li;
}
```

### Modifying Elements

```javascript
// Change text
element.textContent = 'New text';

// Change HTML (with tags)
element.innerHTML = '<strong>Bold text</strong>';

// Change style
element.style.color = 'red';
element.style.display = 'none';

// Add/remove classes
element.classList.add('active');
element.classList.remove('hidden');
element.classList.toggle('completed');

// In our code: Show/hide empty state
if (filteredTasks.length === 0) {
    emptyState.classList.remove('hidden');
} else {
    emptyState.classList.add('hidden');
}
```

### Appending to DOM

```javascript
// Append child
parent.appendChild(child);

// Remove child
parent.removeChild(child);

// In our code: Render all tasks
taskList.innerHTML = ''; // Clear existing tasks

filteredTasks.forEach(task => {
    const li = createTaskElement(task);
    taskList.appendChild(li); // Add to DOM
});
```

---

## Event Listeners

### What Are Events?

Events are things that happen in the browser:
- User clicks a button → `click` event
- User types in input → `input` event
- Form is submitted → `submit` event
- Page finishes loading → `load` event

### Adding Event Listeners

```javascript
// Basic syntax
element.addEventListener('eventType', callbackFunction);

// Example: Click event
const button = document.querySelector('.btn');
button.addEventListener('click', () => {
    console.log('Button clicked!');
});

// With named function
function handleClick() {
    console.log('Button clicked!');
}
button.addEventListener('click', handleClick);
```

### Common Events

```javascript
// Click
button.addEventListener('click', () => { /* ... */ });

// Submit (form)
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Stop default form submission
    // Handle submission
});

// Input change
input.addEventListener('change', () => { /* ... */ });

// Key press
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        // Enter key pressed
    }
});
```

### Event Object

Every event handler receives an **event object** with info about the event:

```javascript
button.addEventListener('click', (event) => {
    console.log(event.target);      // Element that was clicked
    console.log(event.type);        // "click"
    console.log(event.currentTarget); // Element listener is attached to
});

form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form behavior
    // Now handle it manually
});
```

### In Our Task Manager

```javascript
// Form submission
taskForm.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(e) {
    e.preventDefault(); // Don't reload page!

    const text = taskInput.value.trim();
    if (!text) return; // Validation

    addTask(text);
    taskInput.value = ''; // Clear input
    taskInput.focus();    // Focus back on input
}

// Button clicks
filterButtons.forEach(btn => {
    btn.addEventListener('click', handleFilterChange);
});

// Checkbox change
checkbox.addEventListener('change', () => toggleTask(task.id));

// Delete button
deleteBtn.addEventListener('click', () => deleteTask(task.id));
```

---

## LocalStorage API

### What is LocalStorage?

**LocalStorage** is a simple key-value storage built into the browser. Data persists even after closing the browser.

**Limitations**:
- Only stores strings (must convert objects to JSON)
- ~5-10MB storage limit
- Synchronous (blocks main thread)
- Per-origin (can't share between different websites)

### Basic Operations

```javascript
// Save data (must be string)
localStorage.setItem('key', 'value');

// Get data
const value = localStorage.getItem('key');
// Returns null if not found

// Remove data
localStorage.removeItem('key');

// Clear all data
localStorage.clear();

// Check if key exists
if (localStorage.getItem('key')) {
    // Key exists
}
```

### Storing Objects (Using JSON)

```javascript
// Wrong: Stores "[object Object]"
const user = { name: 'Calvin', age: 25 };
localStorage.setItem('user', user); // ❌ Wrong!

// Correct: Convert to JSON string first
localStorage.setItem('user', JSON.stringify(user)); // ✅ Correct

// Retrieve and parse back
const userString = localStorage.getItem('user');
const user = JSON.parse(userString);
```

### In Our Task Manager

```javascript
const STORAGE_KEY = 'pwa-tasks';
let tasks = [];

// Load tasks on startup
function loadTasks() {
    try {
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        tasks = storedTasks ? JSON.parse(storedTasks) : [];
        console.log(`Loaded ${tasks.length} tasks from localStorage`);
    } catch (error) {
        console.error('Error loading tasks:', error);
        tasks = [];
    }
}

// Save tasks after every change
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        console.log(`Saved ${tasks.length} tasks to localStorage`);
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
}

// Usage
loadTasks(); // On page load
addTask('New task');
saveTasks(); // After adding task
```

---

## JSON: JavaScript Object Notation

### What is JSON?

**JSON** is a text format for representing data. It looks like JavaScript objects but is actually a **string**.

```javascript
// JavaScript object (in memory)
const task = { id: 1, text: 'Learn JSON' };

// JSON string (for storage/transmission)
const jsonString = '{"id":1,"text":"Learn JSON"}';
```

### Converting Between JS and JSON

```javascript
// JavaScript → JSON string
const obj = { name: 'Calvin', tasks: ['Task 1', 'Task 2'] };
const json = JSON.stringify(obj);
// '{"name":"Calvin","tasks":["Task 1","Task 2"]}'

// JSON string → JavaScript
const jsonString = '{"name":"Calvin","age":25}';
const obj = JSON.parse(jsonString);
// { name: 'Calvin', age: 25 }
```

### Pretty Printing JSON

```javascript
const obj = { name: 'Calvin', tasks: ['A', 'B', 'C'] };

// Compact (default)
JSON.stringify(obj);
// '{"name":"Calvin","tasks":["A","B","C"]}'

// Pretty (with 2-space indentation)
JSON.stringify(obj, null, 2);
// {
//   "name": "Calvin",
//   "tasks": [
//     "A",
//     "B",
//     "C"
//   ]
// }
```

### Error Handling

```javascript
// Always wrap in try-catch (invalid JSON will throw error)
try {
    const data = JSON.parse(jsonString);
} catch (error) {
    console.error('Invalid JSON:', error);
    // Fallback to default value
    const data = [];
}
```

---

## Asynchronous JavaScript

### The Problem: Blocking Code

JavaScript is **single-threaded** - it can only do one thing at a time. If something takes a long time, it blocks everything:

```javascript
// BAD: Blocks for 3 seconds
function sleep(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) { }
}

console.log('Start');
sleep(3000); // Blocks here - page freezes! 😱
console.log('End');
```

### The Solution: Asynchronous Operations

**Asynchronous** code doesn't block - it schedules work to happen later:

```javascript
console.log('Start');
setTimeout(() => {
    console.log('This runs after 2 seconds');
}, 2000);
console.log('End');

// Output:
// Start
// End
// This runs after 2 seconds
```

### Callbacks

The oldest way to handle async code:

```javascript
function fetchData(callback) {
    setTimeout(() => {
        callback({ data: 'result' });
    }, 1000);
}

fetchData((result) => {
    console.log(result); // { data: 'result' }
});
```

### Promises

Modern way to handle async code:

```javascript
// Creating a promise
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Success!');
        // or reject('Error!');
    }, 1000);
});

// Using a promise
promise
    .then(result => {
        console.log(result); // 'Success!'
    })
    .catch(error => {
        console.error(error);
    });
```

### Async/Await (Modern Syntax)

Cleaner way to work with promises:

```javascript
// Old way with .then()
fetch('/api/tasks')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });

// Modern way with async/await
async function getTasks() {
    try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
```

### In Our Service Worker

```javascript
// Service worker registration returns a promise
navigator.serviceWorker
    .register('/service-worker.js')
    .then((registration) => {
        console.log('✅ Service Worker registered!');
    })
    .catch((error) => {
        console.error('❌ Registration failed:', error);
    });

// Service worker event.waitUntil() expects a promise
self.addEventListener('activate', (event) => {
    event.waitUntil(
        clients.claim().then(() => {
            console.log('Now controlling all clients');
        })
    );
});
```

---

## Browser APIs

### What Are Browser APIs?

APIs (Application Programming Interfaces) are built-in browser features that JavaScript can access.

### navigator Object

Info about the browser and system:

```javascript
// Check if browser supports service workers
if ('serviceWorker' in navigator) {
    // Browser supports service workers
}

// Get user location
navigator.geolocation.getCurrentPosition(position => {
    console.log(position.coords.latitude, position.coords.longitude);
});

// Check online status
console.log(navigator.onLine); // true or false
```

### window Object

Represents the browser window:

```javascript
// Window dimensions
console.log(window.innerWidth, window.innerHeight);

// Alert, confirm, prompt
window.alert('Hello!');
const confirmed = window.confirm('Are you sure?');
const name = window.prompt('Enter your name:');

// Navigate
window.location.href = 'https://example.com';

// Timers
setTimeout(() => console.log('After 1 second'), 1000);
setInterval(() => console.log('Every 2 seconds'), 2000);

// In our code: Register SW on page load
window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
});
```

### console Object

Debugging tool:

```javascript
console.log('Normal message');
console.error('Error message');
console.warn('Warning message');
console.info('Info message');
console.table([{id: 1, name: 'Task'}]); // Nice table format

// Grouping
console.group('My Group');
console.log('Item 1');
console.log('Item 2');
console.groupEnd();
```

### Date Object

```javascript
// Current date/time
const now = new Date();

// Timestamp (milliseconds since 1970)
const timestamp = Date.now();
console.log(timestamp); // 1707534847362

// Convert to string
const isoString = now.toISOString();
// "2024-02-09T20:34:07.362Z"

// In our code: Generate unique IDs
class Task {
    constructor(text) {
        this.id = Date.now().toString(); // Unique timestamp ID
        this.createdAt = new Date().toISOString();
    }
}
```

---

## Modern JavaScript (ES6+)

### Template Literals

```javascript
// Old way
const name = 'Calvin';
const message = 'Hello, ' + name + '!';

// New way (template literals with backticks)
const message = `Hello, ${name}!`;

// Multi-line strings
const html = `
    <div>
        <h1>${title}</h1>
        <p>${description}</p>
    </div>
`;
```

### Destructuring

```javascript
// Object destructuring
const task = { id: 1, text: 'Learn JS', completed: false };
const { id, text } = task;
console.log(id);   // 1
console.log(text); // 'Learn JS'

// Array destructuring
const [first, second] = [10, 20];
console.log(first);  // 10
console.log(second); // 20

// In our code
const { method, url } = event.request;
console.log(`${method} ${url}`);
```

### Spread Operator (...)

```javascript
// Copy array
const original = [1, 2, 3];
const copy = [...original];

// Combine arrays
const combined = [...array1, ...array2];

// Copy object
const original = { a: 1, b: 2 };
const copy = { ...original, c: 3 };
// { a: 1, b: 2, c: 3 }
```

### Default Parameters

```javascript
// Old way
function greet(name) {
    name = name || 'Guest';
    return `Hello, ${name}!`;
}

// New way
function greet(name = 'Guest') {
    return `Hello, ${name}!`;
}
```

### Ternary Operator

```javascript
// Instead of if-else
if (task.completed) {
    className = 'completed';
} else {
    className = '';
}

// Use ternary
const className = task.completed ? 'completed' : '';

// In our code
li.className = `task-item ${task.completed ? 'completed' : ''}`;
```

### Logical Operators

```javascript
// OR (||) - Returns first truthy value
const name = storedName || 'Guest';

// AND (&&) - Returns first falsy value or last value
const canDelete = isLoggedIn && isOwner;

// Nullish coalescing (??) - Only null/undefined
const count = savedCount ?? 0; // 0 is valid, unlike ||

// In our code
tasks = storedTasks ? JSON.parse(storedTasks) : [];
```

---

## Putting It All Together

### Flow of Our Task Manager

```javascript
// 1. Page loads
window.addEventListener('load', init);

// 2. Initialize app
function init() {
    loadTasks();              // Load from localStorage
    renderTasks();            // Show on screen
    updateStats();            // Update counters
    attachEventListeners();   // Set up interactivity
}

// 3. User adds task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    addTask(text);
});

// 4. Add task function
function addTask(text) {
    const task = new Task(text);  // Create object
    tasks.unshift(task);          // Add to array
    saveTasks();                  // Save to localStorage
    renderTasks();                // Update UI
    updateStats();                // Update counters
}

// 5. Render tasks
function renderTasks() {
    taskList.innerHTML = '';      // Clear existing

    getFilteredTasks().forEach(task => {
        const li = createTaskElement(task);  // Create DOM element
        taskList.appendChild(li);            // Add to page
    });
}
```

---

## Common Patterns in Our Code

### Try-Catch for Error Handling

```javascript
function loadTasks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        tasks = stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading tasks:', error);
        tasks = []; // Fallback to empty array
    }
}
```

### Guard Clauses (Early Return)

```javascript
function handleFormSubmit(e) {
    e.preventDefault();

    const text = taskInput.value.trim();
    if (!text) return; // Guard clause - exit early if invalid

    // Only runs if validation passed
    addTask(text);
    taskInput.value = '';
}
```

### State → Render Pattern

```javascript
// State: Single source of truth
let tasks = [];
let currentFilter = 'all';

// Modify state
function addTask(text) {
    tasks.unshift(new Task(text));
    saveTasks();
    renderTasks(); // Trigger re-render
}

// Render: Update UI based on state
function renderTasks() {
    // Clear and rebuild UI from state
}
```

---

## Next Steps

Now that you understand these fundamentals, you can:

1. ✅ **Read the code we wrote** and understand what each line does
2. ✅ **Modify the code** with confidence
3. ✅ **Debug issues** when they arise
4. ✅ **Continue with Lesson 4** (caching) with solid JS foundation

### Recommended Practice

1. Open `app.js` and read through it line by line
2. Add `console.log()` statements to see values at different points
3. Open DevTools Console and experiment with the concepts
4. Try modifying small parts of the code (e.g., change button text, add new filter)

---

## Quick Reference Card

```javascript
// Variables
const immutable = 'never changes';
let mutable = 'can change';

// Functions
function traditional(x) { return x * 2; }
const arrow = (x) => x * 2;

// Objects
const obj = { key: 'value' };
obj.key; // Access property

// Arrays
const arr = [1, 2, 3];
arr.forEach(item => console.log(item));
arr.filter(item => item > 1);
arr.find(item => item === 2);

// DOM
document.getElementById('id');
document.querySelector('.class');
element.addEventListener('click', () => {});

// LocalStorage
localStorage.setItem('key', JSON.stringify(obj));
const obj = JSON.parse(localStorage.getItem('key'));

// Async
navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('Registered'))
    .catch(err => console.error(err));
```

---

**You now have the JavaScript knowledge to understand everything we've built!** 🎉

Feel free to reference this guide anytime you see unfamiliar syntax in our code.
