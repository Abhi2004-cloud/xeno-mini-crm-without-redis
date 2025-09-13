// app/campaigns/DeliveryLogs.jsx
"use client";
import { useEffect, useState } from "react";

export default function DeliveryLogs() {
  const [logs, setLogs] = useState([]);

  async function fetchLogs() {
    try {
      const res = await fetch("/api/logs");
      const data = await res.json();
      if (data.ok) setLogs(data.logs);
    } catch (e) {
      console.error("fetchLogs error", e);
    }
  }

  useEffect(() => {
    fetchLogs();
    const id = setInterval(fetchLogs, 2000); // poll every 2s
    return () => clearInterval(id);
  }, []);

  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Campaign</th>
            <th>Email</th>
            <th>Message</th>
            <th>Status</th>
            <th>Vendor ID</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l._id}>
              <td>{l.campaignId?.toString?.() ?? l.campaignId}</td>
              <td>{l.customerEmail}</td>
              <td style={{ maxWidth: 300 }}>{l.message}</td>
              <td>{l.status}</td>
              <td>{l.vendorMessageId ?? "-"}</td>
              <td>{new Date(l.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


