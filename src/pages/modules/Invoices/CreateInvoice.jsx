import React, { useState } from "react";

function CreateInvoice() {
  const [client, setClient] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([{ name: "", quantity: 1, price: 0 }]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === "quantity" || field === "price" ? parseFloat(value) : value;
    setItems(updatedItems);
  };

  const addItem = () => setItems([...items, { name: "", quantity: 1, price: 0 }]);
  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const calculateSubtotal = () =>
    items.reduce((total, item) => total + item.quantity * item.price, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invoiceData = {
      client,
      invoiceDate,
      dueDate,
      remarks,
      items,
      total: calculateSubtotal(),
    };

    try {
      const res = await fetch("https://back-8.onrender.com/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });

      if (res.ok) {
        alert("Invoice created!");
        setClient("");
        setInvoiceDate("");
        setDueDate("");
        setRemarks("");
        setItems([{ name: "", quantity: 1, price: 0 }]);
      } else {
        alert("Error saving invoice");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow text-gray-800">
      <h2 className="text-xl font-bold mb-4 text-blue-900">Create Invoice</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <input required value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client Name" className="p-2 border rounded" />
          <input required type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="p-2 border rounded" />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="p-2 border rounded" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-blue-800">Items</h3>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="px-2 py-1 border rounded w-60 text-sm" />
          </div>

          <table className="w-full text-sm">
            <thead><tr className="text-left border-b border-gray-300"><th>Item</th><th>Qty</th><th>Price</th><th>Total</th><th /></tr></thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td><input value={item.name} onChange={(e) => handleItemChange(idx, "name", e.target.value)} required className="p-1 border rounded w-full" /></td>
                  <td><input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(idx, "quantity", e.target.value)} className="p-1 border rounded w-20" /></td>
                  <td><input type="number" min="0" value={item.price} onChange={(e) => handleItemChange(idx, "price", e.target.value)} className="p-1 border rounded w-24" /></td>
                  <td className="text-right pr-4">PKR {(item.quantity * item.price).toFixed(2)}</td>
                  <td><button type="button" onClick={() => removeItem(idx)} className="text-red-500">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <button type="button" onClick={addItem} className="mt-2 px-3 py-1 bg-blue-100 text-blue-900 rounded">+ Add Item</button>
        </div>

        <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Remarks..." className="w-full p-2 border rounded" rows={3} />

        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-blue-900">Subtotal: PKR {calculateSubtotal().toFixed(2)}</div>
          <button type="submit" className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-800">Save Invoice</button>
        </div>
      </form>
    </div>
  );
}

export default CreateInvoice;
