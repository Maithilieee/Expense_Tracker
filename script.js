// ===================
// 1st Block: Variable Initialization
// ===================

// Retrieve expenses from local storage or initialize as empty array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Retrieve savings from local storage or initialize to 0
let savings = parseFloat(localStorage.getItem('savings')) || 0;

// Retrieve notes from local storage or initialize as empty array
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Placeholder for the expense chart instance


// ===================
// 2nd Block: DOM Element References
// ===================

// Get references to various DOM elements for manipulating the UI
const expenseForm = document.getElementById('expense-form'); // Expense form
const expensesList = document.getElementById('expenses'); // List to display expenses
const savingsAmount = document.getElementById('savings-amount'); // Display savings amount
const savingsJar = document.getElementById('savings-jar'); // Savings jar representation
const profitLossAmount = document.getElementById('profit-loss-amount'); // Profit and loss amount display
const expenseChart = document.getElementById('expense-chart'); // Chart canvas for expenses
const notesContainer = document.getElementById('notes-container'); // Container for notes
const addNoteBtn = document.getElementById('add-note'); // Button to add notes
const calendarEl = document.getElementById('calendar-grid'); // Calendar grid element
const currentMonthEl = document.getElementById('current-month'); // Current month display
const prevMonthBtn = document.getElementById('prev-month'); // Button to go to the previous month
const nextMonthBtn = document.getElementById('next-month'); // Button to go to the next month

const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseCategoryInput = document.getElementById('expense-category');


const incomeInput = document.getElementById('income-input');
const incomeForm = document.getElementById('income-form');
const profitLossDisplay = document.getElementById('profit-loss');

// Initialize current date and highlighted days for the calendar
let currentDate = new Date();
let highlightedDays = {};
// Global variables (ensure these are declared at the top of your script)

let income = 0;

let expenseChartInstance = null;
// Define an array of pastel colors for use in the chart
const pastelColors = [
    '#fda4af', '#f0abfc', '#a5b4fc', '#7dd3fc', '#2dd4bf','#d9f99d','#fcd34d','#fca5a5'
];

// Define an array of stickers to use in the notes
const stickers = ['🌟', '🎈', '🌸', '🍀', '🌈', '🦄', '🍰', '🎁'];


// ===================
// 1st Block: Event Listeners
// ===================

// Set up event listeners for user interactions
expenseForm.addEventListener('submit', addExpenseFromForm); // Add expense on form submit
addNoteBtn.addEventListener('click', addNote); // Add note on button click

// Change month when the previous button is clicked
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1); // Go to the previous month
    updateCalendar(); // Update calendar view
});

// Change month when the next button is clicked
nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1); // Go to the next month
    updateCalendar(); // Update calendar view
});

// ===================
// 2nd Block: Functions for Handling Expenses
// ===================

// Function to handle expense submission
function addExpenseFromForm(e) {
    e.preventDefault(); // Prevent default form submission behavior

    // Get values from the form
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseCategory = document.getElementById('expense-category').value;
    const currentDate = new Date(); // Ensure current date is defined

    // Check for valid expense amount
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
        alert("Please enter a valid expense amount."); // Alert if invalid amount
        return;
    }

    // Create an expense object
    const expense = {
        name: expenseName,
        amount: expenseAmount,
        category: expenseCategory,
        date: currentDate.toLocaleDateString() // Current date as string
    };

    // Add the expense to the expenses array and save to local storage
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Update the UI components
    updateExpenseList(); // Update the displayed expenses list
    updateSavings(expenseAmount); // Update savings based on the new expense amount
    updateChart(); // Update the expense chart
    updateCalendar(); // Refresh the calendar after adding the new expense
    expenseForm.reset(); // Reset the form fields
}

// Function to update the displayed list of expenses
function updateExpenseList() {
    expensesList.innerHTML = ''; // Clear existing list

    // Loop through expenses and create list items
    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.textContent = `${expense.name} - $${expense.amount.toFixed(2)} (${expense.category})`; // Ensure correct amount formatting
        expensesList.appendChild(li); // Add item to the list
    });
}

// ===================
// 3rd Block: Functions for Managing Savings
// ===================
function addExpenseFromForm(e) {
    e.preventDefault(); // Prevent default form submission behavior

    // Get values from the form
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseCategory = document.getElementById('expense-category').value;
    const currentDate = new Date(); // Ensure current date is defined

    // Check for valid expense amount
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
        alert("Please enter a valid expense amount."); // Alert if invalid amount
        return;
    }

    // Create an expense object
    const expense = {
        name: expenseName,
        amount: expenseAmount,
        category: expenseCategory,
        date: currentDate.toLocaleDateString() // Current date as string
    };

    // Add the expense to the expenses array and save to local storage
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Update the UI components
    updateExpenseList(); // Update the displayed expenses list
    updateSavings(expenseAmount); // Update savings based on the new expense amount
    updateChart(); // Update the expense chart
    updateCalendar(); // Refresh the calendar after adding the new expense
    expenseForm.reset(); // Reset the form fields
}
function updateExpenseList() {
    expensesList.innerHTML = ''; // Clear existing list

    // Loop through expenses and create list items
    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.textContent = `${expense.name} - $${expense.amount.toFixed(2)} (${expense.category})`; // Ensure correct amount formatting
        expensesList.appendChild(li); // Add item to the list
    });
}
// Function to render expenses
function renderExpenses() {
    expensesList.innerHTML = ''; // Clear the current list
    expenses.forEach((expense, index) => {
        const expenseItem = document.createElement('li');
        expenseItem.className = 'expense-item';
        
        // Display the expense amount, description, and delete button
        expenseItem.innerHTML = `
            ${expense.name} - $${expense.amount.toFixed(2)} 
            <button class="delete-button" data-index="${index}">✖</button>
        `;

        // Add the delete button click event listener
        const deleteButton = expenseItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => deleteExpense(index));

        expensesList.appendChild(expenseItem);
    });
}

