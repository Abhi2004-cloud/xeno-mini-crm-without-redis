"use client";
import { useEffect, useState } from "react";

export default function IngestPage() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    totalSpend: "",
    visits: "",
    lastActiveAt: "",
  });

  async function fetchCustomers() {
    const res = await fetch("/api/customers");
    const data = await res.json();
    if (data.ok) setCustomers(data.customers);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function addCustomer(e) {
    e.preventDefault();
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        totalSpend: form.totalSpend ? Number(form.totalSpend) : undefined,
        visits: form.visits ? Number(form.visits) : undefined,
        lastActiveAt: form.lastActiveAt || undefined,
      }),
    });

    const data = await res.json();
    if (data.ok) {
      alert("Customer added!");
      setForm({ name: "", email: "", totalSpend: "", visits: "", lastActiveAt: "" });
      fetchCustomers();
    } else {
      alert("Error: " + data.error);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Add Customer</h2>
      <form onSubmit={addCustomer} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{ display: "block", marginBottom: 8, padding: 6 }}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={{ display: "block", marginBottom: 8, padding: 6 }}
        />
        <input
          type="number"
          placeholder="Total Spend"
          value={form.totalSpend}
          onChange={(e) => setForm({ ...form, totalSpend: e.target.value })}
          style={{ display: "block", marginBottom: 8, padding: 6 }}
        />
        <input
          type="number"
          placeholder="Visits"
          value={form.visits}
          onChange={(e) => setForm({ ...form, visits: e.target.value })}
          style={{ display: "block", marginBottom: 8, padding: 6 }}
        />
        <input
          type="date"
          placeholder="Last Active At"
          value={form.lastActiveAt}
          onChange={(e) => setForm({ ...form, lastActiveAt: e.target.value })}
          style={{ display: "block", marginBottom: 8, padding: 6 }}
        />
        <button type="submit">Add Customer</button>
      </form>

      <h2>Customers</h2>
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Total Spend</th>
            <th>Visits</th>
            <th>Last Active</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.totalSpend}</td>
              <td>{c.visits}</td>
              <td>{new Date(c.lastActiveAt).toISOString().split("T")[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
