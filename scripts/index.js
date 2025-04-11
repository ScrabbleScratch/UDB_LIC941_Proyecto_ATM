document.addEventListener('DOMContentLoaded', () => {
    const pinDisplay = document.getElementById('pinDisplay');
    const numberButtons = document.querySelectorAll('[data-number]');
    const clearBtn = document.getElementById('clearBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const enterBtn = document.getElementById('enterBtn');
    
    let pin = '';
    const MAX_PIN_LENGTH = 4;
    
    // Manejar clics en botones numéricos
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (pin.length < MAX_PIN_LENGTH) {
                pin += button.dataset.number;
                updatePinDisplay();
            }
        });
    });
    
    // Manejar entrada numérica desde teclado
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9' && pin.length < MAX_PIN_LENGTH) {
            pin += e.key;
            updatePinDisplay();
        } else if (e.key === 'Backspace') {
            pin = pin.slice(0, -1);
            updatePinDisplay();
        } else if (e.key === 'Enter' && pin.length === MAX_PIN_LENGTH) {
            enterBtn.click(); // Disparar el evento click del botón Enter
        }
    });
    
    // Funcionalidad del botón Borrar
    clearBtn.addEventListener('click', () => {
        pin = pin.slice(0, -1);
        updatePinDisplay();
    });
    
    // Funcionalidad del botón Cancelar
    cancelBtn.addEventListener('click', () => {
        pin = '';
        updatePinDisplay();
    });
    
    // Funcionalidad del botón Enter
    enterBtn.addEventListener('click', async () => {
        if (pin.length === MAX_PIN_LENGTH) {
            const user = await DataHandler.validatePin(pin);
            if (user) {
                DataHandler.setCurrentUser(user);
                window.location.href = 'dashboard.html';
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'PIN incorrecto. Intente nuevamente.',
                    confirmButtonColor: '#6f42c1'
                });
                pin = '';
                updatePinDisplay();
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor ingrese un PIN de 4 dígitos',
                confirmButtonColor: '#6f42c1'
            });
        }
    });
    
    function updatePinDisplay() {
        let display = '';
        for (let i = 0; i < MAX_PIN_LENGTH; i++) {
            display += i < pin.length ? '*' : '_';
        }
        pinDisplay.textContent = display;
    }
});
