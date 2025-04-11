document.addEventListener('DOMContentLoaded', () => {
    const user = DataHandler.getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });

    document.getElementById('withdrawForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const amount = parseFloat(formData.get('amount'));
        const description = formData.get('description') || 'Retiro';

        if (!amount || amount <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor ingrese una cantidad válida',
                confirmButtonColor: '#6f42c1'
            });
            return;
        }

        const success = DataHandler.withdraw(amount, description);
        
        if (success) {
            const container = document.querySelector('.withdraw-container');
            container.classList.add('success-state');
            
            const successMsg = document.getElementById('successMessage');
            successMsg.style.display = 'flex';
            successMsg.style.opacity = '1';
            successMsg.style.visibility = 'visible';
            successMsg.innerHTML = `
                <i class="bi bi-check-circle-fill" style="font-size: 2.5rem; color: #dc3545;"></i>
                <h3 style="margin-bottom: 0.5rem;">¡Retiro exitoso!</h3>
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">
                    <strong>$${amount.toFixed(2)}</strong> retirados correctamente
                </p>
                ${description ? '<p class="text-muted"><strong>Concepto:</strong> ' + description + '</p>' : ''}
                <button onclick="window.location.href='dashboard.html'" class="btn btn-enter" style="margin-top: 1.5rem; width: auto; padding: 0.75rem 1.5rem; background-color: #dc3545;">
                    <i class="bi bi-arrow-left"></i> Volver al Dashboard
                </button>
            `;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error en retiro',
                text: 'Error al realizar el retiro. Verifique su saldo disponible.',
                confirmButtonColor: '#6f42c1'
            });
        }
    });
});
