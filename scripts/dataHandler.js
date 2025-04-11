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
            
            user.balance += amount;
            
            const transaction = {
                type: 'deposit',
                amount: amount,
                date: new Date().toISOString(),
                description: description,
                balance: user.balance
            };
            
            if (!user.transactions) {
                user.transactions = [];
            }
            user.transactions.push(transaction);
            
            this.setCurrentUser(user);
            return true;
            
        } catch (error) {
            console.error('Error en depósito:', error);
            return false;
        }
    }

    static withdraw(amount, description) {
        try {
            const user = this.getCurrentUser();
            if (!user) return false;
            
            if (user.balance < amount) {
                return false;
            }
            
            user.balance -= amount;
            
            const transaction = {
                type: 'withdrawal',
                amount: amount,
                date: new Date().toISOString(),
                description: description,
                balance: user.balance
            };
            
            if (!user.transactions) {
                user.transactions = [];
            }
            user.transactions.push(transaction);
            
            this.setCurrentUser(user);
            return true;
            
        } catch (error) {
            console.error('Error en retiro:', error);
            return false;
        }
    }

    static paymentService(amount, description) {
        try {
            const user = this.getCurrentUser();
            if (!user) return false;
            
            if (user.balance < amount) {
                return false;
            }
            
            user.balance -= amount;
            
            const transaction = {
                type: 'payment',
                amount: amount,
                date: new Date().toISOString(),
                description: description,
                balance: user.balance
            };
            
            if (!user.transactions) {
                user.transactions = [];
            }
            user.transactions.push(transaction);
            
            this.setCurrentUser(user);
            return true;
            
        } catch (error) {
            console.error('Error en pago de servicio:', error);
            return false;
        }
    }
}
