//app/ingest/page.js
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
    <main className="container py-4">
      <h2 className="mb-4">Add Customer</h2>
      <form onSubmit={addCustomer} className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Total Spend"
            value={form.totalSpend}
            onChange={(e) => setForm({ ...form, totalSpend: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Visits"
            value={form.visits}
            onChange={(e) => setForm({ ...form, visits: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={form.lastActiveAt}
            onChange={(e) => setForm({ ...form, lastActiveAt: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-success w-100">
            Add Customer
          </button>
        </div>
      </form>

      <h2>Customers</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-dark">
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
      </div>
    </main>
  );
}

