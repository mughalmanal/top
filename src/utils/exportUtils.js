// utils/exportUtils.js
export const printData = (title, contentHTML) => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f0f8ff; }
        </style>
      </head>
      <body>
        ${contentHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};

export const exportToCSV = (filename, data) => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map(row => headers.map(field => `"${row[field] || ""}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async (filename, htmlContent) => {
  const element = document.createElement("div");
  element.innerHTML = htmlContent;
  document.body.appendChild(element);

  const { jsPDF } = await import("jspdf");
  const html2canvas = (await import("html2canvas")).default;

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF();
  pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
  pdf.save(`${filename}.pdf`);

  document.body.removeChild(element);
};
