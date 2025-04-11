// Módulo para manejo de datos de usuarios
class DataHandler {
    static async loadUserData() {
        try {
            const response = await fetch('https://scrabblescratch.github.io/UDB_LIC941_Ptoyecto_F1/data/data.json');
            return await response.json();
        } catch (error) {
            console.error('Error cargando datos:', error);
            return [];
        }
    }

    static async validatePin(pin) {
        const users = await this.loadUserData();
        return users.find(user => user.pin == pin);
    }

    static setCurrentUser(user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    }

    static getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('currentUser'));
    }

    static clearSession() {
        sessionStorage.removeItem('currentUser');
    }

    static deposit(amount, description) {
        try {
            const user = this.getCurrentUser();
            if (!user) return false;
            
            // Actualizar saldo
            user.balance += amount;
            
            // Crear transacción
            const transaction = {
                type: 'deposit',
                amount: amount,
                date: new Date().toISOString(),
                description: description,
                balance: user.balance
            };
            
            // Agregar al historial
            if (!user.transactions) {
                user.transactions = [];
            }
            user.transactions.push(transaction);
            
            // Actualizar usuario en sesión
            this.setCurrentUser(user);
            return true;
            
        } catch (error) {
            console.error('Error en depósito:', error);
            return false;
        }
    }
}
