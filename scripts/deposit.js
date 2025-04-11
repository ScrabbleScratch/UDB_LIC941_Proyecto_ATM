document.addEventListener('DOMContentLoaded', () => {
    const user = DataHandler.getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Botón Volver
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });

    // Manejar submit del formulario
    document.getElementById('depositForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const amount = parseFloat(formData.get('amount'));
        const description = formData.get('description') || 'Depósito';

        if (!amount || amount <= 0) {
            alert('Por favor ingrese una cantidad válida');
            return;
        }

        // Realizar depósito
        const success = DataHandler.deposit(amount, description);
        
        if (success) {
            alert(`Depósito exitoso de $${amount.toFixed(2)}`);
            window.location.href = 'dashboard.html';
        } else {
            alert('Error al realizar el depósito');
        }
    });
});
