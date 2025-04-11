document.addEventListener('DOMContentLoaded', () => {
    const user = DataHandler.getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    // Mostrar historial completo
    const historyContainer = document.getElementById('transactionsHistory');
    user.transactions.forEach(t => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="transaction-type ${t.type}">
                ${t.type === 'deposit' ? 'Depósito' : t.type === 'payment' ? 'Pago' : 'Retiro'}
            </span></td>
            <td class="transaction-amount">$${t.amount.toLocaleString()}</td>
            <td>${t.description || '-'}</td>
            <td class="transaction-date">${t.date ? new Date(t.date).toLocaleString('es-ES', options) : '-'}</td>
            <td>$${t.balance.toLocaleString()}</td>
        `;
        historyContainer.appendChild(row);
    });

    // Generar gráfica de transacciones
    if (user.transactions && user.transactions.length > 0) {
        const transactionTypes = ['deposit', 'withdrawal', 'payment'];
        const counts = transactionTypes.map(type => 
            user.transactions.filter(t => t.type === type).length
        );

        const ctx = document.getElementById('transactionsChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Depósitos', 'Retiros', 'Pagos'],
                datasets: [{
                    data: counts,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(153, 102, 255, 0.7)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Distribución de Transacciones'
                    }
                }
            }
        });
    }

    // Botón Volver
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
});
