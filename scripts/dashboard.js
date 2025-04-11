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

    // Manejar botones de acción
    document.getElementById('historyBtn').addEventListener('click', () => {
        window.location.href = 'history.html';
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        DataHandler.clearSession();
        window.location.href = 'index.html';
    });

    document.getElementById('depositBtn').addEventListener('click', () => {
        window.location.href = 'deposit.html';
    });
    
    document.getElementById('withdrawBtn').addEventListener('click', () => {
        window.location.href = 'withdraw.html';
    });

    document.getElementById('payServicesBtn').addEventListener('click', () => {
        window.location.href = 'pay-services.html';
    });
});
