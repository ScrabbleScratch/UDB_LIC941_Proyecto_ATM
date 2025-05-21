const dateOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
};

const timeOptions = { 
    hour: '2-digit',
    minute: '2-digit'
};

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

  static async generateTransactionPdf(id) {
    const u = DataHandler.getCurrentUser(); // Obtener el usuario actual
    if (!u) {
      console.error('Usuario no encontrado');
      return;
    }

    const t = DataHandler.getTransaction(id); // Obtener la transacción por ID
    if (!t) {
      console.error('Transacción no encontrada');
      return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "pt", "a4");

    // Contenedor de 500pt, espacio seguro dentro de A4
    const comprobanteHTML = document.createElement("div");
    comprobanteHTML.style.width = "415pt";
    comprobanteHTML.style.margin = "0 auto";
    comprobanteHTML.style.fontFamily = "Arial, sans-serif";
    comprobanteHTML.style.fontSize = "10pt";

    comprobanteHTML.innerHTML = `
      <h2 style="text-align:center; color:#3b4cca; margin-bottom: 10pt;">Pokémon Bank</h2>
      <hr style="margin: 10pt 0;">
      <table style="width:100%; border-spacing: 0;">
        <tr><td style="width: 200pt;"><strong>Fecha:</strong></td><td>${t.date ? new Date(t.date).toLocaleString('es-ES', dateOptions) : '-'}</td></tr>
        <tr><td><strong>Hora:</strong></td><td>${t.date ? new Date(t.date).toLocaleString('es-ES', timeOptions) : '-'}</td></tr>
        <tr><td><strong>Número de Referencia:</strong></td><td>${t.id}</td></tr>
        <tr><td><strong>Tipo de Transacción:</strong></td><td>${t.type === 'deposit' ? 'Depósito' : t.type === 'payment' ? 'Pago' : 'Retiro'}</td></tr>
        <tr><td><strong>Monto:</strong></td><td>$${t.amount.toLocaleString()}</td></tr>
        <tr><td><strong>Número de Cuenta:</strong></td><td>${u.accountNumber.toString().padStart(10, '0')}</td></tr>
        <tr><td><strong>Nombre del Beneficiario:</strong></td><td>${u.firstName} ${u.lastName}</td></tr>
        <tr><td><strong>Concepto:</strong></td><td>${t.description || '-'}</td></tr>
      </table>
      <hr style="margin: 20pt 0;">
      <p style="text-align: center; font-size: 10pt; color: #888;">
        Este comprobante ha sido generado electrónicamente y no requiere firma.<br>
        Gracias por usar Pokémon Bank.
      </p>
    `;

    await pdf.html(comprobanteHTML, {
      callback: function (doc) {
        doc.save(`comprobante_${t.id}.pdf`);
      },
      margin: [20, 20, 20, 20],
      html2canvas: {
        scale: 1,
      },
    });
  }
}