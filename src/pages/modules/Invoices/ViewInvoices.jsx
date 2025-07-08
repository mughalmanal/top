import React, { useEffect, useState } from "react";

function ViewInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedInvoice, setEditedInvoice] = useState({});

  useEffect(() => {
    fetch("https://back-8.onrender.com/api/invoices")
      .then((res) => res.json())
      .then((data) => setInvoices(data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    const res = await fetch(`https://back-8.onrender.com/api/invoices/${id}`, {
      method: "DELETE",
    });
    if (res.ok) setInvoices(invoices.filter((inv) => inv._id !== id));
  };

  const handleEdit = (invoice) => {
    setEditingId(invoice._id);
    setEditedInvoice(invoice);
  };

  const handleSaveEdit = async () => {
    const res = await fetch(`https://back-8.onrender.com/api/invoices/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedInvoice),
    });
    if (res.ok) {
      setInvoices(invoices.map((inv) => inv._id === editingId ? editedInvoice : inv));
      setEditingId(null);
    }
  };

  const handlePrint = (inv) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${inv._id}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { color: #0c4a6e; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; }
          </style>
        </head>
        <body>
          <h1>Invoice - ${inv._id}</h1>
          <p><strong>Client:</strong> ${inv.client}</p>
          <p><strong>Date:</strong> ${inv.invoiceDate}</p>
          <p><strong>Due:</strong> ${inv.dueDate}</p>
          <p><strong>Remarks:</strong> ${inv.remarks}</p>
          <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>
              ${inv.items.map(item =>
                `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${item.price}</td><td>${item.quantity * item.price}</td></tr>`
              ).join("")}
            </tbody>
          </table>
          <h3>Total: PKR ${inv.total}</h3>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const filtered = invoices.filter((inv) =>
    (inv.client || "").toLowerCase().includes(search.toLowerCase()) ||
    (inv._id || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow text-gray-800">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold text-blue-900">View Invoices</h2>
        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-1 border rounded w-72 text-sm" />
      </div>

      <table className="min-w-full text-sm border">
        <thead className="bg-blue-100 text-blue-900">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Client</th>
            <th className="p-2">Date</th>
            <th className="p-2">Due</th>
            <th className="p-2">Total</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((inv) =>
            editingId === inv._id ? (
              <tr key={inv._id}>
                <td className="p-2">{inv._id.slice(-6)}</td>
                <td className="p-2"><input value={editedInvoice.client} onChange={(e) => setEditedInvoice({ ...editedInvoice, client: e.target.value })} className="border p-1 w-full" /></td>
                <td className="p-2"><input type="date" value={editedInvoice.invoiceDate} onChange={(e) => setEditedInvoice({ ...editedInvoice, invoiceDate: e.target.value })} className="border p-1 w-full" /></td>
                <td className="p-2"><input type="date" value={editedInvoice.dueDate} onChange={(e) => setEditedInvoice({ ...editedInvoice, dueDate: e.target.value })} className="border p-1 w-full" /></td>
                <td className="p-2"><input type="number" value={editedInvoice.total} onChange={(e) => setEditedInvoice({ ...editedInvoice, total: parseFloat(e.target.value) })} className="border p-1 w-24" /></td>
                <td className="p-2">
                  <button onClick={handleSaveEdit} className="text-green-600">✅</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500 ml-2">❌</button>
                </td>
              </tr>
            ) : (
              <tr key={inv._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{inv._id?.slice(-6)}</td>
                <td className="p-2">{inv.client}</td>
                <td className="p-2">{inv.invoiceDate}</td>
                <td className="p-2">{inv.dueDate}</td>
                <td className="p-2">PKR {inv.total}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => handleEdit(inv)} className="text-blue-600">✏️</button>
                  <button onClick={() => handleDelete(inv._id)} className="text-red-500">🗑️</button>
                  <button onClick={() => handlePrint(inv)} className="text-indigo-600">🖨️</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewInvoices;
