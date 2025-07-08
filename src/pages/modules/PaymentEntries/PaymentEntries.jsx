import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://back-7-9sog.onrender.com/api/payments";

function PaymentEntries() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    payer: "",
    amount: "",
    method: "Cash",
    date: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(API);
      setPayments(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API, form);
      setPayments([res.data, ...payments]);
      setForm({
        payer: "",
        amount: "",
        method: "Cash",
        date: "",
        notes: "",
      });
    } catch (err) {
      alert("Failed to add payment");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setPayments(payments.filter((p) => p._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const handleEdit = (payment) => {
    setEditingId(payment._id);
    setEditForm(payment);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(`${API}/${editingId}`, editForm);
      setPayments(
        payments.map((p) => (p._id === editingId ? res.data : p))
      );
      setEditingId(null);
      setEditForm({});
    } catch {
      alert("Update failed");
    }
  };

  const handleExport = (type) => {
    const url = `${API}/export/${type}`;
    window.open(url, "_blank");
  };

  const filtered = payments.filter((p) =>
    p.payer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow text-gray-800">
      <h2 className="text-xl font-bold text-blue-900 mb-4">Payment Entries</h2>

      {/* Add Form */}
      <form
        onSubmit={handleAddPayment}
        className="grid md:grid-cols-3 gap-4 mb-6"
      >
        <input
          name="payer"
          value={form.payer}
          onChange={handleChange}
          placeholder="Client or Vendor Name"
          className="p-2 border rounded"
          required
        />
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount in PKR"
          className="p-2 border rounded"
          required
        />
        <select
          name="method"
          value={form.method}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option>Cash</option>
          <option>Bank Transfer</option>
          <option>Cheque</option>
          <option>Other</option>
        </select>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes / Ref #"
          className="p-2 border rounded col-span-2"
        />
        <button
          type="submit"
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Add Payment
        </button>
      </form>

      {/* Tools */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-semibold text-blue-800">Payment History</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-1 px-2 border rounded text-sm"
          />
          <button
            onClick={() => handleExport("csv")}
            className="text-sm text-blue-700 hover:underline"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="text-sm text-blue-700 hover:underline"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="p-2">Payer</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Method</th>
              <th className="p-2">Date</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  {editingId === p._id ? (
                    <>
                      <td className="p-1">
                        <input
                          className="border p-1 rounded"
                          name="payer"
                          value={editForm.payer}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="p-1">
                        <input
                          className="border p-1 rounded"
                          name="amount"
                          type="number"
                          value={editForm.amount}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="p-1">
                        <select
                          name="method"
                          value={editForm.method}
                          onChange={handleEditChange}
                          className="border p-1 rounded"
                        >
                          <option>Cash</option>
                          <option>Bank Transfer</option>
                          <option>Cheque</option>
                          <option>Other</option>
                        </select>
                      </td>
                      <td className="p-1">
                        <input
                          className="border p-1 rounded"
                          name="date"
                          type="date"
                          value={editForm.date?.slice(0, 10)}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="p-1">
                        <input
                          className="border p-1 rounded"
                          name="notes"
                          value={editForm.notes}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="p-2 space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:underline"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2">{p.payer}</td>
                      <td className="p-2 font-semibold text-blue-900">
                        Rs {p.amount}
                      </td>
                      <td className="p-2">{p.method}</td>
                      <td className="p-2">{p.date?.slice(0, 10)}</td>
                      <td className="p-2">{p.notes}</td>
                      <td className="p-2 space-x-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No payment entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentEntries;
