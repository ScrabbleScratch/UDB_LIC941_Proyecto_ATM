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

    // Botón Volver
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
});
