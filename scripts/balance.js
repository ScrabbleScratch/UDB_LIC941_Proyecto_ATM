document.addEventListener('DOMContentLoaded', () => {
    const user = DataHandler.getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });

    // Mostrar balance actual
    const balance = DataHandler.getBalance();
    document.getElementById('currentBalance').textContent = `$${balance.toFixed(2)}`;
    
    // Mostrar fecha actual
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('balanceDate').textContent = `Actualizado: ${new Date().toLocaleDateString('es-ES', options)}`;
});