// Function to delete an expense
function deleteExpense(index) {
    // Remove the expense from the array
    expenses.splice(index, 1);
    
    // Update local storage
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    // Re-render the expenses
    renderExpenses();
}

// Function to add a new expense
expenseForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission

    // Create a new expense object
    const newExpense = {
        name: expenseNameInput.value,
        amount: parseFloat(expenseAmountInput.value),
        category: expenseCategoryInput.value
    };

    // Add the new expense to the array
    expenses.push(newExpense);

    // Update local storage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Clear the form inputs
    expenseNameInput.value = '';
    expenseAmountInput.value = '';
    expenseCategoryInput.value = '';

    // Re-render the expenses
    renderExpenses();
});

// Call renderExpenses on page load
document.addEventListener('DOMContentLoaded', () => {
    renderExpenses(); // Initial render of expenses
});


// Function to update the visual representation of the savings jar
function updateSavingsJar() {
    // Calculate jar height as a percentage of income
    const jarHeight = income > 0 ? (savings / income) * 100 : 0;
    
    // Ensure the jar height is between 0% and 100%
    const clampedJarHeight = Math.min(100, Math.max(0, jarHeight));
    
    savingsJar.style.setProperty('--savings-height', `${clampedJarHeight}%`);
}

// ===================
// 4th Block: Financial Summary 📈
// ===================

// Function to update profit/loss display
function updateProfitLoss() {
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    const profitLoss = income - totalExpenses;
    const color = profitLoss >= 0 ? 'green' : 'red';
    profitLossDisplay.textContent = `${profitLoss >= 0 ? 'Profit' : 'Loss'}: $${Math.abs(profitLoss).toFixed(2)}`;
    profitLossDisplay.style.color = color;
}

