const form = document.getElementById('form');
const list = document.getElementById('list');
const balance = document.getElementById('balance');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addTransaction(e) {
    e.preventDefault();

    const text = document.getElementById('text').value;
    const amount = +document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    const transaction = {
        id: Date.now(),
        text,
        amount,
        category,
        date
    };

    transactions.push(transaction);
    updateLocalStorage();
    displayTransactions();

    form.reset();
}

function displayTransactions() {
    list.innerHTML = '';
    let total = 0;

    transactions.forEach(t => {
        total += t.amount;

        const li = document.createElement('li');
        li.innerHTML = `
            ${t.text} (${t.category}) - ₹${t.amount}
            <br><small>${t.date}</small>
            <br><button onclick="deleteTransaction(${t.id})">Delete</button>
        `;
        list.appendChild(li);
    });

    balance.innerText = total;
    generateReport();
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    displayTransactions();
}

function generateReport() {
    let categoryTotals = {};
    const currentMonth = new Date().getMonth();

    transactions.forEach(t => {
        let month = new Date(t.date).getMonth();

        if (month === currentMonth) {
            categoryTotals[t.category] =
                (categoryTotals[t.category] || 0) + t.amount;
        }
    });

    showChart(categoryTotals);
}

let chart;

function showChart(data) {
    const ctx = document.getElementById('myChart');

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data)
            }]
        }
    });
}

form.addEventListener('submit', addTransaction);

displayTransactions();