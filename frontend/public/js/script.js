document.getElementById('transactionForm').onsubmit = async function(e) {
    e.preventDefault(); 

    // Get values from the form
    const expOrInc = document.getElementById('expOrInc').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const category = expOrInc === 'Expense'
        ? document.getElementById('category-expense').value
        : document.getElementById('category-income').value;

    // Validate form before submission
    if (!validateForm()) return;

    try {
        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: expOrInc, amount, date, category }),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log('Success:', data);
        // Handle success (e.g., reset form or show a message)
        document.getElementById('transactionForm').reset();
    } catch (error) {
        console.error('Error:', error);
    }
};

// Function to validate the form
function validateForm() {
    const expOrInc = document.getElementById('expOrInc').value;
    const categoryExpense = document.getElementById('category-expense');
    const categoryIncome = document.getElementById('category-income');

    if (expOrInc === 'Expense' && !categoryExpense.value) {
        alert('Please select an expense category.');
        return false;
    } else if (expOrInc === 'Income' && !categoryIncome.value) {
        alert('Please select an income category.');
        return false;
    }

    return true;
}

// Attach event listener for category selection change
document.getElementById('expOrInc').onchange = toggleCategories;

function toggleCategories() {
    const expOrInc = document.getElementById('expOrInc').value;
    const categoryExpense = document.getElementById('category-expense');
    const categoryIncome = document.getElementById('category-income');

    if (expOrInc === 'Expense') {
        categoryExpense.style.display = 'block';
        categoryIncome.style.display = 'none';
        categoryExpense.required = true;
        categoryIncome.required = false;
    } else {
        categoryExpense.style.display = 'none';
        categoryIncome.style.display = 'block';
        categoryExpense.required = false;
        categoryIncome.required = true;
    }
}