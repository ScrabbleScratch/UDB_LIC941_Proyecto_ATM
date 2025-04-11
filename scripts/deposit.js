document.addEventListener('DOMContentLoaded', () => {
    const user = DataHandler.getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });

    document.getElementById('depositForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const amount = parseFloat(formData.get('amount'));
        const description = formData.get('description') || 'Depósito';

        if (!amount || amount <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor ingrese una cantidad válida',
                confirmButtonColor: '#6f42c1'
            });
            return;
        }

        const success = DataHandler.deposit(amount, description);
        
        if (success) {
            const container = document.querySelector('.deposit-container');
            container.classList.add('success-state');
            
            const successMsg = document.getElementById('successMessage');
            successMsg.style.display = 'flex';
            successMsg.style.opacity = '1';
            successMsg.style.visibility = 'visible';
            successMsg.innerHTML = `
                <i class="bi bi-check-circle-fill" style="font-size: 2.5rem; color: #28a745;"></i>
                <h3 style="margin-bottom: 0.5rem;">¡Depósito exitoso!</h3>
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">
                    <strong>$${amount.toFixed(2)}</strong> depositados correctamente
                </p>
                ${description ? '<p class="text-muted"><strong>Concepto:</strong> ' + description + '</p>' : ''}
                <button onclick="window.location.href=\'dashboard.html\'" class="btn btn-enter" style="margin-top: 1.5rem; width: auto; padding: 0.75rem 1.5rem;">
                    <i class="bi bi-arrow-left"></i> Volver al Dashboard
                </button>
            `;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al realizar el depósito',
                confirmButtonColor: '#6f42c1'
            });
        }
    });
});
