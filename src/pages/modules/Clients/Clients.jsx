import React, { useState, useEffect } from "react";

function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    type: "Retail",
    cnic: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const API = "https://back-8.onrender.com/api/clients";

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return alert("Name and phone are required");

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const newClient = await res.json();
    setClients([newClient, ...clients]);

    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      type: "Retail",
      cnic: "",
    });
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setClients(clients.filter((c) => c._id !== id));
  };

  const handleEdit = (client) => {
    setEditingId(client._id);
    setEditForm(client);
  };

  const handleSaveEdit = async () => {
    const res = await fetch(`${API}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    const updated = await res.json();
    setClients(clients.map((c) => (c._id === editingId ? updated : c)));
    setEditingId(null);
    setEditForm({});
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow text-gray-800">
      <h2 className="text-xl font-bold text-blue-900 mb-4">Clients Management</h2>

      {/* Export Buttons */}
      <div className="mb-4 flex gap-3">
        <a
          href={`${API}/export/csv`}
          className="px-3 py-1 bg-green-700 text-white rounded hover:bg-green-800 text-sm"
        >
          Export CSV
        </a>
        <a
          href={`${API}/export/pdf`}
          className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800 text-sm"
        >
          Export PDF
        </a>
      </div>

      {/* Add Client Form */}
      <form onSubmit={handleAddClient} className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="p-2 border rounded"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="p-2 border rounded"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-2 border rounded"
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="p-2 border rounded col-span-2"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option>Retail</option>
          <option>Wholesale</option>
          <option>Other</option>
        </select>
        <input
          name="cnic"
          value={form.cnic}
          onChange={handleChange}
          placeholder="CNIC / Notes"
          className="p-2 border rounded col-span-3"
        />
        <button
          type="submit"
          className="bg-blue-900 text-white rounded px-4 py-2 hover:bg-blue-800 col-span-3"
        >
          Add Client
        </button>
      </form>

      {/* Search */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-semibold text-blue-800">Clients List</h3>
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-1 px-2 border rounded text-sm w-64"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Email</th>
              <th className="p-2">Type</th>
              <th className="p-2">Address</th>
              <th className="p-2">CNIC / Notes</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((c) => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  {editingId === c._id ? (
                    <>
                      <td className="p-1">
                        <input
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="border p-1 rounded"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          name="phone"
                          value={editForm.phone}
                          onChange={handleEditChange}
                          className="border p-1 rounded"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          className="border p-1 rounded"
                        />
                      </td>
                      <td className="p-1">
                        <select
                          name="type"
                          value={editForm.type}
                          onChange={handleEditChange}
                          className="border p-1 rounded"
                        >
                          <option>Retail</option>
                          <option>Wholesale</option>
                          <option>Other</option>
                        </select>
                      </td>
                      <td className="p-1">
                        <input
                          name="address"
                          value={editForm.address}
                          onChange={handleEditChange}
                          className="border p-1 rounded"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          name="cnic"
                          value={editForm.cnic}
                          onChange={handleEditChange}
                          className="border p-1 rounded"
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
                      <td className="p-2">{c.name}</td>
                      <td className="p-2">{c.phone}</td>
                      <td className="p-2">{c.email}</td>
                      <td className="p-2">{c.type}</td>
                      <td className="p-2">{c.address}</td>
                      <td className="p-2">{c.cnic}</td>
                      <td className="p-2 space-x-2">
                        <button
                          onClick={() => handleEdit(c)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
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
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clients;
