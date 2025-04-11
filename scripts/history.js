document.addEventListener('DOMContentLoaded', () => {
    const user = DataHandler.getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    const historyContainer = document.getElementById('transactionsHistory');
    const emptyMessage = document.getElementById('emptyHistoryMessage');
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    const chartContainer = document.querySelector('.chart-container');
    
    if (user.transactions && user.transactions.length > 0) {
        // Mostrar historial completo
        emptyMessage.style.display = 'none';
        document.querySelector('.transactions-table').style.display = '';
        chartContainer.style.display = '';
        generatePdfBtn.style.display = '';
        
        user.transactions.forEach(t => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="transaction-type ${t.type}">
                    ${t.type === 'deposit' ? 'Depósito' : t.type === 'payment' ? 'Pago' : 'Retiro'}
                </span></td>
                <td class="transaction-amount">$${t.amount.toLocaleString()}</td>
                <td>${t.description || '-'}</td>
                <td class="transaction-date">${t.date ? new Date(t.date).toLocaleString('es-ES', options) : '-'}</td>
                <td>$${t.balance.toLocaleString()}</td>
            `;
            historyContainer.appendChild(row);
        });

        // Generar gráfica de transacciones
        const transactionTypes = ['deposit', 'withdrawal', 'payment'];
        const counts = transactionTypes.map(type => 
            user.transactions.filter(t => t.type === type).length
        );

        const ctx = document.getElementById('transactionsChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Depósitos', 'Retiros', 'Pagos'],
                datasets: [{
                    data: counts,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(153, 102, 255, 0.7)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Distribución de Transacciones'
                    }
                }
            }
        });
    } else {
        // Mostrar mensaje de historial vacío
        emptyMessage.style.display = 'block';
        document.querySelector('.transactions-table').style.display = 'none';
        chartContainer.style.display = 'none';
        generatePdfBtn.style.display = 'none';
    }

    // Botón Volver
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });

    // Generar PDF
    document.getElementById('generatePdfBtn').addEventListener('click', async () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Agregar título
        doc.setFontSize(18);
        doc.text('Historial de Transacciones', 105, 15, { align: 'center' });
        
        // Agregar fecha
        doc.setFontSize(12);
        doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 105, 25, { align: 'center' });
        
        // Capturar gráfico
        const chartCanvas = document.getElementById('transactionsChart');
        const chartImg = await html2canvas(chartCanvas, {
            scale: 2,
            logging: false,
            useCORS: true
        });
        doc.addImage(chartImg, 'PNG', 15, 35, 180, 100);
        
        // Capturar tabla en partes
        const tableElement = document.querySelector('.transactions-table');
        const tableClone = tableElement.cloneNode(true);
        tableClone.style.width = '100%';
        tableClone.style.fontSize = '10pt';
        
        // Dividir tabla si es muy larga
        const rowsPerPage = 15;
        const rows = tableClone.rows;
        let currentPosition = 150;
        
        for (let i = 0; i < rows.length; i += rowsPerPage) {
            if (i > 0) {
                doc.addPage();
                currentPosition = 20;
            }
            
            const tempTable = tableClone.cloneNode(false);
            for (let j = i; j < Math.min(i + rowsPerPage, rows.length); j++) {
                tempTable.appendChild(rows[j].cloneNode(true));
            }
            
            document.body.appendChild(tempTable);
            const tableImg = await html2canvas(tempTable, {
                scale: 1.5,
                logging: false,
                useCORS: true
            });
            document.body.removeChild(tempTable);
            
            const imgHeight = (tableImg.height * 190) / tableImg.width;
            doc.addImage(tableImg, 'PNG', 10, currentPosition, 190, imgHeight);
        }
        
        // Guardar PDF
        doc.save('historial_transacciones.pdf');
    });
});
