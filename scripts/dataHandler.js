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
}