// Function to update the expense chart
function updateChart() {
    const categories = {}; // Object to hold category totals
    expenses.forEach(expense => {
        categories[expense.category] = (categories[expense.category] || 0) + expense.amount; // Accumulate totals by category
    });

    const labels = Object.keys(categories); // Get the category names
    const data = Object.values(categories); // Get the totals

    // Remove "Others" if it doesn't make sense
    if (labels.length === 1 && labels[0] === 'Utilities') {
        labels.pop();
        data.pop();
    }

    // Destroy previous chart instance if it exists
    if (expenseChartInstance) {
        expenseChartInstance.destroy();
    }

    // Create a new pie chart with updated data
    expenseChartInstance = new Chart(expenseChart, {
        type: 'pie', // Change chart type to pie
        data: {
            labels: labels, // Set category labels
            datasets: [{
                label: 'Expenses by Category',
                data: data, // Set corresponding amounts
                backgroundColor: pastelColors.slice(0, data.length), // Set background colors
                borderColor: '#333', // Set border color
                borderWidth: 1 // Set border width
            }]
        },
        options: {
            responsive: true, // Make the chart responsive
            plugins: {
                legend: {
                    position: 'top', // Position of the legend
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: $${tooltipItem.raw.toFixed(2)}`; // Custom tooltip label
                        }
                    }
                }
            }
        }
    });
}

// ===================
// Initialization
// ===================

// Load expenses from local storage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses'));
    if (savedExpenses) {
        expenses = savedExpenses; // Restore saved expenses
        updateExpenseList(); // Update displayed expense list
        updateChart(); // Update the chart
    }

    const savedSavings = parseFloat(localStorage.getItem('savings'));
    if (!isNaN(savedSavings)) {
        savings = savedSavings; // Restore saved savings
        savingsAmount.textContent = `$${savings.toFixed(2)}`; // Update displayed savings amount
        updateSavingsJar(); // Update savings jar visual
    }
});

// Function to handle income submission
function addIncome(e) {
    e.preventDefault();
    const newIncome = parseFloat(incomeInput.value);
    if (isNaN(newIncome) || newIncome < 0) {
        alert("Please enter a valid income amount.");
        return;
    }
    income = newIncome;
    localStorage.setItem('income', income.toString());
    updateSavings(); // This will update savings based on new income
    incomeForm.reset();
}


// ===================
// 7th Block: Functions for Updating the Calendar
// ===================

// Constants for styling
const calendarColor = '#E0BBE4'; // Set a single pastel color for all days
const noteColors = ['#fda4af', '#f0abfc', '#a5b4fc', '#7dd3fc', '#2dd4bf','#d9f99d','#fcd34d','#fca5a5']; // Array of pastel colors for notes

// Add a new variable for the calendar notes container
const calendarNotesContainer = document.getElementById('calendar-notes-container');

// Initialize calendarNotes as an empty array
window.calendarNotes = JSON.parse(localStorage.getItem('calendarNotes')) || [];

// Update the updateCalendar function
function updateCalendar() {
    currentMonthEl.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    calendarEl.innerHTML = '';

    // Days of the week header
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.classList.add('calendar-header');
        calendarEl.appendChild(dayHeader);
    });

    // Add empty divs for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDiv = document.createElement('div');
        calendarEl.appendChild(emptyDiv);
    }

    // Add each day of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        dayDiv.classList.add('calendar-day');
        dayDiv.style.backgroundColor = calendarColor;

        // Add event listener for displaying notes and adding expenses for the selected day
        dayDiv.addEventListener('click', () => {
            displayNotesForDay(day);
            addExpenseToDay(day);
        });

        calendarEl.appendChild(dayDiv);
    }

    // Update calendar notes display
    updateCalendarNotes();
}

// Function to display notes for a specific day
function displayNotesForDay(day) {
    const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString();
    
    // Filter calendar notes for the selected day
    const notesForDay = window.calendarNotes.filter(note => note.date === dateString);
    
    // Update the calendar notes display
    updateCalendarNotes(notesForDay);
}

// Modify the addExpenseToDay function
function addExpenseToDay(day) {
    const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString();
    const expenseAmount = parseFloat(prompt(`Enter expense amount for ${dateString}:`));

    if (!isNaN(expenseAmount) && expenseAmount > 0) {
        const expenseName = prompt("Enter a description for this expense:");
        const expense = {
            name: expenseName || `Expense for ${dateString}`,
            amount: expenseAmount,
            category: 'Other', // You can add a category selection if needed
            date: dateString
        };

        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));

        // Create a calendar note for this expense
        const calendarNote = {
            content: `Spent $${expenseAmount} on ${expenseName || 'expenses'}`,
            sticker: '💸', // Money with wings emoji
            date: dateString
        };
        
        window.calendarNotes.push(calendarNote);
        localStorage.setItem('calendarNotes', JSON.stringify(window.calendarNotes));

        updateExpenseList();
        updateChart();
        updateCalendarNotes();
        updateCalendar();
    } else if (expenseAmount !== null) {
        alert('Please enter a valid expense amount.');
    }
}


// Update the function that creates the notes display
function updateCalendarNotes(filteredNotes = null) {
    calendarNotesContainer.innerHTML = '';

    const notesToDisplay = filteredNotes || window.calendarNotes;
    notesToDisplay.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('calendar-note');
        noteDiv.style.backgroundColor = noteColors[index % noteColors.length];

        // Create the note content with dotted text lines
        noteDiv.innerHTML = `
          <div class="note-text"><strong>${note.sticker || '📝'}</strong> ${note.content}</div>
          <em>${note.date}</em>
        `;

        // Add the cat sticker to the last note
        if (index === notesToDisplay.length - 1) {
            const catSticker = document.createElement('img');
            catSticker.src = '/mnt/data/cute-animal-notes-153810.webp'; // Reference the uploaded cat sticker image
            catSticker.classList.add('cat-sticker');
            noteDiv.appendChild(catSticker);
        }

        calendarNotesContainer.appendChild(noteDiv);
    });
}


// ===================
// 8th Block: Functions for Managing Notes
// ===================
// Function to add a note
function addNote() {
    const noteContent = prompt("Enter your note:"); // Prompt user for note
    if (noteContent) {
        const note = {
            content: noteContent,
            sticker: stickers[Math.floor(Math.random() * stickers.length)], // Randomly select a sticker
            date: new Date().toLocaleDateString() // Add current date to note
        };
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes)); // Save notes to local storage
        updateNotes(); // Refresh notes display
    }
}

// Function to delete a note
function deleteNote(index) {
    notes.splice(index, 1); // Remove note from the array
    localStorage.setItem('notes', JSON.stringify(notes)); // Update local storage
    updateNotes(); // Refresh notes display
}

// Modify the updateNotes function to only handle general notes
function updateNotes() {
    notesContainer.innerHTML = '';
    notes.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.style.backgroundColor = noteColors[index % noteColors.length];

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '❌';
        deleteButton.classList.add('delete-button'); // Add class for styling

        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteNote(index); // Pass the index to delete the specific note
        });

        noteDiv.innerHTML = `<strong>${note.sticker || '📝'}</strong> ${note.content} <em>${note.date}</em>`;
        noteDiv.appendChild(deleteButton);
        notesContainer.appendChild(noteDiv);
    });
}

// ===================
// 9th Block: Initialize the Application
// ===================

// Initial population of the UI components
updateExpenseList(); // Populate expense list
savingsAmount.textContent = `$${savings.toFixed(2)}`; // Set initial savings display
updateSavingsJar(); // Initialize the savings jar
updateChart(); // Draw the initial expense chart
updateCalendar();
updateNotes();
updateCalendarNotes();