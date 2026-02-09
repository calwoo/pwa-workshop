/**
 * Task Manager PWA - Main Application Logic
 * Lesson 1: Foundation - LocalStorage-based task management
 */

// ===================================
// State Management
// ===================================
const STORAGE_KEY = 'pwa-tasks';
let tasks = [];
let currentFilter = 'all';

// ===================================
// DOM Elements
// ===================================
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const filterButtons = document.querySelectorAll('.filter-btn');

// Stat elements
const totalTasksEl = document.getElementById('total-tasks');
const activeTasksEl = document.getElementById('active-tasks');
const completedTasksEl = document.getElementById('completed-tasks');

// ===================================
// Task Model
// ===================================
class Task {
    constructor(text) {
        this.id = Date.now().toString();
        this.text = text;
        this.completed = false;
        this.createdAt = new Date().toISOString();
    }
}

// ===================================
// LocalStorage Functions
// ===================================
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

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        console.log(`Saved ${tasks.length} tasks to localStorage`);
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
}

// ===================================
// CRUD Operations
// ===================================
function addTask(text) {
    const task = new Task(text);
    tasks.unshift(task); // Add to beginning for newest-first order
    saveTasks();
    renderTasks();
    updateStats();
    return task;
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// ===================================
// Filtering
// ===================================
function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

// ===================================
// Rendering Functions
// ===================================
function renderTasks() {
    const filteredTasks = getFilteredTasks();

    // Clear the list
    taskList.innerHTML = '';

    // Show/hide empty state
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
    }

    // Render each task
    filteredTasks.forEach(task => {
        const li = createTaskElement(task);
        taskList.appendChild(li);
    });
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    // Task text
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    // Created date
    const dateSpan = document.createElement('span');
    dateSpan.className = 'task-date';
    dateSpan.textContent = formatDate(task.createdAt);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    // Assemble
    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(dateSpan);
    li.appendChild(deleteBtn);

    return li;
}

function updateStats() {
    const total = tasks.length;
    const active = tasks.filter(task => !task.completed).length;
    const completed = tasks.filter(task => task.completed).length;

    totalTasksEl.textContent = total;
    activeTasksEl.textContent = active;
    completedTasksEl.textContent = completed;
}

// ===================================
// Utility Functions
// ===================================
function formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}

// ===================================
// Event Handlers
// ===================================
function handleFormSubmit(e) {
    e.preventDefault();

    const text = taskInput.value.trim();
    if (!text) return;

    addTask(text);
    taskInput.value = '';
    taskInput.focus();
}

function handleFilterChange(e) {
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    // Update filter and re-render
    currentFilter = e.target.dataset.filter;
    renderTasks();
}

// ===================================
// Initialization
// ===================================
function init() {
    console.log('🚀 Task Manager PWA - Initializing...');

    // Load tasks from localStorage
    loadTasks();

    // Render initial state
    renderTasks();
    updateStats();

    // Attach event listeners
    taskForm.addEventListener('submit', handleFormSubmit);
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });

    console.log('✅ Task Manager initialized successfully!');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
