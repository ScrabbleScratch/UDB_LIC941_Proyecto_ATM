document.addEventListener('DOMContentLoaded', () => {
    const user = DataHandler.getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Mostrar información del usuario
    document.getElementById('userInfo').innerHTML = `
        <h2><i class="bi bi-person-circle"></i> ${user.firstName} ${user.lastName}</h2>
        <p><i class="bi bi-credit-card"></i> Número de cuenta: ${user.accountNumber}</p>
        <p><i class="bi bi-wallet2"></i> Saldo actual: $${user.balance.toLocaleString()}</p>
    `;

    // Mostrar transacciones
    const transactionsList = document.getElementById('transactionsList');
    user.transactions.slice().reverse().forEach(t => {
        const transactionEl = document.createElement('div');
        transactionEl.className = 'transaction';
        transactionEl.innerHTML = `
            <span class="transaction-type ${t.type === 'withdrawal' ? 'withdrawal' : ''}">
                ${t.type === 'deposit' ? 'Depósito' : 'Retiro'}
            </span>
            <span class="transaction-amount">$${t.amount.toLocaleString()}</span>
            <span>${t.date}</span>
            <span>Saldo: $${t.balance.toLocaleString()}</span>
        `;
        transactionsList.appendChild(transactionEl);
    });

    // Manejar botones de acción
    document.getElementById('logoutBtn').addEventListener('click', () => {
        DataHandler.clearSession();
        window.location.href = 'index.html';
    });

    // Placeholder para futuras funcionalidades
    document.getElementById('depositBtn').addEventListener('click', () => {
        alert('Funcionalidad de depósito en desarrollo');
    });
    document.getElementById('withdrawBtn').addEventListener('click', () => {
        alert('Funcionalidad de retiro en desarrollo');
    });
            document.getElementById('payServicesBtn').addEventListener('click', () => {
                alert('Funcionalidad de pago de servicios en desarrollo');
            });
});
