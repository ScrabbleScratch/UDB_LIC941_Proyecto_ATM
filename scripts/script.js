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
        }
    });
    
    // Funcionalidad del botón Limpiar
    clearBtn.addEventListener('click', () => {
        pin = '';
        updatePinDisplay();
    });
    
    // Funcionalidad del botón Cancelar
    cancelBtn.addEventListener('click', () => {
        pin = '';
        updatePinDisplay();
    });
    
    // Funcionalidad del botón Enter
    enterBtn.addEventListener('click', () => {
        if (pin.length === MAX_PIN_LENGTH) {
            alert(`PIN ingresado: ${pin}`);
        } else {
            alert('Por favor ingrese un PIN de 4 dígitos');
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
