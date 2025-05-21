class PdfUtils {
  static async generateHistoryPdf() {
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
  }
}