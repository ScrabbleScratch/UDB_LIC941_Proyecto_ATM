document.addEventListener('DOMContentLoaded', () => {
    const user = DataHandler.getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });

    document.getElementById('payServiceForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const service = formData.get('service');
        const amount = parseFloat(formData.get('amount'));

        if (!amount || amount <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor ingrese un monto válido',
                confirmButtonColor: '#6f42c1'
            });
            return;
        }

        if (!service) {
            Swal.fire({
                icon: 'error',
                title: 'Error', 
                text: 'Por favor seleccione un servicio',
                confirmButtonColor: '#6f42c1'
            });
            return;
        }

        const serviceNames = {
            'electricity': 'Energía eléctrica',
            'internet': 'Internet',
            'phone': 'Telefonía',
            'water': 'Agua potable'
        };

        const description = `Pago de servicio: ${serviceNames[service]}`;
        const paymentId = DataHandler.paymentService(amount, description);
        
        if (paymentId) {
            const container = document.querySelector('.pay-services-container');
            container.classList.add('success-state');
            
            const successMsg = document.getElementById('successMessage');
            successMsg.style.display = 'flex';
            successMsg.style.opacity = '1';
            successMsg.style.visibility = 'visible';
            successMsg.innerHTML = `
                <i class="bi bi-check-circle-fill" style="font-size: 2.5rem; color: #6f42c1;"></i>
                <h3 style="margin-bottom: 0.5rem;">¡Pago exitoso!</h3>
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">
                    <strong>$${amount.toLocaleString()}</strong> pagados correctamente
                </p>
                <p class="text-muted"><strong>Servicio:</strong> ${serviceNames[service]}</p>
                <button onclick="PdfUtils.generateTransactionPdf('${paymentId}')" class="btn btn-enter" style="margin-top: 1.5rem; width: auto; padding: 0.75rem 1.5rem; background-color: #6f42c1;">
                    <i class="bi bi-receipt"></i> Descargar comprobante
                </button>
            `;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error en pago',
                text: 'Error al realizar el pago. Verifique su saldo disponible.',
                confirmButtonColor: '#6f42c1'
            });
        }
    });
});
